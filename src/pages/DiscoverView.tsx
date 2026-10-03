import React, { useState } from 'react';
import { Sparkles, Search, Compass, BookOpen, Flame, Sparkle, RefreshCw, ArrowRight, Bookmark, Plus } from 'lucide-react';

interface RecommendedBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  matchPercentage: number;
  tropes: string[];
  reason: string;
}

const MOOD_TAGS = [
  '😭 Devastating HEA',
  '🔥 Slow Burn Fantasy',
  '👀 Enemies to Lovers',
  '☕ Cozy Small Town',
  '👑 Fake Marriage',
  '🖤 Dark Academia',
  '⚡ Academic Rivals',
];

export const DiscoverView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lost-book' | 'vibe-match'>('lost-book');
  
  // State for "What Was That Book?"
  const [lostBookQuery, setLostBookQuery] = useState('');
  const [isSearchingLost, setIsSearchingLost] = useState(false);
  const [lostBookResults, setLostBookResults] = useState<RecommendedBook[] | null>(null);

  // State for "Something Like This"
  const [likedBookQuery, setLikedBookQuery] = useState('');
  const [isMatchingVibe, setIsMatchingVibe] = useState(false);
  const [vibeResults, setVibeResults] = useState<RecommendedBook[] | null>(null);

  // Selected mood tag
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleLostBookSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostBookQuery.trim()) return;

    setIsSearchingLost(true);
    // Simulating discovery engine lookup
    setTimeout(() => {
      setIsSearchingLost(false);
      setLostBookResults([
        {
          id: 'b1',
          title: 'The Seven Year Slip',
          author: 'Rebecca Serle',
          cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
          matchPercentage: 98,
          tropes: ['Time Loop', 'Publicist', 'Chef', 'Forced Proximity'],
          reason: 'Matches your memory: An apartment that travels through time, a chef MMC, and emotional angst.',
        },
        {
          id: 'b2',
          title: 'Love and Other Words',
          author: 'Christina Lauren',
          cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
          matchPercentage: 89,
          tropes: ['Childhood Friends', 'Dual Timeline', 'Emotional Damage'],
          reason: 'Matches your memory: Second chance romance with heavy nostalgia and miscommunication.',
        },
      ]);
    }, 800);
  };

  const handleVibeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!likedBookQuery.trim()) return;

    setIsMatchingVibe(true);
    setTimeout(() => {
      setIsMatchingVibe(false);
      setVibeResults([
        {
          id: 'v1',
          title: 'Divine Rivals',
          author: 'Rebecca Ross',
          cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400',
          matchPercentage: 95,
          tropes: ['Enemies to Lovers', 'Rival Journalists', 'Letters'],
          reason: `Because you loved "${likedBookQuery}": Matches the sharp banter, secret identity letters, and high-stakes tension.`,
        },
        {
          id: 'v2',
          title: 'Book Lovers',
          author: 'Emily Henry',
          cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
          matchPercentage: 91,
          tropes: ['Rival Agents', 'Small Town', 'Top-tier Banter'],
          reason: `Because you loved "${likedBookQuery}": Features witty, hyper-competent rivals who can't stay away from each other.`,
        },
      ]);
    }, 800);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="space-y-3 border-b border-[#E2DAD0] pb-8">
        <div className="font-mono text-[11px] uppercase tracking-widest text-[#30483B] flex items-center gap-2">
          <Compass size={13} className="text-[#B66F5C]" />
          <span>Literary Discovery</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#20221E] leading-tight">
          Find what to read next.
        </h1>
        <p className="text-[#20221E]/70 text-base md:text-lg font-light max-w-xl">
          Search by forgotten plot points, match specific character dynamics, or explore moods.
        </p>
      </section>

      {/* Discovery Mode Selector */}
      <div className="flex border-b border-[#E2DAD0] gap-8">
        <button
          onClick={() => setActiveTab('lost-book')}
          className={`font-serif text-xl pb-3 relative transition-all ${
            activeTab === 'lost-book' ? 'text-[#30483B] font-normal' : 'text-[#20221E]/40 hover:text-[#20221E]/70'
          }`}
        >
          What Was That Book?
          {activeTab === 'lost-book' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#30483B] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('vibe-match')}
          className={`font-serif text-xl pb-3 relative transition-all ${
            activeTab === 'vibe-match' ? 'text-[#30483B] font-normal' : 'text-[#20221E]/40 hover:text-[#20221E]/70'
          }`}
        >
          Something Like This
          {activeTab === 'vibe-match' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#30483B] rounded-full" />
          )}
        </button>
      </div>

      {/* Mood Filters */}
      <div className="space-y-2">
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#20221E]/60">
          Filter By Vibe
        </span>
        <div className="flex flex-wrap gap-2">
          {MOOD_TAGS.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition-all ${
                selectedMood === mood
                  ? 'bg-[#30483B] text-[#F7F3EA]'
                  : 'bg-[#EFEAE1]/60 border border-[#E2DAD0] text-[#20221E]/70 hover:border-[#30483B]/40'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: "What Was That Book?" Finder */}
      {activeTab === 'lost-book' && (
        <section className="space-y-8">
          <form onSubmit={handleLostBookSearch} className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                value={lostBookQuery}
                onChange={(e) => setLostBookQuery(e.target.value)}
                placeholder="Describe whatever you remember... (e.g., 'She was a publicist in NYC, his apartment took her 5 years into the past, he was a chef, they cooked dinner together in rain...')"
                className="w-full bg-[#EFEAE1]/80 border border-[#E2DAD0] rounded-2xl p-4 md:p-5 text-sm font-serif focus:outline-none focus:border-[#30483B] placeholder:font-sans placeholder:text-xs placeholder:text-[#20221E]/40 resize-none shadow-sm"
              />
              <button
                type="submit"
                disabled={isSearchingLost || !lostBookQuery.trim()}
                className="absolute bottom-4 right-4 px-5 py-2 rounded-full bg-[#30483B] text-[#F7F3EA] text-xs font-medium hover:bg-[#20221E] transition-all disabled:opacity-40 flex items-center gap-2"
              >
                {isSearchingLost ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Searching Archive...</span>
                  </>
                ) : (
                  <>
                    <span>Identify Book</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>

            {/* Prompt Helper Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px] text-[#20221E]/60">
              <span>Try prompts like:</span>
              <button
                type="button"
                onClick={() =>
                  setLostBookQuery('Two rival journalists in a fantasy war writing letters through a magic typewriter')
                }
                className="underline hover:text-[#30483B]"
              >
                "Rival journalists & magic typewriter"
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() =>
                  setLostBookQuery('Small town romance with a grumpy MMC who owns a hardware store and sunshine heroine')
                }
                className="underline hover:text-[#30483B]"
              >
                "Grumpy hardware store owner x sunshine"
              </button>
            </div>
          </form>

          {/* Results or Blank State */}
          {lostBookResults ? (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-[#30483B]">Matches found in the archive:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lostBookResults.map((book) => (
                  <div
                    key={book.id}
                    className="bg-[#EFEAE1]/50 border border-[#E2DAD0] rounded-2xl p-6 flex gap-5 hover:border-[#30483B]/40 transition-all"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-24 aspect-[3/4] object-cover rounded-md shadow-sm border border-[#20221E]/10 shrink-0"
                    />
                    <div className="space-y-3 flex-1">
                      <div>
                        <span className="font-mono text-[10px] uppercase text-[#B66F5C] font-semibold">
                          {book.matchPercentage}% Plot Match
                        </span>
                        <h4 className="font-serif text-xl text-[#20221E] leading-snug">{book.title}</h4>
                        <p className="text-xs text-[#20221E]/60">by {book.author}</p>
                      </div>
                      <p className="text-xs text-[#20221E]/80 font-light leading-relaxed bg-[#F7F3EA] p-3 rounded-xl border border-[#E2DAD0]">
                        {book.reason}
                      </p>
                      <button className="inline-flex items-center gap-1.5 font-mono text-xs text-[#30483B] hover:underline pt-1">
                        <Plus size={13} />
                        <span>Add to Want to Read</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-[#E2DAD0] rounded-2xl p-12 text-center space-y-3 bg-[#EFEAE1]/20">
              <div className="w-12 h-12 rounded-full bg-[#30483B]/5 text-[#30483B] flex items-center justify-center mx-auto">
                <Search size={20} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-[#20221E]">Remember a story, but forgot the title?</h3>
              <p className="text-xs text-[#20221E]/60 max-w-sm mx-auto">
                Type scenes, character quirks, tropes, or key plot twists above to let Folia identify the book for you.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Tab 2: "Something Like This" Matcher */}
      {activeTab === 'vibe-match' && (
        <section className="space-y-8">
          <form onSubmit={handleVibeSearch} className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={likedBookQuery}
                onChange={(e) => setLikedBookQuery(e.target.value)}
                placeholder="Enter a book you loved (e.g. 'Fourth Wing', 'Beach Read', 'The Cruel Prince')..."
                className="flex-1 bg-[#EFEAE1]/80 border border-[#E2DAD0] rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-[#30483B] placeholder:text-xs shadow-sm"
              />
              <button
                type="submit"
                disabled={isMatchingVibe || !likedBookQuery.trim()}
                className="px-6 py-4 rounded-2xl bg-[#30483B] text-[#F7F3EA] text-xs font-medium hover:bg-[#20221E] transition-all disabled:opacity-40 flex items-center gap-2 shrink-0"
              >
                {isMatchingVibe ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Matching Tropes...</span>
                  </>
                ) : (
                  <>
                    <span>Find Similar</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Vibe Results or Blank State */}
          {vibeResults ? (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-[#30483B]">
                Recommendations based on <span className="italic">"{likedBookQuery}"</span>:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vibeResults.map((book) => (
                  <div
                    key={book.id}
                    className="bg-[#EFEAE1]/50 border border-[#E2DAD0] rounded-2xl p-6 flex gap-5 hover:border-[#30483B]/40 transition-all"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-24 aspect-[3/4] object-cover rounded-md shadow-sm border border-[#20221E]/10 shrink-0"
                    />
                    <div className="space-y-3 flex-1">
                      <div>
                        <span className="font-mono text-[10px] uppercase text-[#30483B] font-semibold">
                          {book.matchPercentage}% Vibe Match
                        </span>
                        <h4 className="font-serif text-xl text-[#20221E] leading-snug">{book.title}</h4>
                        <p className="text-xs text-[#20221E]/60">by {book.author}</p>
                      </div>
                      <p className="text-xs text-[#20221E]/80 font-light leading-relaxed bg-[#F7F3EA] p-3 rounded-xl border border-[#E2DAD0]">
                        {book.reason}
                      </p>
                      <button className="inline-flex items-center gap-1.5 font-mono text-xs text-[#30483B] hover:underline pt-1">
                        <Plus size={13} />
                        <span>Add to Want to Read</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-[#E2DAD0] rounded-2xl p-12 text-center space-y-3 bg-[#EFEAE1]/20">
              <div className="w-12 h-12 rounded-full bg-[#30483B]/5 text-[#30483B] flex items-center justify-center mx-auto">
                <Sparkles size={20} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-[#20221E]">Chasing the feeling of a favorite book?</h3>
              <p className="text-xs text-[#20221E]/60 max-w-sm mx-auto">
                Type a story you recently obsessed over and Folia will break down its tropes, pacing, and emotional dynamics to recommend your next match.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default DiscoverView;