import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { apiRequest, formatFileSize } from "../lib/api";
import { getClerkToken } from "../lib/clerk";
import { loadRazorpayScript } from "../lib/rzp";

const Subscription = () => {
    const { isLoaded, isSignedIn, getToken, userId } = useAuth();
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
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
                    setCredits(currentCredits);
                }
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to load subscription data");
                }
            }
        };

        loadCredits();

        return () => {
            active = false;
        };
    }, [getToken, isLoaded, isSignedIn]);

    const startCheckout = async (creditsToBuy) => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const token = await getClerkToken(getToken);
            const razorpayReady = await loadRazorpayScript();

            if (!razorpayReady) {
                throw new Error("Unable to load Razorpay checkout");
            }

            const order = await apiRequest("/payments/orders", {
                method: "POST",
                token,
                body: { credits: creditsToBuy },
            });

            const options = {
                key: order.keyId,
                amount: order.amountPaise,
                currency: order.currency,
                name: "CloudShare",
                description: `${order.credits} credits purchase`,
                order_id: order.orderId,
                handler: async (response) => {
                    const verifyResponse = await apiRequest("/payments/verify", {
                        method: "POST",
                        token,
                        body: {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        },
                    });

                    setCredits(verifyResponse.remainingCredits);
                    setMessage(`Payment verified. ${verifyResponse.creditsAdded} credits added.`);
                },
                prefill: {
                    email: userId || undefined,
                },
                theme: {
                    color: "#7b31f0",
                },
            };

            const checkout = new window.Razorpay(options);
            checkout.open();
        } catch (err) {
            setError(err.message || "Unable to start checkout");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Subscription">
            <section className="dashboard-panel billing-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Subscription & Billing</h2>
                        <p>Purchase credits through Razorpay and keep your account topped up.</p>
                    </div>
                    <div className="library-summary">
                        <span>Current credits</span>
                        <strong>{credits ?? "..."}</strong>
                    </div>
                </div>

                {error ? <div className="dashboard-banner error">{error}</div> : null}
                {message ? <div className="dashboard-banner success">{message}</div> : null}

                <div className="billing-grid">
                    <article className="billing-card featured">
                        <h3>Starter top-up</h3>
                        <p>Ideal for occasional uploads and light sharing.</p>
                        <strong>{formatFileSize(10 * 1024 * 1024)} transfer capacity</strong>
                        <button type="button" className="quick-action-btn primary" onClick={() => startCheckout(10)} disabled={loading}>
                            Buy 10 credits
                        </button>
                    </article>

                    <article className="billing-card">
                        <h3>Growth top-up</h3>
                        <p>Best for teams that upload frequently.</p>
                        <strong>{formatFileSize(50 * 1024 * 1024)} transfer capacity</strong>
                        <button type="button" className="quick-action-btn primary" onClick={() => startCheckout(50)} disabled={loading}>
                            Buy 50 credits
                        </button>
                    </article>

                    <article className="billing-card">
                        <h3>Power top-up</h3>
                        <p>Large credit pack for active file sharing.</p>
                        <strong>{formatFileSize(100 * 1024 * 1024)} transfer capacity</strong>
                        <button type="button" className="quick-action-btn primary" onClick={() => startCheckout(100)} disabled={loading}>
                            Buy 100 credits
                        </button>
                    </article>
                </div>
            </section>
        </DashboardLayout>
    );
};

export default Subscription;