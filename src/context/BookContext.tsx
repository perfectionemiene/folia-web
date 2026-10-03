import React, { createContext, useContext, useState, useEffect } from 'react';
import { get, set, del } from 'idb-keyval';

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: 'reading' | 'finished' | 'want-to-read' | 'dnf';
  coverUrl?: string;
  fileUrl?: string; // High-capacity storage reference
}

interface BookContextType {
  books: Book[];
  addBook: (book: Omit<Book, 'id'>) => Promise<void>;
  updateProgress: (id: string, currentPage: number) => void;
  deleteBook: (id: string) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('folia_books');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync basic book metadata to LocalStorage and load large files from IndexedDB
  useEffect(() => {
    const syncBooks = async () => {
      const sanitizedBooks = books.map(({ fileUrl, ...rest }) => rest);
      localStorage.setItem('folia_books', JSON.stringify(sanitizedBooks));

      // Hydrate heavy file data from IndexedDB
      const updated = await Promise.all(
        books.map(async (book) => {
          if (!book.fileUrl) {
            const storedFile = await get(`file_${book.id}`);
            if (storedFile) return { ...book, fileUrl: storedFile };
          }
          return book;
        })
      );
      
      // Update state only if new files were restored
      if (JSON.stringify(updated) !== JSON.stringify(books)) {
        setBooks(updated);
      }
    };

    syncBooks();
  }, [books]);

  const addBook = async (newBook: Omit<Book, 'id'>) => {
    const id = Date.now().toString();
    const { fileUrl, ...metadata } = newBook;

    if (fileUrl) {
      await set(`file_${id}`, fileUrl); // Save large file safely into IndexedDB
    }

    setBooks((prev) => [...prev, { ...metadata, id, fileUrl }]);
  };

  const updateProgress = (id: string, currentPage: number) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, currentPage } : b))
    );
  };

  const deleteBook = (id: string) => {
    del(`file_${id}`); // Clean up IndexedDB storage
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <BookContext.Provider value={{ books, addBook, updateProgress, deleteBook }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBooks must be used within a BookProvider');
  return ctx;
};