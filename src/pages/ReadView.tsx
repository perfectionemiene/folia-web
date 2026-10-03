import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Plus, Star, CheckCircle2, X, Upload, Trash2 } from 'lucide-react';
import { useBooks } from '../context/BookContext';
import type { Book } from '../context/BookContext';

export const ReadView: React.FC = () => {
  const { books, addBook, updateProgress, deleteBook } = useBooks();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'reading' | 'finished' | 'want-to-read' | 'dnf'>('reading');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBookForComedown, setSelectedBookForComedown] = useState<Book | null>(null);

  // Store Base64 Data URL string for EPUB persistence
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  // Form state for adding a new book
  const [newBookForm, setNewBookForm] = useState({
    title: '',
    author: '',
    status: 'reading' as Book['status'],
    coverUrl: '',
    fileName: '',
  });

  // Form state for post-book comedown modal
  const [comedownForm, setComedownForm] = useState({
    reaction: '😭 Absolutely wrecked',
    favoriteQuote: '',
    rating: 5,
  });

  const currentlyReading = books.filter((b) => b.status === 'reading');
  const filteredShelf = books.filter((b) => b.status === activeTab);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Result = reader.result as string;
        const cleanName = file.name.replace(/\.[^/.]+$/, '');

        setFileUrl(base64Result);
        setNewBookForm((prev) => ({
          ...prev,
          fileName: file.name,
          title: prev.title || cleanName,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookForm.title.trim()) return;

    addBook({
      title: newBookForm.title,
      author: newBookForm.author || 'Unknown Author',
      totalPages: 100, // Dynamic estimation managed by reader
      currentPage: 0,
      status: newBookForm.status,
      coverUrl:
        newBookForm.coverUrl ||
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
      fileUrl: fileUrl || undefined, // Stores Base64 URL string in context
    });

    setShowAddModal(false);
    setFileUrl(null);
    setNewBookForm({
      title: '',
      author: '',
      status: 'reading',
      coverUrl: '',
      fileName: '',
    });
  };

  const handleDeleteBook = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteBook(id);
    }
  };

  const saveComedown = () => {
    if (!selectedBookForComedown) return;

    updateProgress(selectedBookForComedown.id, selectedBookForComedown.totalPages);
    setSelectedBookForComedown(null);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Editorial Welcome Header */}
      <section className="space-y-3 border-b border-[#E2DAD0] pb-8">
        <div className="font-mono text-[11px] uppercase tracking-widest text-[#30483B] flex items-center gap-2">
          <Sparkles size={13} className="text-[#B66F5C]" />
          <span>Your Personal Archive</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#20221E] leading-tight">
          Welcome to your reading world.
        </h1>
        <p className="text-[#20221E]/70 text-base md:text-lg font-light max-w-xl">
          Your active stories, finished memories, and upcoming shelf lives here.
        </p>
      </section>

      {/* Currently Reading Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2DAD0] pb-2">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#20221E]/60">
            Currently Reading
          </h2>
          <span className="font-mono text-xs text-[#30483B]">
            {currentlyReading.length.toString().padStart(2, '0')} Active {currentlyReading.length === 1 ? 'Book' : 'Books'}
          </span>
        </div>

        {currentlyReading.length > 0 ? (
          currentlyReading.map((book) => {
            const progressPercent = Math.min(
              100,
              Math.round((book.currentPage / book.totalPages) * 100) || 0
            );

            return (
              <div
                key={book.id}
                className="bg-[#EFEAE1]/60 border border-[#E2DAD0] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start transition-all hover:border-[#30483B]/30"
              >
                {/* Cover -> Clickable to Open Reader */}
                <div
                  onClick={() => navigate(`/app/read-book/${book.id}`)}
                  className="w-44 md:w-52 aspect-[3/4] bg-[#30483B]/10 rounded-lg shadow-xl overflow-hidden relative group shrink-0 border border-[#20221E]/10 cursor-pointer"
                >
                  <img
                    src={
                      book.coverUrl ||
                      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600'
                    }
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#30483B]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-[#F7F3EA] text-[#30483B] px-3 py-1.5 rounded-full font-mono text-[11px] font-medium shadow-md">
                      Open Reader
                    </span>
                  </div>
                </div>

                {/* Book Info */}
                <div className="space-y-6 flex-1 text-center md:text-left w-full">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-[#30483B]/10 text-[#30483B] font-mono text-[11px] font-medium">
                        {progressPercent}% Complete
                      </span>
                    </div>
                    <h3
                      onClick={() => navigate(`/app/read-book/${book.id}`)}
                      className="font-serif text-3xl md:text-4xl text-[#20221E] font-normal leading-snug cursor-pointer hover:text-[#30483B] transition-colors"
                    >
                      {book.title}
                    </h3>
                    <p className="text-[#20221E]/70 text-sm">by {book.author}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2 max-w-md mx-auto md:mx-0">
                    <div className="h-2 w-full bg-[#E2DAD0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#30483B] rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between font-mono text-[11px] text-[#20221E]/60">
                      <span>Location {book.currentPage}</span>
                      <span>Progress {progressPercent}%</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button
                      onClick={() => navigate(`/app/read-book/${book.id}`)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#30483B] text-[#F7F3EA] text-xs font-medium hover:bg-[#20221E] transition-all shadow-sm cursor-pointer"
                    >
                      <BookOpen size={14} />
                      <span>Read Book</span>
                    </button>
                    <button
                      onClick={() => setSelectedBookForComedown(book)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#30483B]/30 text-[#30483B] text-xs font-medium hover:bg-[#30483B]/5 transition-all cursor-pointer"
                    >
                      <CheckCircle2 size={14} />
                      <span>Mark as Finished</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id, book.title)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-red-300 text-red-700 text-xs font-medium hover:bg-red-50 transition-all cursor-pointer"
                      title="Delete Book"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Blank State for Currently Reading */
          <div className="border border-dashed border-[#E2DAD0] rounded-2xl p-10 text-center space-y-4 bg-[#EFEAE1]/30">
            <div className="w-12 h-12 rounded-full bg-[#30483B]/5 text-[#30483B] flex items-center justify-center mx-auto">
              <BookOpen size={20} strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl text-[#20221E]">No books currently open.</h3>
              <p className="text-xs text-[#20221E]/60 max-w-xs mx-auto">
                Start reading a story to begin tracking your journey and building your Reading DNA.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#30483B] text-[#F7F3EA] text-xs font-medium hover:bg-[#20221E] transition-all shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Your First Book</span>
            </button>
          </div>
        )}
      </section>

      {/* Shelves Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-[#E2DAD0] pb-3 overflow-x-auto">
          <div className="flex items-center gap-6">
            {[
              { id: 'reading', label: 'Reading' },
              { id: 'finished', label: 'Finished' },
              { id: 'want-to-read', label: 'Want to Read' },
              { id: 'dnf', label: 'DNF' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`font-serif text-xl transition-all relative pb-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-[#30483B] font-normal'
                    : 'text-[#20221E]/40 hover:text-[#20221E]/70'
                }`}
              >
                {tab.label} ({books.filter((b) => b.status === tab.id).length})
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#30483B] rounded-full" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#30483B] hover:underline cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Book</span>
          </button>
        </div>

        {/* Shelf Books or Empty State */}
        {filteredShelf.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredShelf.map((book) => (
              <div
                key={book.id}
                className="bg-[#EFEAE1]/40 border border-[#E2DAD0] rounded-xl p-4 flex gap-4 group hover:border-[#30483B]/30 transition-all relative"
              >
                <div
                  onClick={() => navigate(`/app/read-book/${book.id}`)}
                  className="w-20 aspect-[3/4] rounded-md bg-[#E2DAD0]/60 overflow-hidden shadow-sm shrink-0 border border-[#20221E]/10 cursor-pointer"
                >
                  <img
                    src={
                      book.coverUrl ||
                      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600'
                    }
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-2 flex-1 min-w-0 flex flex-col justify-between">
                  <div
                    onClick={() => navigate(`/app/read-book/${book.id}`)}
                    className="cursor-pointer"
                  >
                    <h4 className="font-serif text-lg text-[#20221E] group-hover:text-[#30483B] transition-colors leading-snug truncate">
                      {book.title}
                    </h4>
                    <p className="text-xs text-[#20221E]/60 truncate">{book.author}</p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBook(book.id, book.title);
                      }}
                      className="p-1.5 rounded-full text-red-600/70 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Book"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Blank State for Shelves */
          <div className="py-12 text-center space-y-2 border border-dashed border-[#E2DAD0] rounded-2xl bg-[#EFEAE1]/20">
            <p className="font-serif text-xl text-[#20221E]/70">This shelf is empty.</p>
            <p className="text-xs text-[#20221E]/50 font-mono">
              Books marked as '{activeTab}' will appear here.
            </p>
          </div>
        )}
      </section>

      {/* Add Book Modal with File Upload */}
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
                New Story
              </span>
              <h3 className="font-serif text-3xl text-[#30483B]">Add a book to your shelf</h3>
            </div>

            <form onSubmit={handleAddBook} className="space-y-4">
              {/* File Upload Box */}
              <div className="border-2 border-dashed border-[#E2DAD0] hover:border-[#30483B]/50 rounded-2xl p-4 text-center bg-[#EFEAE1]/50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".epub"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center gap-1">
                  <Upload size={18} className="text-[#30483B]" />
                  <span className="font-mono text-xs text-[#20221E]/80">
                    {newBookForm.fileName ? `Loaded: ${newBookForm.fileName}` : 'Upload EPUB file (Optional)'}
                  </span>
                  <span className="font-mono text-[10px] text-[#20221E]/50">
                    Upload a file to read inside Folia
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  value={newBookForm.title}
                  onChange={(e) => setNewBookForm({ ...newBookForm, title: e.target.value })}
                  placeholder="e.g. The Seven Year Slip"
                  className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                  Author Name
                </label>
                <input
                  type="text"
                  value={newBookForm.author}
                  onChange={(e) => setNewBookForm({ ...newBookForm, author: e.target.value })}
                  placeholder="e.g. Rebecca Serle"
                  className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                  Shelf
                </label>
                <select
                  value={newBookForm.status}
                  onChange={(e) => setNewBookForm({ ...newBookForm, status: e.target.value as any })}
                  className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                >
                  <option value="reading">Reading</option>
                  <option value="want-to-read">Want to Read</option>
                  <option value="finished">Finished</option>
                  <option value="dnf">DNF</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                  Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={newBookForm.coverUrl}
                  onChange={(e) => setNewBookForm({ ...newBookForm, coverUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#EFEAE1] border border-[#E2DAD0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#30483B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#30483B] text-[#F7F3EA] text-sm font-medium hover:bg-[#20221E] transition-all shadow-md cursor-pointer mt-2"
              >
                Save to Shelf
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Post-Book Comedown Modal */}
      {selectedBookForComedown && (
        <div className="fixed inset-0 z-50 bg-[#20221E]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F7F3EA] border border-[#E2DAD0] rounded-3xl p-8 max-w-lg w-full space-y-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedBookForComedown(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#EFEAE1] text-[#20221E]/60 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#B66F5C]">
                Post-Book Comedown
              </span>
              <h3 className="font-serif text-3xl text-[#30483B]">
                How are we feeling about <span className="italic">{selectedBookForComedown.title}</span>?
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                  Emotional State
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    '😭 Absolutely wrecked',
                    '🥹 Soft & warm',
                    '🤯 Mind blown',
                    '😐 Meh / Neutral',
                    '🤬 Furious at ending',
                  ].map((reaction) => (
                    <button
                      key={reaction}
                      type="button"
                      onClick={() => setComedownForm((p) => ({ ...p, reaction }))}
                      className={`px-3 py-1.5 rounded-full font-mono text-xs transition-all cursor-pointer ${
                        comedownForm.reaction === reaction
                          ? 'bg-[#30483B] text-[#F7F3EA]'
                          : 'bg-[#EFEAE1] border border-[#E2DAD0] text-[#20221E]/70'
                      }`}
                    >
                      {reaction}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#20221E]/60">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setComedownForm((p) => ({ ...p, rating: star }))}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        size={22}
                        className={
                          star <= comedownForm.rating
                            ? 'text-[#B66F5C] fill-[#B66F5C]'
                            : 'text-[#E2DAD0]'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={saveComedown}
                className="w-full py-3.5 rounded-full bg-[#30483B] text-[#F7F3EA] text-sm font-medium hover:bg-[#20221E] transition-all shadow-md cursor-pointer"
              >
                Archive Memory & Finish Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadView;