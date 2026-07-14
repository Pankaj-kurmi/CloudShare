const CTASection = () => {
    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#9333EA] px-8 py-12 shadow-[0_24px_60px_rgba(124,58,237,0.28)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_35%)] pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/80">
                                CloudShare
                            </p>
                            <h2 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                                Ready to get started?
                                <span className="block text-white/90">
                                    Create your account today.
                                </span>
                            </h2>
                        </div>

                        <a
                            href="/subscription"
                            className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-lg font-semibold text-purple-700 shadow-[0_14px_30px_rgba(255,255,255,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-purple-50 hover:shadow-[0_18px_36px_rgba(255,255,255,0.24)]"
                        >
                            Sign up for free
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CTASection;