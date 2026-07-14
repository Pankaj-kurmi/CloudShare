import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL, apiRequest, formatFileSize, formatRelativeTime } from "../lib/api";

const PublicFileView = () => {
    const { id } = useParams();
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");

    const previewUrl = useMemo(() => {
        if (!file?.fileLocation) {
            return null;
        }

        const fileName = file.fileLocation.split(/[\\/]/).pop();
        return `${API_BASE_URL}/upload/${fileName}`;
    }, [file]);

    const shareUrl = `${window.location.origin}/public-files/${id}`;

    useEffect(() => {
        let active = true;

        const loadFile = async () => {
            try {
                const response = await apiRequest(`/files/public/${id}`);
                if (active) {
                    setFile(response);
                }
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to load file");
                }
            }
        };

        loadFile();

        return () => {
            active = false;
        };
    }, [id]);

    if (error) {
        return (
            <div className="public-file-page">
                <article className="public-file-card public-file-error-card">
                    <p className="public-file-kicker">Public file</p>
                    <h1>Unavailable</h1>
                    <p>{error}</p>
                </article>
            </div>
        );
    }

    if (!file) {
        return <div className="public-file-page">Loading public file…</div>;
    }

    return (
        <div className="public-file-page">
            <article className="public-file-card">
                <p className="public-file-kicker">Public file</p>
                <h1>{file.name}</h1>
                <div className="public-file-meta">
                    <span>{file.type || "File"}</span>
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatRelativeTime(file.uploadedAt)}</span>
                </div>
                {previewUrl ? (
                    <div className="public-file-preview">
                        {file.type?.startsWith("image/") ? (
                            <img src={previewUrl} alt={file.name} />
                        ) : file.type?.startsWith("video/") ? (
                            <video controls src={previewUrl} />
                        ) : file.type === "application/pdf" ? (
                            <iframe title={file.name} src={previewUrl} />
                        ) : (
                            <div className="public-file-preview-fallback">
                                Preview unavailable for this file type.
                            </div>
                        )}
                    </div>
                ) : null}
                <div className="public-file-actions">
                    <a href={`${API_BASE_URL}/files/download/${file.id}`} className="quick-action-btn primary" target="_blank" rel="noreferrer">
                        Download file
                    </a>
                    <button
                        type="button"
                        className="quick-action-btn"
                        onClick={() => navigator.clipboard?.writeText(shareUrl)}
                    >
                        Copy share link
                    </button>
                </div>
                <p className="public-file-share-note">Share this page link with anyone who should view the file.</p>
            </article>
        </div>
    );
};

export default PublicFileView;