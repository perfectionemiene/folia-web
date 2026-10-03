import React, { useState } from 'react';
import { X, Upload, Book, Image } from 'lucide-react';
import { useBooks } from '../../context/BookContext';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose }) => {
  const { addBook } = useBooks();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [status, setStatus] = useState<'reading' | 'finished' | 'want-to-read' | 'dnf'>('reading');
  const [fileData, setFileData] = useState<ArrayBuffer | undefined>(undefined);
  const [fileName, setFileName] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    // Auto-fill title if empty
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      setTitle(cleanName);
    }

    // Read EPUB as ArrayBuffer so ePub() can read it natively
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result instanceof ArrayBuffer) {
        setFileData(result);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;

    addBook({
      title,
      author,
      totalPages: totalPages ? parseInt(totalPages, 10) : 300,
      currentPage: 0,
      coverUrl: coverUrl || undefined,
      status,
    });

    // Reset Form
    setTitle('');
    setAuthor('');
    setTotalPages('');
    setCoverUrl('');
    setStatus('reading');
    setFileData(undefined);
    setFileName('');

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20221E]/40 backdrop-blur-sm p-4">
      <div className="bg-[#F7F3EA] border border-[#E2DAD0] w-full max-w-lg rounded-2xl p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2DAD0]">
          <div className="flex items-center gap-2">
            <Book size={18} className="text-[#30483B]" />
            <h2 className="font-serif text-xl font-medium text-[#20221E]">Add New Book</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EFEAE1] text-[#20221E]/60 hover:text-[#20221E] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-[#E2DAD0] hover:border-[#30483B]/50 rounded-xl p-4 text-center bg-[#EFEAE1]/50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".epub"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center gap-1.5">
              <Upload size={20} className="text-[#30483B]" />
              <span className="font-mono text-xs text-[#20221E]/80">
                {fileName ? `Loaded: ${fileName}` : 'Upload EPUB file (Optional)'}
              </span>
              <span className="font-mono text-[10px] text-[#20221E]/50">
                Click or drag & drop file here
              </span>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-[#20221E]/70 mb-1">Book Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Great Gatsby"
              className="w-full px-3.5 py-2 rounded-xl bg-[#EFEAE1] border border-[#E2DAD0] text-sm text-[#20221E] focus:outline-none focus:border-[#30483B]"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-[#20221E]/70 mb-1">Author *</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. F. Scott Fitzgerald"
              className="w-full px-3.5 py-2 rounded-xl bg-[#EFEAE1] border border-[#E2DAD0] text-sm text-[#20221E] focus:outline-none focus:border-[#30483B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs text-[#20221E]/70 mb-1">Total Pages</label>
              <input
                type="number"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                placeholder="300"
                className="w-full px-3.5 py-2 rounded-xl bg-[#EFEAE1] border border-[#E2DAD0] text-sm text-[#20221E] focus:outline-none focus:border-[#30483B]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#20221E]/70 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#EFEAE1] border border-[#E2DAD0] text-sm text-[#20221E] focus:outline-none focus:border-[#30483B]"
              >
                <option value="reading">Reading</option>
                <option value="want-to-read">Want to Read</option>
                <option value="finished">Finished</option>
                <option value="dnf">DNF</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-[#20221E]/70 mb-1">Cover Image URL (Optional)</label>
            <div className="relative">
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#EFEAE1] border border-[#E2DAD0] text-sm text-[#20221E] focus:outline-none focus:border-[#30483B]"
              />
              <Image size={15} className="absolute left-3 top-3 text-[#20221E]/40" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2DAD0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full font-mono text-xs text-[#20221E]/70 hover:bg-[#EFEAE1] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#30483B] text-[#F7F3EA] font-mono text-xs hover:bg-[#30483B]/90 transition-colors cursor-pointer"
            >
              Add Book
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddBookModal;