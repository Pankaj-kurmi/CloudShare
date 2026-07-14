import { assets } from "../../assets/assets.js";

const HeroSection = ({openSignIn,openSignUp}) => {
    return (
        <section className="landing-page-content relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50 opacity-90 pointer-events-none" />
            <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-purple-200/50 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="py-20 sm:py-24 lg:py-32">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="inline-flex items-center rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-purple-700 shadow-sm ring-1 ring-purple-100">
                            Fast, secure file sharing for teams and creators
                        </span>
                        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block">Share Files Securely with</span>
                            <span className="block text-purple-600">CloudShare</span>
                        </h1>
                        <p className="mt-6 text-base leading-7 text-gray-600 sm:text-lg">
                            Upload, organize, and share files from one simple dashboard. Keep your content private when it needs to be, and public when you want it to be.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <a
                               // href="/dashboard"
                                onClick={openSignUp}
                                className="inline-flex items-center justify-center rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-xl"
                            >
                                Get Started
                            </a>
                            <a
                               //href="/subscription"
                                onClick={openSignIn}
                                className="inline-flex items-center justify-center rounded-full border border-purple-200 bg-white px-6 py-3 text-sm font-semibold text-purple-700 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-300 hover:bg-purple-50"
                            >
                                Sign In
                            </a>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-3 shadow-2xl shadow-purple-100 backdrop-blur sm:p-4">
                                <img
                                    src={assets.dashboard}
                                    alt="CloudShare dashboard preview"
                                    className="h-auto w-full rounded-2xl object-cover"
                                />
                            </div>
                        </div>

                        <div className="mt-12 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                                <div className="text-2xl font-bold text-gray-900">1 click</div>
                                <div className="mt-1 text-sm text-gray-600">Upload and share instantly</div>
                            </div>
                            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                                <div className="text-2xl font-bold text-gray-900">Private</div>
                                <div className="mt-1 text-sm text-gray-600">Keep files secure by default</div>
                            </div>
                            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                                <div className="text-2xl font-bold text-gray-900">Fast</div>
                                <div className="mt-1 text-sm text-gray-600">Move between pages without friction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;