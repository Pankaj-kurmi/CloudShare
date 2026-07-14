const FooterSection = () => {
    return (
        <footer className="bg-slate-950 text-slate-300">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <div className="inline-flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-lg font-black text-white shadow-lg shadow-purple-500/20">
                                C
                            </div>
                            <div>
                                <p className="text-lg font-bold text-white">CloudShare</p>
                                <p className="text-sm text-slate-400">Secure file sharing</p>
                            </div>
                        </div>

                        <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
                            Upload, organize, and share files with confidence. CloudShare helps teams and creators keep everything secure and accessible.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                            Product
                        </h3>
                        <ul className="mt-5 space-y-3 text-sm">
                            <li><a href="/dashboard" className="transition hover:text-white">Dashboard</a></li>
                            <li><a href="/upload" className="transition hover:text-white">Upload Files</a></li>
                            <li><a href="/my-files" className="transition hover:text-white">My Files</a></li>
                            <li><a href="/subscription" className="transition hover:text-white">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                            Company
                        </h3>
                        <ul className="mt-5 space-y-3 text-sm">
                            <li><a href="/" className="transition hover:text-white">Home</a></li>
                            <li><a href="/dashboard" className="transition hover:text-white">About</a></li>
                            <li><a href="/subscription" className="transition hover:text-white">Plans</a></li>
                            <li><a href="/upload" className="transition hover:text-white">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                            Contact
                        </h3>
                        <ul className="mt-5 space-y-3 text-sm text-slate-400">
                            <li>support@cloudshare.com</li>
                            <li>+91 98765 43210</li>
                            <li>Open Mon - Fri, 9AM - 6PM</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-14 border-t border-white/10 pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500">
                            © 2026 CloudShare. All rights reserved.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                            <a href="/subscription" className="transition hover:text-white">Privacy Policy</a>
                            <a href="/subscription" className="transition hover:text-white">Terms of Service</a>
                            <a href="/subscription" className="transition hover:text-white">Security</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FooterSection;