const PricingSection = ({ pricingPlans = [] }) => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-4 py-1 text-sm font-semibold text-purple-700">
                        Pricing
                    </span>
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="mt-4 mx-auto max-w-2xl text-lg text-gray-500">
                        Choose the plan that&apos;s right for you and start sharing with confidence.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 lg:grid-cols-3">
                    {pricingPlans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-3xl border p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                plan.highlighted
                                    ? "border-purple-200 bg-gradient-to-b from-purple-600 to-indigo-600 text-white shadow-purple-200"
                                    : "border-gray-200 bg-white"
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-700 shadow-sm">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className={`text-2xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                                        {plan.name}
                                    </h3>
                                    <p className={`mt-3 text-sm leading-6 ${plan.highlighted ? "text-purple-100" : "text-gray-500"}`}>
                                        {plan.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex items-end gap-1">
                                <span className={`text-5xl font-extrabold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                                    {plan.price}
                                </span>
                                <span className={`pb-1 text-sm font-medium ${plan.highlighted ? "text-purple-100" : "text-gray-500"}`}>
                                    {plan.period}
                                </span>
                            </div>

                            <ul className="mt-8 space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className={`flex items-center gap-3 text-sm ${plan.highlighted ? "text-white/90" : "text-gray-600"}`}>
                                        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${plan.highlighted ? "bg-white/20" : "bg-purple-100"}`}>
                                            <span className={`h-2 w-2 rounded-full ${plan.highlighted ? "bg-white" : "bg-purple-600"}`} />
                                        </span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href="/subscription"
                                className={`mt-10 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                                    plan.highlighted
                                        ? "bg-white text-purple-700 shadow-lg shadow-purple-900/20 hover:bg-purple-50"
                                        : "bg-purple-600 text-white hover:bg-purple-700"
                                }`}
                            >
                                {plan.buttonText}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PricingSection;