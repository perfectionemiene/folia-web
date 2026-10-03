import React, { useState } from 'react';
import { Sparkles, BookOpen, Heart, Shield, Plus, X, Pencil, Check } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface Era {
  id: string;
  title: string;
  timeframe: string;
  description: string;
  topBook: string;
  color: string;
}

interface Character {
  id: string;
  name: string;
  bookTitle: string;
  author: string;
  category: 'marry' | 'heartbreak' | 'bestie';
  quote: string;
}

export const MeView: React.FC = () => {
  const { user, updateProfile } = useUser();

  const [activeTab, setActiveTab] = useState<'eras' | 'characters' | 'dna'>('eras');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'era' | 'character'>('era');

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editGoal, setEditGoal] = useState(user.booksGoal.toString());

  // App Data
  const [eras, setEras] = useState<Era[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);

  // Form States
  const [newEra, setNewEra] = useState({ title: '', timeframe: '', description: '', topBook: '' });
  const [newChar, setNewChar] = useState({
    name: '',
    bookTitle: '',
    author: '',
    category: 'marry' as Character['category'],
    quote: '',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      bio: editBio,
      booksGoal: parseInt(editGoal, 10) || 0,
    });
    setIsEditingProfile(false);
  };

  const handleAddEra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEra.title.trim()) return;

    setEras([
      {
        id: Date.now().toString(),
        title: newEra.title,
        timeframe: newEra.timeframe || 'Present',
        description: newEra.description,
        topBook: newEra.topBook || 'Untitled',
        color: 'bg-[#30483B] text-[#F7F3EA]',
      },
      ...eras,
    ]);
    setShowAddModal(false);
    setNewEra({ title: '', timeframe: '', description: '', topBook: '' });
  };

  const handleAddCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChar.name.trim()) return;

    setCharacters([
      {
        id: Date.now().toString(),
        ...newChar,
      },
      ...characters,
    ]);
    setShowAddModal(false);
    setNewChar({ name: '', bookTitle: '', author: '', category: 'marry', quote: '' });
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Profile Header */}
      <section className="space-y-6 border-b border-[#E2DAD0] pb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5 flex-1">
            <div className="w-20 h-20 rounded-full bg-[#30483B] text-[#F7F3EA] flex items-center justify-center font-serif text-3xl font-medium shadow-md shrink-0">
              {user.avatarInitial}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 flex-1 max-w-lg">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#20221E]/60">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-3 py-1.5 text-sm font-serif focus:outline-none focus:border-[#30483B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#20221E]/60">
                    Bio
                  </label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl p-2 text-xs font-mono focus:outline-none focus:border-[#30483B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-[#20221E]/60">
                    2026 Reading Goal (Books)
                  </label>
                  <input
                    type="number"
                    value={editGoal}
                    onChange={(e) => setEditGoal(e.target.value)}
                    className="w-24 bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#30483B]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#30483B] text-[#F7F3EA] text-xs font-medium hover:bg-[#20221E] transition-all"
                  >
                    <Check size={13} />
                    <span>Save Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-1.5 rounded-full bg-[#EFEAE1] text-[#20221E]/70 text-xs font-mono hover:bg-[#E2DAD0] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-1">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#B66F5C] flex items-center gap-1.5">
                  <Sparkles size={12} />
                  <span>Reader Profile</span>
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#20221E]">
                    {user.name}
                  </h1>
                  <button
                    onClick={() => {
                      setEditName(user.name);
                      setEditBio(user.bio);
                      setEditGoal(user.booksGoal.toString());
                      setIsEditingProfile(true);
                    }}
                    className="p-1.5 rounded-full bg-[#EFEAE1] text-[#20221E]/60 hover:text-[#20221E] hover:bg-[#E2DAD0] transition-colors"
                    title="Edit Profile"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
                <p className="font-mono text-xs text-[#20221E]/60 max-w-md">{user.bio}</p>
              </div>
            )}
          </div>

          {!isEditingProfile && (
            <button
              onClick={() => {
                setModalType(activeTab === 'characters' ? 'character' : 'era');
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#30483B] text-[#F7F3EA] text-xs font-medium hover:bg-[#20221E] transition-all shadow-sm shrink-0 self-start md:self-auto"
            >
              <Plus size={14} />
              <span>{activeTab === 'characters' ? 'Add Character' : 'Log New Era'}</span>
            </button>
          )}
        </div>

        {/* Blank Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          {[
            { label: 'Books Read (2026)', value: '0', sub: `Goal: ${user.booksGoal}` },
            { label: 'Pages Turned', value: '0', sub: '0 pgs / book avg' },
            { label: 'Current Streak', value: '0 Days', sub: 'Personal best: 0' },
            { label: 'Primary Genre', value: 'None', sub: '0% of library' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#EFEAE1]/60 border border-[#E2DAD0] rounded-2xl p-4 space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#20221E]/50">
                {stat.label}
              </span>
              <p className="font-serif text-2xl font-normal text-[#30483B]">{stat.value}</p>
              <p className="font-mono text-[10px] text-[#20221E]/40">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* View Selector */}
      <div className="flex items-center gap-8 border-b border-[#E2DAD0] pb-3">
        {[
          { id: 'eras', label: 'Reading Eras' },
          { id: 'characters', label: 'Character Cabinet' },
          { id: 'dna', label: 'Reading DNA' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`font-serif text-xl transition-all relative pb-2 ${
              activeTab === tab.id
                ? 'text-[#30483B] font-normal'
                : 'text-[#20221E]/40 hover:text-[#20221E]/70'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#30483B] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: READING ERAS TIMELINE */}
      {activeTab === 'eras' && (
        <div className="space-y-8">
          {eras.length > 0 ? (
            <div className="relative border-l-2 border-[#30483B]/20 ml-4 pl-8 space-y-10">
              {eras.map((era) => (
                <div key={era.id} className="relative group">
                  <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-[#F7F3EA] border-2 border-[#30483B]" />
                  <div className="bg-[#EFEAE1]/50 border border-[#E2DAD0] rounded-2xl p-6 md:p-8 space-y-4 shadow-sm group-hover:border-[#30483B]/30 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#B66F5C]">
                          {era.timeframe}
                        </span>
                        <h3 className="font-serif text-2xl text-[#20221E]">{era.title}</h3>
                      </div>
                      <span className="font-mono text-xs bg-[#30483B]/10 text-[#30483B] px-3 py-1 rounded-full self-start md:self-auto">
                        Key Book: {era.topBook}
                      </span>
                    </div>
                    <p className="text-sm text-[#20221E]/70 font-light leading-relaxed">
                      {era.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[#E2DAD0] rounded-2xl p-12 text-center space-y-4 bg-[#EFEAE1]/20">
              <div className="w-12 h-12 rounded-full bg-[#30483B]/5 text-[#30483B] flex items-center justify-center mx-auto">
                <BookOpen size={20} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-2xl text-[#20221E]">No reading eras recorded yet.</h3>
                <p className="text-xs text-[#20221E]/60 max-w-sm mx-auto">
                  Log your distinct reading phases—like a Dark Academia winter or a summer binge of sci-fi sagas.
                </p>
              </div>
              <button
                onClick={() => {
                  setModalType('era');
                  setShowAddModal(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#30483B] text-[#F7F3EA] text-xs font-medium hover:bg-[#20221E] transition-all shadow-sm"
              >
                <Plus size={14} />
                <span>Log Your First Era</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CHARACTER CABINET */}
      {activeTab === 'characters' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Would Marry', category: 'marry', icon: Heart, color: 'text-[#B66F5C]' },
              { title: 'Broke My Heart', category: 'heartbreak', icon: Heart, color: 'text-[#30483B]' },
              { title: 'Literary Besties', category: 'bestie', icon: Shield, color: 'text-[#20221E]' },
            ].map((section) => {
              const items = characters.filter((c) => c.category === section.category);
              const Icon = section.icon;

              return (
                <div key={section.category} className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E2DAD0] pb-2">
                    <Icon size={16} className={section.color} />
                    <h3 className="font-serif text-lg text-[#20221E]">{section.title}</h3>
                    <span className="font-mono text-xs text-[#20221E]/40">({items.length})</span>
                  </div>

                  <div className="space-y-3">
                    {items.map((char) => (
                      <div
                        key={char.id}
                        className="bg-[#EFEAE1]/50 border border-[#E2DAD0] rounded-xl p-4 space-y-2"
                      >
                        <h4 className="font-serif text-lg text-[#30483B] font-medium">{char.name}</h4>
                        <p className="font-mono text-[11px] text-[#20221E]/60">
                          {char.bookTitle} by {char.author}
                        </p>
                        {char.quote && (
                          <p className="font-serif text-xs italic text-[#20221E]/80 pt-1">
                            “{char.quote}”
                          </p>
                        )}
                      </div>
                    ))}

                    {items.length === 0 && (
                      <div className="p-6 text-center border border-dashed border-[#E2DAD0] rounded-xl text-xs font-mono text-[#20221E]/40">
                        No characters added yet.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: READING DNA */}
      {activeTab === 'dna' && (
        <div className="bg-[#EFEAE1]/40 border border-[#E2DAD0] rounded-3xl p-8 space-y-8">
          <div className="space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#30483B]">
              Behavioral Breakdown
            </span>
            <h3 className="font-serif text-3xl text-[#20221E]">Your Reader Personality</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#20221E]/60">
                Top Tastes & Tropes
              </h4>
              <p className="font-mono text-xs text-[#20221E]/50 italic">
                Read and log more books to uncover your personalized Reading DNA breakdown.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#20221E]/60">
                Pacing & Habit Summary
              </h4>
              <div className="bg-[#F7F3EA] border border-[#E2DAD0] rounded-2xl p-6 font-serif text-sm text-[#20221E]/60 leading-relaxed">
                Log reading sessions to build your habit profile.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#20221E]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F7F3EA] border border-[#E2DAD0] rounded-3xl p-8 max-w-md w-full space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#EFEAE1] text-[#20221E]/60 transition-colors"
            >
              <X size={18} />
            </button>

            {modalType === 'era' ? (
              <form onSubmit={handleAddEra} className="space-y-4">
                <div className="space-y-1">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#30483B]">
                    New Era
                  </span>
                  <h3 className="font-serif text-2xl text-[#20221E]">Log a Reading Phase</h3>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                    Era Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newEra.title}
                    onChange={(e) => setNewEra({ ...newEra, title: e.target.value })}
                    placeholder="e.g. Cozy Murder Mystery Arc"
                    className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                    Timeframe
                  </label>
                  <input
                    type="text"
                    value={newEra.timeframe}
                    onChange={(e) => setNewEra({ ...newEra, timeframe: e.target.value })}
                    placeholder="e.g. Summer 2026"
                    className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                    Defining Book
                  </label>
                  <input
                    type="text"
                    value={newEra.topBook}
                    onChange={(e) => setNewEra({ ...newEra, topBook: e.target.value })}
                    placeholder="e.g. The Thursday Murder Club"
                    className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    value={newEra.description}
                    onChange={(e) => setNewEra({ ...newEra, description: e.target.value })}
                    placeholder="What defined this reading phase?"
                    className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl p-3 text-sm focus:outline-none focus:border-[#30483B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#30483B] text-[#F7F3EA] text-sm font-medium hover:bg-[#20221E] transition-all"
                >
                  Save Era
                </button>
              </form>
            ) : (
              <form onSubmit={handleAddCharacter} className="space-y-4">
                <div className="space-y-1">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#30483B]">
                    New Character
                  </span>
                  <h3 className="font-serif text-2xl text-[#20221E]">Add to Character Cabinet</h3>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                    Character Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newChar.name}
                    onChange={(e) => setNewChar({ ...newChar, name: e.target.value })}
                    placeholder="e.g. Cardan Greenbriar"
                    className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                    Category
                  </label>
                  <select
                    value={newChar.category}
                    onChange={(e) => setNewChar({ ...newChar, category: e.target.value as any })}
                    className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                  >
                    <option value="marry">Would Marry</option>
                    <option value="heartbreak">Broke My Heart</option>
                    <option value="bestie">Literary Bestie</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                      Book
                    </label>
                    <input
                      type="text"
                      value={newChar.bookTitle}
                      onChange={(e) => setNewChar({ ...newChar, bookTitle: e.target.value })}
                      placeholder="The Cruel Prince"
                      className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                      Author
                    </label>
                    <input
                      type="text"
                      value={newChar.author}
                      onChange={(e) => setNewChar({ ...newChar, author: e.target.value })}
                      placeholder="Holly Black"
                      className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                    Favorite Line / Note
                  </label>
                  <input
                    type="text"
                    value={newChar.quote}
                    onChange={(e) => setNewChar({ ...newChar, quote: e.target.value })}
                    placeholder="Most memorable line or trait"
                    className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#30483B] text-[#F7F3EA] text-sm font-medium hover:bg-[#20221E] transition-all"
                >
                  Save Character
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeView;