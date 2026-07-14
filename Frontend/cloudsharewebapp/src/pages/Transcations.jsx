import { useAuth } from "@clerk/react";
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { apiRequest, formatRelativeTime } from "../lib/api";
import { getClerkToken } from "../lib/clerk";

const Transcations = () => {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [credits, setCredits] = useState(null);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoaded || !isSignedIn) {
            return;
        }

        let active = true;

        const loadTransactions = async () => {
            try {
                const token = await getClerkToken(getToken);
                const [credits, profile] = await Promise.all([
                    apiRequest("/payments/credits", { token }),
                    apiRequest("/profile/me", { token }),
                ]);

                if (active) {
                    setCredits(credits);
                    setProfile(profile);
                    setTransactions([
                        {
                            id: profile.id || "current-profile",
                            type: "Credit balance snapshot",
                            status: credits > 0 ? "Healthy" : "Low",
                            amount: `${credits} credits`,
                            createdAt: profile.createdAt,
                            detail: `Last synced for ${profile.email}`,
                        },
                    ]);
                }
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to load transactions");
                }
            }
        };

        loadTransactions();

        return () => {
            active = false;
        };
    }, [getToken, isLoaded, isSignedIn]);

    const activitySummary = useMemo(() => {
        return [
            {
                label: "Current credits",
                value: credits ?? "...",
            },
            {
                label: "Profile",
                value: profile?.email || "Loading",
            },
            {
                label: "Billing status",
                value: credits > 0 ? "Active" : "Needs top-up",
            },
        ];
    }, [credits, profile]);

    return (
        <DashboardLayout title="Transactions">
            <section className="dashboard-panel transaction-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Transaction History</h2>
                        <p>Track payments, credit usage, and billing activity.</p>
                    </div>
                </div>

                <div className="transaction-summary-grid">
                    {activitySummary.map((item) => (
                        <article key={item.label} className="transaction-summary-card">
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                        </article>
                    ))}
                </div>

                {error ? <div className="dashboard-banner error">{error}</div> : null}

                <table className="files-table">
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{transaction.id}</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.status}</td>
                                <td>{transaction.amount}</td>
                                <td>
                                    <div>{formatRelativeTime(transaction.createdAt)}</div>
                                    <small>{transaction.detail}</small>
                                </td>
                            </tr>
                        ))}
                        {!transactions.length ? (
                            <tr>
                                <td colSpan="5" className="dashboard-empty-state">
                                    Razorpay transactions will appear here after you purchase credits.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </section>
        </DashboardLayout>
    );
};

export default Transcations;