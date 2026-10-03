import React, { useState } from 'react';
import { Bookmark, Plus, Sparkles, Quote, Heart, MessageSquare, BookOpen, X, Tag } from 'lucide-react';

interface Memory {
  id: string;
  bookTitle: string;
  author: string;
  type: 'quote' | 'moment' | 'thought';
  content: string;
  pageNumber?: string;
  chapter?: string;
  dateAdded: string;
  tags?: string[];
}

export const RememberView: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'quote' | 'moment' | 'thought'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newMemory, setNewMemory] = useState({
    bookTitle: '',
    author: '',
    type: 'quote' as Memory['type'],
    content: '',
    pageNumber: '',
    tags: '',
  });

  const filteredMemories = memories.filter(
    (m) => activeFilter === 'all' || m.type === activeFilter
  );

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemory.content.trim()) return;

    const memory: Memory = {
      id: Date.now().toString(),
      bookTitle: newMemory.bookTitle.trim() || 'Untitled Book',
      author: newMemory.author.trim() || 'Unknown Author',
      type: newMemory.type,
      content: newMemory.content,
      pageNumber: newMemory.pageNumber ? `p. ${newMemory.pageNumber}` : undefined,
      dateAdded: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      tags: newMemory.tags ? newMemory.tags.split(',').map((t) => t.trim()) : [],
    };

    setMemories([memory, ...memories]);
    setShowAddModal(false);
    setNewMemory({ bookTitle: '', author: '', type: 'quote', content: '', pageNumber: '', tags: '' });
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="space-y-3 border-b border-[#E2DAD0] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="font-mono text-[11px] uppercase tracking-widest text-[#30483B] flex items-center gap-2">
            <Bookmark size={13} className="text-[#B66F5C]" />
            <span>Literary Archive</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#20221E] leading-tight">
            Quotes & Moments
          </h1>
          <p className="text-[#20221E]/70 text-base md:text-lg font-light max-w-xl">
            The lines that made you pause, the scenes that broke your heart, and the thoughts saved in the margins.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#30483B] text-[#F7F3EA] text-xs font-medium hover:bg-[#20221E] transition-all shadow-sm shrink-0 self-start md:self-auto"
        >
          <Plus size={14} />
          <span>Capture Memory</span>
        </button>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#E2DAD0] pb-3 overflow-x-auto">
        <div className="flex items-center gap-6">
          {[
            { id: 'all', label: 'All Saved' },
            { id: 'quote', label: 'Quotes' },
            { id: 'moment', label: 'Scenes & Moments' },
            { id: 'thought', label: 'Marginalia' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`font-serif text-xl transition-all relative pb-2 whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'text-[#30483B] font-normal'
                  : 'text-[#20221E]/40 hover:text-[#20221E]/70'
              }`}
            >
              {tab.label} ({memories.filter((m) => tab.id === 'all' || m.type === tab.id).length})
              {activeFilter === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#30483B] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Stream or Empty State */}
      {filteredMemories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMemories.map((memory) => (
            <div
              key={memory.id}
              className="bg-[#EFEAE1]/50 border border-[#E2DAD0] rounded-2xl p-6 md:p-8 space-y-4 relative group hover:border-[#30483B]/30 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#30483B] bg-[#30483B]/10 px-2.5 py-1 rounded-md">
                  {memory.type}
                </span>
                <span className="font-mono text-[10px] text-[#20221E]/40">
                  {memory.dateAdded}
                </span>
              </div>

              {/* Quote / Content Body */}
              <div className="space-y-2">
                <p className="font-serif text-xl md:text-2xl text-[#20221E] italic leading-relaxed">
                  “{memory.content}”
                </p>
                <div className="flex items-center gap-2 font-mono text-xs text-[#20221E]/60 pt-1">
                  <span className="font-medium text-[#30483B]">{memory.bookTitle}</span>
                  <span>·</span>
                  <span>{memory.author}</span>
                  {memory.pageNumber && (
                    <>
                      <span>·</span>
                      <span className="text-[#B66F5C]">{memory.pageNumber}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Tags */}
              {memory.tags && memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E2DAD0]/60">
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] text-[#20221E]/60 bg-[#F7F3EA] px-2 py-0.5 rounded border border-[#E2DAD0]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Blank State */
        <div className="border border-dashed border-[#E2DAD0] rounded-2xl p-12 text-center space-y-4 bg-[#EFEAE1]/20">
          <div className="w-12 h-12 rounded-full bg-[#30483B]/5 text-[#30483B] flex items-center justify-center mx-auto">
            <Quote size={20} strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-2xl text-[#20221E]">Your archive is quiet.</h3>
            <p className="text-xs text-[#20221E]/60 max-w-sm mx-auto">
              Whenever a sentence makes you hold your breath or a scene stays in your mind, save it here so you never lose it.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#30483B] text-[#F7F3EA] text-xs font-medium hover:bg-[#20221E] transition-all shadow-sm"
          >
            <Plus size={14} />
            <span>Save Your First Quote</span>
          </button>
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#20221E]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F7F3EA] border border-[#E2DAD0] rounded-3xl p-8 max-w-md w-full space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#EFEAE1] text-[#20221E]/60 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#30483B]">
                New Archive Item
              </span>
              <h3 className="font-serif text-3xl text-[#30483B]">Capture a line or moment</h3>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                  Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'quote', label: 'Quote' },
                    { id: 'moment', label: 'Scene' },
                    { id: 'thought', label: 'Marginalia' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewMemory({ ...newMemory, type: t.id as any })}
                      className={`py-2 rounded-xl font-mono text-xs transition-all border ${
                        newMemory.type === t.id
                          ? 'bg-[#30483B] text-[#F7F3EA] border-[#30483B]'
                          : 'bg-[#EFEAE1] border-[#E2DAD0] text-[#20221E]/70'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                  The Quote / Thought
                </label>
                <textarea
                  rows={3}
                  required
                  value={newMemory.content}
                  onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                  placeholder="“Write down the exact quote or scene details…”"
                  className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl p-3 text-sm font-serif focus:outline-none focus:border-[#30483B] placeholder:font-sans placeholder:text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                  Book Title
                </label>
                <input
                  type="text"
                  value={newMemory.bookTitle}
                  onChange={(e) => setNewMemory({ ...newMemory, bookTitle: e.target.value })}
                  placeholder="e.g. Divine Rivals"
                  className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                    Author
                  </label>
                  <input
                    type="text"
                    value={newMemory.author}
                    onChange={(e) => setNewMemory({ ...newMemory, author: e.target.value })}
                    placeholder="Rebecca Ross"
                    className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                    Page / Chapter
                  </label>
                  <input
                    type="text"
                    value={newMemory.pageNumber}
                    onChange={(e) => setNewMemory({ ...newMemory, pageNumber: e.target.value })}
                    placeholder="p. 184"
                    className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newMemory.tags}
                  onChange={(e) => setNewMemory({ ...newMemory, tags: e.target.value })}
                  placeholder="rain scene, confession, favorite line"
                  className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#30483B] text-[#F7F3EA] text-sm font-medium hover:bg-[#20221E] transition-all shadow-md pt-3"
              >
                Save to Archive
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RememberView;