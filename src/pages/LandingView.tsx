import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Heart, Leaf, Quote, Sparkles, X } from 'lucide-react';

export const LandingView: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const handleEnterApp = () => {
    // Navigates directly into the Read experience
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#20221E] font-sans selection:bg-[#30483B]/10 selection:text-[#30483B]">
      <header className="max-w-5xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between">
          <a href="/landing" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#30483B]/10 text-[#30483B] flex items-center justify-center group-hover:bg-[#30483B] group-hover:text-[#F7F3EA] transition-colors">
              <Leaf size={16} strokeWidth={2} />
            </div>
            <span className="font-serif text-3xl font-normal text-[#30483B] lowercase tracking-tight">
              Folia<span className="text-[#B66F5C]">.</span>
            </span>
          </a>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setAuthMode('signin');
                setShowAuthModal(true);
              }}
              className="text-xs md:text-sm font-medium text-[#20221E]/70 hover:text-[#20221E] transition-colors px-3 py-1.5"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="px-5 py-2.5 rounded-full bg-[#30483B] text-[#F7F3EA] text-xs md:text-sm font-medium hover:bg-[#20221E] transition-all shadow-sm flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#30483B]/5 border border-[#30483B]/15 text-[#30483B] font-mono text-xs uppercase tracking-widest">
          <Sparkles size={13} className="text-[#B66F5C]" />
          <span>A Personal Fiction Archive</span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl font-normal text-[#20221E] leading-[1.1] max-w-3xl mx-auto">
          Stories you read shouldn't <span className="italic font-serif text-[#30483B]">disappear</span> when you close the book.
        </h1>

        <p className="text-[#20221E]/70 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
          Folia is a quiet fiction companion for remembering the stories you loved, understanding your taste, and finding your next obsession.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleEnterApp}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#30483B] text-[#F7F3EA] text-base font-medium hover:bg-[#20221E] transition-all group flex items-center justify-center gap-3 shadow-md"
          >
            <span>Enter Folia</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Editorial Section 1: The Feeling */}
      <section className="border-t border-[#E2DAD0] py-20 bg-[#EFEAE1]/50">
        <div className="max-w-4xl mx-auto px-6 space-y-12 text-center md:text-left">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#B66F5C]">01 · Memory & Detail</span>
            <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#20221E]">You remember the feeling.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="bg-[#F7F3EA] p-8 rounded-2xl border border-[#E2DAD0] space-y-4 shadow-sm text-left">
              <div className="flex items-center gap-2 font-mono text-xs text-[#30483B]">
                <Quote size={14} />
                <span>What you remember</span>
              </div>
              <p className="font-serif text-xl italic text-[#20221E] leading-relaxed">
                “The MMC was emotionally unavailable at first. There was a rain scene. They were forced to live together... I remember losing my mind.”
              </p>
            </div>

            <div className="space-y-4 text-left">
              <h3 className="font-serif text-3xl text-[#30483B]">Folia remembers the details.</h3>
              <p className="text-[#20221E]/70 text-base font-light leading-relaxed">
                Folia keeps track of character dynamics, tropes, quotes, and specific emotional peaks so your favorite literary moments stay alive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Section 2: What you collect */}
      <section className="border-t border-[#E2DAD0] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#30483B]">02 · Beyond Data</span>
          <h2 className="font-serif text-4xl md:text-5xl font-normal text-[#20221E]">
            You don't just read books.
          </h2>

          <p className="text-[#20221E]/70 text-lg font-light max-w-xl mx-auto">
            You collect characters, moments, quotes, feelings, tropes, eras, and memories.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto pt-4">
            {['Characters', 'Moments', 'Quotes', 'Feelings', 'Tropes', 'Reading Eras', 'Memories'].map((item) => (
              <span
                key={item}
                className="px-5 py-2.5 rounded-full bg-[#EFEAE1] border border-[#E2DAD0] text-sm font-medium text-[#30483B]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Section 3: Reading DNA */}
      <section className="border-t border-[#E2DAD0] py-20 bg-[#30483B] text-[#F7F3EA]">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#9EAD9C]">03 · Intelligence</span>
          <h2 className="font-serif text-4xl md:text-6xl font-normal leading-snug">
            And eventually, Folia learns you.
          </h2>

          <div className="bg-[#20221E]/40 border border-[#9EAD9C]/20 rounded-2xl p-8 space-y-4 text-left font-serif text-xl md:text-2xl font-light italic leading-relaxed text-[#F7F3EA]/90">
            <p>“You keep choosing slow burns.”</p>
            <p>“You keep loving emotionally vulnerable characters.”</p>
            <p className="text-[#9EAD9C]">“You almost always forgive the terrible ending when the chemistry is good.”</p>
          </div>

          <p className="font-mono text-sm text-[#9EAD9C]">Folia noticed.</p>
        </div>
      </section>

      

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-[#20221E]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F7F3EA] border border-[#E2DAD0] rounded-3xl p-8 max-w-md w-full space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#EFEAE1] text-[#20221E]/60 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <h3 className="font-serif text-3xl text-[#30483B]">
                {authMode === 'signup' ? 'Begin your archive.' : 'Welcome back.'}
              </h3>
              <p className="text-xs text-[#20221E]/70">
                {authMode === 'signup'
                  ? 'Create an account to start collecting your reading world.'
                  : 'Enter your credentials to return to your shelves.'}
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleEnterApp(); }} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">Email</label>
                <input
                  type="email"
                  required
                  placeholder="reader@folia.app"
                  className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#30483B] text-[#F7F3EA] text-sm font-medium hover:bg-[#20221E] transition-all shadow-md"
              >
                {authMode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="text-center font-mono text-xs text-[#20221E]/60 pt-2">
              {authMode === 'signup' ? (
                <span>Already have an account? <button onClick={() => setAuthMode('signin')} className="text-[#30483B] underline font-medium">Sign in</button></span>
              ) : (
                <span>Need an account? <button onClick={() => setAuthMode('signup')} className="text-[#30483B] underline font-medium">Sign up</button></span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingView;