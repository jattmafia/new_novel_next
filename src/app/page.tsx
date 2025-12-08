import AuthRedirectGuard from "@/components/AuthRedirectGuard";

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Animated gradient orbs - premium effect */}
      <div className="absolute -top-96 -left-96 w-full h-full bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/4 -right-96 w-full h-full bg-amber-400 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-0 left-1/3 w-full h-full bg-purple-400 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob" style={{ animationDelay: '4s' }}></div>

      {/* Gradient veil */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-950/90 to-slate-950 pointer-events-none"></div>

      <AuthRedirectGuard />

      {/* Premium Header */}
      <header className="border-b border-purple-500/10 bg-slate-950/50 backdrop-blur-2xl sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between relative z-10">
          <a href="/" className="group flex items-center gap-2 sm:gap-3">
            <img
              src="/logo.png"
              alt="Rowllr"
              className="w-10 h-10 rounded-xl shadow-lg shadow-purple-500/30 group-hover:shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-300"
            />
            <div className="hidden sm:block">
              <div className="text-lg font-black bg-linear-to-r from-purple-300 to-amber-300 bg-clip-text text-transparent">Rowllr</div>
              <div className="text-xs text-gray-400">Stories Unite Readers</div>
            </div>
          </a>

          <nav className="flex items-center gap-2 sm:gap-4">
            <a
              href="/signup"
              className="rounded-lg bg-linear-to-r from-purple-600 to-amber-500 px-6 py-2.5 text-sm font-bold text-white hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-200 hover:scale-105"
            >
              Start Free
            </a>
            <a
              href="/login"
              className="rounded-lg border border-purple-500/40 px-6 py-2.5 text-sm font-semibold text-purple-200 hover:border-purple-500/80 hover:bg-purple-500/10 transition-all duration-200"
            >
              Log in
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-32 pt-20 relative z-10">
        {/* Hero Section */}
        <section className="mb-32">
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8 max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 w-fit">
                <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-purple-200">2M+ writers already publishing</span>
              </div>

              {/* Hero Headline */}
              <div className="space-y-4">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight">
                  <span className="block">Share your</span>
                  <span className="block bg-linear-to-r from-purple-300 via-purple-200 to-amber-300 bg-clip-text text-transparent drop-shadow-lg">
                    stories
                  </span>
                  <span className="block">with the world</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl">
                Earn 100% from your writing. Build a community of dedicated readers. Get paid from day one—no hidden fees, no compromises.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="/signup"
                  className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-purple-600 to-amber-500 px-8 sm:px-10 py-4 text-base sm:text-lg font-bold text-white shadow-2xl shadow-purple-500/30 hover:shadow-3xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10">Start Writing Free</span>
                  <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-purple-500/50 px-8 sm:px-10 py-4 text-base sm:text-lg font-bold text-purple-200 hover:border-purple-500/80 hover:bg-purple-500/10 transition-all duration-300"
                >
                  I have an account
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-purple-500/20">
                <div className="space-y-2">
                  <div className="text-3xl sm:text-4xl font-black text-amber-400">100%</div>
                  <p className="text-xs sm:text-sm text-gray-400">Royalty Rate</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl sm:text-4xl font-black text-purple-300">0%</div>
                  <p className="text-xs sm:text-sm text-gray-400">Platform Fee</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl sm:text-4xl font-black bg-linear-to-r from-purple-300 to-amber-400 bg-clip-text text-transparent">10M+</div>
                  <p className="text-xs sm:text-sm text-gray-400">Reads/Month</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-linear-to-br from-purple-600/20 to-amber-600/20 rounded-3xl blur-2xl"></div>
              <div className="relative rounded-3xl border border-purple-500/20 bg-slate-800/30 p-2 overflow-hidden backdrop-blur-sm">
                <div className="rounded-2xl bg-slate-900/50 p-6 sm:p-8 min-h-96 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-5xl">📚</div>
                    <p className="text-gray-400">Your stories, your way</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-32">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl sm:text-5xl font-black">
              Everything creators need
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Powerful tools designed specifically for writers to publish, earn, and grow
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: '✍️', title: 'Smart Editor', desc: 'Distraction-free writing with auto-save and formatting tools' },
              { icon: '📊', title: 'Real Analytics', desc: 'Track readers, engagement, and earnings in real-time' },
              { icon: '🤝', title: 'Community', desc: 'Connect with readers and build a loyal fan base' },
              { icon: '💰', title: 'Instant Payouts', desc: 'Earn 100% and cash out whenever you want' },
              { icon: '🌍', title: 'Global Reach', desc: 'Readers from 150+ countries discovering stories' },
              { icon: '🔒', title: 'Full Control', desc: 'Your stories, your rights, your terms' }
            ].map((feature, idx) => (
              <div key={idx} className="group relative rounded-2xl border border-purple-500/20 bg-purple-500/5 p-8 hover:border-purple-500/60 hover:bg-purple-500/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social Proof */}
        <section className="mb-32 bg-linear-to-r from-purple-500/10 via-transparent to-amber-500/10 rounded-3xl border border-purple-500/20 p-12 text-center space-y-12">
          <h2 className="text-4xl font-bold">Trusted by creators worldwide</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-4xl font-black text-amber-400">50K+</div>
              <p className="text-gray-400 text-sm">Active Writers</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-purple-300">$1M+</div>
              <p className="text-gray-400 text-sm">Paid Out</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-amber-400">2M+</div>
              <p className="text-gray-400 text-sm">Active Readers</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-purple-300">4.9★</div>
              <p className="text-gray-400 text-sm">App Rating</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-8 rounded-3xl border border-purple-500/30 bg-linear-to-b from-purple-500/10 to-amber-500/5 p-16">
          <h2 className="text-5xl sm:text-6xl font-black leading-tight">
            Ready to <span className="bg-linear-to-r from-purple-300 to-amber-300 bg-clip-text text-transparent">get published?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of writers earning from their stories. Start free today.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-amber-500 px-12 py-5 text-lg font-bold text-white shadow-2xl shadow-purple-500/30 hover:shadow-3xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            Get Started — Free Forever
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/10 bg-slate-950/80 backdrop-blur mt-32 relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Rowllr"
                  className="w-8 h-8 rounded-lg"
                />
                <span className="font-bold">Rowllr</span>
              </div>
              <p className="text-sm text-gray-400">Empowering writers worldwide</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white">Product</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Features</a>
                <a href="#" className="hover:text-white transition-colors">Pricing</a>
                <a href="#" className="hover:text-white transition-colors">Blog</a>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">About</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
                <a href="#" className="hover:text-white transition-colors">Careers</a>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white">Legal</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
              </div>
            </div>
          </div>
          <div className="border-t border-purple-500/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
            <span>© {new Date().getFullYear()} Rowllr. All rights reserved.</span>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
