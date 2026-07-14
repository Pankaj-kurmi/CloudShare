import {
    ArrowUpRight,
    Clock3,
    FileUp,
    FolderOpenDot,
    HardDriveDownload,
    ShieldCheck,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { apiRequest, formatFileSize, formatRelativeTime } from "../lib/api";
import { getClerkToken } from "../lib/clerk";

const STORAGE_LIMIT_BYTES = 100 * 1024 * 1024 * 1024;

const Dashboard = () => {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const { user } = useUser();
    const [files, setFiles] = useState([]);
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoaded || !isSignedIn) {
            return;
        }

        let active = true;

        const loadDashboard = async () => {
            setLoading(true);
            setError("");

            try {
                const token = await getClerkToken(getToken);
                const [profileResponse, filesResponse, creditsResponse] = await Promise.all([
                    apiRequest("/profile/me", { token }),
                    apiRequest("/files/my", { token }),
                    apiRequest("/payments/credits", { token }),
                ]);

                if (!active) {
                    return;
                }

                setFiles(Array.isArray(filesResponse) ? filesResponse : []);
                setCredits({
                    total: creditsResponse,
                    profile: profileResponse,
                });
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to load dashboard data");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            active = false;
        };
    }, [getToken, isLoaded, isSignedIn]);

    const dashboardStats = useMemo(() => {
        const storageUsed = files.reduce((sum, file) => sum + (file.size || 0), 0);
        const publicFiles = files.filter((file) => file.isPublic).length;
        const securityScore = credits?.total > 0 ? 94 : 68;

        return [
            {
                title: "Files Stored",
                value: String(files.length),
                hint: `${publicFiles} public`,
                icon: FolderOpenDot,
            },
            {
                title: "Storage Used",
                value: formatFileSize(storageUsed),
                hint: `of ${formatFileSize(STORAGE_LIMIT_BYTES)}`,
                icon: HardDriveDownload,
            },
            {
                title: "Shared Links",
                value: String(publicFiles),
                hint: `${Math.max(0, files.length - publicFiles)} private`,
                icon: ArrowUpRight,
            },
            {
                title: "Security Score",
                value: `${securityScore}%`,
                hint: securityScore >= 90 ? "Excellent" : "Needs attention",
                icon: ShieldCheck,
            },
        ];
    }, [credits?.total, files]);

    const recentFiles = useMemo(
        () => files.slice(0, 4).map((file) => ({
            ...file,
            updated: formatRelativeTime(file.uploadedAt),
            visibility: file.isPublic ? "Public" : "Private",
        })),
        [files],
    );

    return (
        <DashboardLayout title="Dashboard">
            {error ? <div className="dashboard-banner error">{error}</div> : null}

            {loading ? <div className="dashboard-banner">Loading your files and credits…</div> : null}

            <section className="dashboard-stats-grid">
                {dashboardStats.map(({ title, value, hint, icon: Icon }) => (
                    <article key={title} className="dashboard-stat-card">
                        <div className="dashboard-stat-icon">
                            <Icon size={18} />
                        </div>
                        <div className="dashboard-stat-content">
                            <p>{title}</p>
                            <h3>{value}</h3>
                            <span>{hint}</span>
                        </div>
                    </article>
                ))}
            </section>

            <section className="dashboard-main-grid">
                <article className="dashboard-panel">
                    <div className="panel-heading">
                        <h2>Recent Files</h2>
                        <Link className="panel-action-btn" to="/my-files">
                            View all
                        </Link>
                    </div>

                    <div className="files-table-wrap">
                        <table className="files-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Size</th>
                                    <th>Updated</th>
                                    <th>Access</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentFiles.map((file) => (
                                    <tr key={file.id || file.name}>
                                        <td>{file.name}</td>
                                        <td>{file.type}</td>
                                        <td>{formatFileSize(file.size)}</td>
                                        <td>{file.updated}</td>
                                        <td>
                                            <span className="file-visibility-pill">{file.visibility}</span>
                                        </td>
                                    </tr>
                                ))}
                                {!recentFiles.length && !loading ? (
                                    <tr>
                                        <td colSpan="5" className="dashboard-empty-state">
                                            Upload a file to populate this list.
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </article>

                <div className="dashboard-side-panels">
                    <article className="dashboard-panel">
                        <div className="panel-heading">
                            <h2>Quick Actions</h2>
                        </div>
                        <div className="quick-actions-list">
                            <Link to="/upload" className="quick-action-btn primary">
                                <FileUp size={16} />
                                Upload New File
                            </Link>
                            <Link to="/subscription" className="quick-action-btn">
                                <ArrowUpRight size={16} />
                                Upgrade Storage
                            </Link>
                            <Link to="/my-files" className="quick-action-btn">
                                <Clock3 size={16} />
                                View Recent Activity
                            </Link>
                        </div>
                    </article>

                    <article className="dashboard-panel">
                        <div className="panel-heading">
                            <h2>Storage Overview</h2>
                        </div>

                        <div className="storage-meter">
                            <div className="storage-meter-fill" style={{ width: "72%" }} />
                        </div>
                        <div className="storage-meta">
                            <span>{formatFileSize(files.reduce((sum, file) => sum + (file.size || 0), 0))} used</span>
                            <span>{formatFileSize(STORAGE_LIMIT_BYTES)} total</span>
                        </div>
                        <p className="storage-note">
                            {credits?.total != null
                                ? `You have ${credits.total} credits remaining and ${user?.fullName || "your account"} is ready for more uploads.`
                                : "Your credit balance is loading."}
                        </p>
                    </article>
                </div>
            </section>
        </DashboardLayout>
    );
};

export default Dashboard;