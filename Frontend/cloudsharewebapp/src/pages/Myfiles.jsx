import { useAuth } from "@clerk/react";
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { API_BASE_URL, apiRequest, formatFileSize, formatRelativeTime } from "../lib/api";
import { getClerkToken } from "../lib/clerk";

const Myfiles = () => {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoaded || !isSignedIn) {
            return;
        }

        let active = true;

        const loadFiles = async () => {
            setLoading(true);
            setError("");

            try {
                const token = await getClerkToken(getToken);
                const response = await apiRequest("/files/my", { token });
                if (active) {
                    setFiles(Array.isArray(response) ? response : []);
                }
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to load files");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadFiles();

        return () => {
            active = false;
        };
    }, [getToken, isLoaded, isSignedIn]);

    const fileSummary = useMemo(() => {
        const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
        return {
            totalSize: formatFileSize(totalSize),
            publicCount: files.filter((file) => file.isPublic).length,
        };
    }, [files]);

    const togglePublic = async (id) => {
        const token = await getClerkToken(getToken);
        await apiRequest(`/files/${id}/toggle-public`, { method: "PATCH", token });
        const refreshed = await apiRequest("/files/my", { token });
        setFiles(Array.isArray(refreshed) ? refreshed : []);
    };

    const deleteFile = async (id) => {
        const token = await getClerkToken(getToken);
        await apiRequest(`/files/${id}`, { method: "DELETE", token });
        setFiles((current) => current.filter((file) => file.id !== id));
    };

    const copyShareLink = async (fileId) => {
        await navigator.clipboard?.writeText(`${window.location.origin}/public-files/${fileId}`);
    };

    return (
        <DashboardLayout title="My Files">
            <section className="dashboard-panel file-library-panel">
                <div className="panel-heading">
                    <div>
                        <h2>File Library</h2>
                        <p>Browse your uploaded files, manage sharing, and access downloads.</p>
                    </div>
                    <div className="library-summary">
                        <span>{files.length} files</span>
                        <span>{fileSummary.totalSize}</span>
                        <span>{fileSummary.publicCount} public</span>
                    </div>
                </div>

                {error ? <div className="dashboard-banner error">{error}</div> : null}

                <div className="library-grid">
                    {files.map((file) => (
                        <article key={file.id} className="file-card">
                            <div className="file-card-top">
                                <div>
                                    <h3>{file.name}</h3>
                                    <p>{file.type || "File"} · {formatFileSize(file.size)}</p>
                                </div>
                                <span className={`file-visibility-pill ${file.isPublic ? "public" : "private"}`}>
                                    {file.isPublic ? "Public" : "Private"}
                                </span>
                            </div>

                            <div className="file-card-meta">
                                <span>Uploaded {formatRelativeTime(file.uploadedAt)}</span>
                                <span>{file.fileLocation ? "Stored on backend" : "No file location"}</span>
                            </div>

                            <div className="file-card-actions">
                                <a className="quick-action-btn" href={`${API_BASE_URL}/files/download/${file.id}`} target="_blank" rel="noreferrer">
                                    Download
                                </a>
                                {file.isPublic ? (
                                    <a className="quick-action-btn" href={`/public-files/${file.id}`} target="_blank" rel="noreferrer">
                                        Open public page
                                    </a>
                                ) : null}
                                <button type="button" className="quick-action-btn" onClick={() => togglePublic(file.id)}>
                                    {file.isPublic ? "Make private" : "Make public"}
                                </button>
                                <button type="button" className="quick-action-btn" onClick={() => copyShareLink(file.id)}>
                                    Copy share link
                                </button>
                                <button type="button" className="quick-action-btn danger" onClick={() => deleteFile(file.id)}>
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}

                    {!files.length && !loading ? (
                        <div className="dashboard-empty-state wide">
                            No files uploaded yet. Use the Upload page to add your first document.
                        </div>
                    ) : null}
                </div>
            </section>
        </DashboardLayout>
    );
};

export default Myfiles;