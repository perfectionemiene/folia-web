import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  avatarInitial: string;
  booksGoal: number;
}

interface UserContextType {
  user: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  login: (name: string, email: string) => void;
}

const defaultUser: UserProfile = {
  name: 'Penelope Vance',
  email: 'penelope@example.com',
  bio: 'Lover of atmospheric prose, enemies-to-lovers, and coffee-stained paperbacks.',
  avatarInitial: 'P',
  booksGoal: 40,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('folia_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      const nextName = updated.name ?? prev.name;
      const newProfile = {
        ...prev,
        ...updated,
        avatarInitial: nextName.trim() ? nextName.trim()[0].toUpperCase() : 'P',
      };
      localStorage.setItem('folia_user', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  const login = (name: string, email: string) => {
    updateProfile({ name, email });
  };

  return (
    <UserContext.Provider value={{ user, updateProfile, login }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};