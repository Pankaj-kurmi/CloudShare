import { useAuth } from "@clerk/react";
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { apiRequest, formatFileSize } from "../lib/api";
import { getClerkToken } from "../lib/clerk";

const Upload = () => {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [remainingCredits, setRemainingCredits] = useState(null);
    const [uploadResult, setUploadResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoaded || !isSignedIn) {
            return;
        }

        let active = true;

        const loadCredits = async () => {
            try {
                const token = await getClerkToken(getToken);
                const currentCredits = await apiRequest("/payments/credits", { token });

                if (active) {
                    setRemainingCredits(currentCredits);
                }
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to load credit balance");
                }
            }
        };

        loadCredits();

        return () => {
            active = false;
        };
    }, [getToken, isLoaded, isSignedIn]);

    const selectedSummary = useMemo(() => {
        const totalBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
        return {
            count: selectedFiles.length,
            size: formatFileSize(totalBytes),
        };
    }, [selectedFiles]);

    const handleFileChange = (event) => {
        setSelectedFiles(Array.from(event.target.files || []));
        setUploadResult(null);
        setError("");
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!selectedFiles.length) {
            setError("Choose at least one file to upload.");
            return;
        }

        setLoading(true);
        setError("");
        setUploadResult(null);

        try {
            const token = await getClerkToken(getToken);
            const formData = new FormData();
            selectedFiles.forEach((file) => formData.append("files", file));

            const response = await apiRequest("/files/upload", {
                method: "POST",
                token,
                body: formData,
                isFormData: true,
            });

            setUploadResult(response);
            const updatedCredits = response?.remainingCredits;
            if (updatedCredits != null) {
                setRemainingCredits(updatedCredits);
            }
            setSelectedFiles([]);
            event.target.reset();
        } catch (err) {
            setError(err.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Upload">
            <section className="dashboard-panel upload-panel">
                <div className="upload-header">
                    <div>
                        <h2>Upload Center</h2>
                        <p>Send files to the backend, consume credits, and keep the dashboard in sync.</p>
                    </div>
                    <div className="upload-credit-card">
                        <span>Credits remaining</span>
                        <strong>{remainingCredits ?? "..."}</strong>
                    </div>
                </div>

                {error ? <div className="dashboard-banner error">{error}</div> : null}
                {uploadResult ? (
                    <div className="dashboard-banner success">
                        Uploaded {uploadResult.files?.length || 0} file(s). Remaining credits: {uploadResult.remainingCredits}
                    </div>
                ) : null}

                <form className="upload-form" onSubmit={handleUpload}>
                    <label className="upload-dropzone">
                        <input type="file" multiple onChange={handleFileChange} />
                        <span>Select or drop files to upload</span>
                        <small>Files are stored through <code>/files/upload</code> and linked to your Clerk identity.</small>
                    </label>

                    <div className="upload-summary-grid">
                        <article>
                            <span>Selected files</span>
                            <strong>{selectedSummary.count}</strong>
                        </article>
                        <article>
                            <span>Total size</span>
                            <strong>{selectedSummary.size}</strong>
                        </article>
                        <article>
                            <span>Billing rule</span>
                            <strong>1 file = 1 credit</strong>
                        </article>
                    </div>

                    <div className="upload-actions">
                        <button type="submit" className="quick-action-btn primary" disabled={loading}>
                            {loading ? "Uploading…" : "Upload Files"}
                        </button>
                    </div>
                </form>
            </section>
        </DashboardLayout>
    );
};

export default Upload;