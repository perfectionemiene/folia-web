import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
// @ts-ignore
import jszip from 'jszip';
import ePub from 'epubjs';
import { useBooks } from '../context/BookContext';

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.JSZip = jszip;
}

const toArrayBuffer = async (data: any): Promise<ArrayBuffer> => {
  if (!data) throw new Error('No file data provided.');

  if (data instanceof ArrayBuffer) return data;
  if (data instanceof Blob) return await data.arrayBuffer();

  if (ArrayBuffer.isView(data)) {
    return data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength
    ) as ArrayBuffer;
  }

  if (typeof data === 'string') {
    if (data.startsWith('data:')) {
      const base64 = data.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer;
    }
    const res = await fetch(data);
    return await res.arrayBuffer();
  }

  throw new Error('Unsupported or missing file format.');
};

export const ReaderView: React.FC = () => {
  const params = useParams<{ id?: string; bookId?: string }>();
  const id = params.bookId || params.id;
  const navigate = useNavigate();

  const context = useBooks();
  const books = context?.books || [];
  const updateProgress = context?.updateProgress;

  const bookData = books.find(
    (b) => String(b.id).trim() === String(id).trim()
  );

  const viewerRef = useRef<HTMLDivElement>(null);
  const epubInstance = useRef<any>(null);
  const renditionInstance = useRef<any>(null);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string | number>('');
  const [totalPages, setTotalPages] = useState<number | null>(
    (bookData as any)?.totalPages || null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fileSource =
    (bookData as any)?.fileData ||
    (bookData as any)?.file ||
    bookData?.fileUrl ||
    null;

  const hasFile = Boolean(fileSource);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') renditionInstance.current?.next();
      if (e.key === 'ArrowLeft') renditionInstance.current?.prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!bookData || !fileSource || !viewerRef.current) {
      setIsLoading(false);
      return;
    }

    let destroyed = false;

    const loadBook = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const arrayBuffer = await toArrayBuffer(fileSource);

        if (destroyed || !viewerRef.current) return;

        viewerRef.current.innerHTML = '';

        const ePubFactory = (ePub as any).default || ePub;
        const book = ePubFactory(arrayBuffer);
        epubInstance.current = book;

        await book.ready;

        if (destroyed || !viewerRef.current) return;

        const rendition = typeof book.renderTo === 'function'
          ? book.renderTo(viewerRef.current, {
              width: '100%',
              height: '100%',
              spread: 'auto',
              flow: 'paginated',
            })
          : (book as any).rendition;

        renditionInstance.current = rendition;

        if (!rendition) {
          throw new Error('Failed to initialize EPUB rendition engine.');
        }

        // Register reader themes
        rendition.themes.register('light', {
          body: {
            background: '#F7F3EA !important',
            color: '#20221E !important',
            'font-family': 'Georgia, serif !important',
            padding: '20px !important',
          },
        });
        rendition.themes.register('dark', {
          body: {
            background: '#1A1A1A !important',
            color: '#EFEAE1 !important',
            'font-family': 'Georgia, serif !important',
            padding: '20px !important',
          },
        });

        rendition.themes.select(isDarkMode ? 'dark' : 'light');

        // Touch gestures for mobile swipe
        rendition.hooks.content.register((contents: any) => {
          const el = contents.document.documentElement;
          if (!el) return;

          let startX = 0;
          el.addEventListener(
            'touchstart',
            (e: TouchEvent) => {
              startX = e.touches[0].clientX;
            },
            { passive: true }
          );

          el.addEventListener(
            'touchend',
            (e: TouchEvent) => {
              const endX = e.changedTouches[0].clientX;
              const diffX = startX - endX;

              if (diffX > 50) {
                renditionInstance.current?.next();
              } else if (diffX < -50) {
                renditionInstance.current?.prev();
              }
            },
            { passive: true }
          );
        });

        await rendition.display();

        if (destroyed) return;
        setIsLoading(false);

        // Generate locations
        book.locations
          ?.generate(1024)
          .then(() => {
            if (destroyed) return;
            if (book.locations?.total) {
              setTotalPages(book.locations.total);
            }
          })
          .catch((err: any) =>
            console.warn('Locations generation skipped:', err)
          );

        // Track location progress
        rendition.on('relocated', (location: any) => {
          if (destroyed || !location?.start) return;

          const cfi = location.start.cfi;
          const percentage = book.locations?.percentageFromCfi?.(cfi) ?? 0;
          const estimatedPage =
            Math.floor(percentage * (book.locations?.total || 100)) || 1;

          setCurrentLocation(estimatedPage);

          if (id && estimatedPage && updateProgress) {
            try {
              updateProgress(id, estimatedPage);
            } catch {
              // ignore
            }
          }
        });
      } catch (e: any) {
        console.error('EPUB initialization error:', e);
        if (!destroyed) {
          setError(
            e?.message ||
              'Failed to initialize EPUB engine. Please verify the file format.'
          );
          setIsLoading(false);
        }
      }
    };

    loadBook();

    return () => {
      destroyed = true;
      if (epubInstance.current) {
        try {
          epubInstance.current.destroy();
        } catch {
          // ignore cleanup errors
        }
        epubInstance.current = null;
        renditionInstance.current = null;
      }
    };
  }, [id, fileSource, updateProgress]);

  const handleNext = useCallback(() => renditionInstance.current?.next(), []);
  const handlePrev = useCallback(() => renditionInstance.current?.prev(), []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (renditionInstance.current) {
      renditionInstance.current.themes.select(nextMode ? 'dark' : 'light');
    }
  };

  if (!bookData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F7F3EA] text-[#20221E] space-y-3 p-4">
        <p className="font-serif text-2xl">Book not found.</p>
        <p className="text-xs font-mono opacity-50">
          Target ID: {id || 'undefined'}
        </p>
        <button
          onClick={() => navigate('/app')}
          className="mt-2 text-xs font-mono underline text-[#30483B] cursor-pointer"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const showNoFile = !isLoading && !hasFile && !error;

  return (
    <div
      className={`h-screen w-screen flex flex-col transition-colors ${
        isDarkMode
          ? 'bg-[#1A1A1A] text-[#EFEAE1]'
          : 'bg-[#F7F3EA] text-[#20221E]'
      }`}
    >
      <header className="px-8 py-4 flex items-center justify-between border-b border-[#E2DAD0]/30 shrink-0">
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-2 font-mono text-xs hover:opacity-75 transition-opacity cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Exit Reader</span>
        </button>

        <div className="text-center">
          <h2 className="font-serif text-base font-normal">
            {bookData.title}
          </h2>
          <p className="text-xs opacity-60">{bookData.author}</p>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main className="flex-1 relative overflow-hidden flex flex-col min-h-0">
        <div
          ref={viewerRef}
          className="flex-1 min-h-0 w-full max-w-4xl mx-auto px-4"
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="font-mono text-xs opacity-60">
              Loading book structure...
            </p>
          </div>
        )}

        {showNoFile && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3 p-6 max-w-md">
              <p className="font-serif text-xl text-[#30483B]">
                No EPUB File Attached
              </p>
              <p className="text-xs opacity-70 font-mono">
                This book has no local EPUB file attached or the browser
                session expired.
              </p>
              <button
                onClick={() => navigate('/app')}
                className="mt-4 px-4 py-2 rounded-full bg-[#30483B] text-[#F7F3EA] text-xs font-mono cursor-pointer"
              >
                Back to Library
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-3 p-6 max-w-sm">
              <p className="font-serif text-lg text-red-600">{error}</p>
              <p className="text-xs opacity-60 font-mono">
                Make sure it is a valid, unencrypted `.epub` file.
              </p>
              <button
                onClick={() => navigate('/app')}
                className="mt-2 px-3 py-1.5 rounded-full bg-[#30483B] text-[#F7F3EA] text-xs font-mono cursor-pointer"
              >
                Re-upload from Library
              </button>
            </div>
          </div>
        )}

        {hasFile && !isLoading && !error && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/5 hover:bg-black/10 transition-all cursor-pointer z-10"
              aria-label="Previous Page"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/5 hover:bg-black/10 transition-all cursor-pointer z-10"
              aria-label="Next Page"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </main>

      <footer className="px-8 py-3 border-t border-[#E2DAD0]/30 flex justify-between items-center font-mono text-[11px] opacity-60 shrink-0">
        <span>Location {currentLocation || '—'}</span>
        <span>{totalPages ? `~${totalPages} Pages` : 'Calculating...'}</span>
      </footer>
    </div>
  );
};

export default ReaderView;