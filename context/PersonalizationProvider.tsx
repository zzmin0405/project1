'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useUser } from '@supabase/auth-helpers-react'; // REMOVED
import { getUserPreferences, updateUserPreferences, createClient } from '@/lib/supabase/client'; // Added createClient

interface PersonalizationContextType {
  fontSize: string;
  textColor: string;
  updatePreferences: (newPrefs: { fontSize?: string; textColor?: string }) => void;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

interface PersonalizationProviderProps {
  children: ReactNode;
}

export function PersonalizationProvider({ children }: PersonalizationProviderProps) {
  const supabase = createClient(); // Create Supabase client instance
  const [user, setUser] = useState<any | null>(null); // State to hold user
  const [fontSize, setFontSize] = useState('medium'); // Default font size
  const [textColor, setTextColor] = useState('#000000'); // Default text color (black)

  useEffect(() => {
    // onAuthStateChange handles initial session, login, and logout all in one place.
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);

      if (currentUser) {
        try {
          const prefs = await getUserPreferences(currentUser.id);
          if (prefs) {
            setFontSize(prefs.font_size || 'medium');
            setTextColor(prefs.text_color || '#000000');
          } else {
            // If no prefs found for a user (e.g., new user), stick to defaults.
            setFontSize('medium');
            setTextColor('#000000');
          }
        } catch (error) {
          console.error("Error fetching preferences on auth change:", error);
          // On error, fall back to default styles
          setFontSize('medium');
          setTextColor('#000000');
        }
      } else {
        // User is logged out, reset to defaults
        setFontSize('medium');
        setTextColor('#000000');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    // Apply CSS variables globally
    document.documentElement.style.setProperty('--user-font-size', getFontSizeValue(fontSize));
    document.documentElement.style.setProperty('--user-text-color', textColor);
  }, [fontSize, textColor]);

  const getFontSizeValue = (size: string) => {
    switch (size) {
      case 'small':
        return '0.875rem'; // Tailwind's text-sm
      case 'medium':
        return '1rem';    // Tailwind's text-base
      case 'large':
        return '1.125rem'; // Tailwind's text-lg
      default:
        return '1rem';
    }
  };

  const updatePreferences = async (newPrefs: { fontSize?: string; textColor?: string }) => {
    if (user?.id) {
      const updated = {
        fontSize: newPrefs.fontSize || fontSize,
        textColor: newPrefs.textColor || textColor,
      };
      // Update local state immediately for instant UI feedback
      setFontSize(updated.fontSize);
      setTextColor(updated.textColor);
      
      // Then, update the database in the background
      try {
        await updateUserPreferences(user.id, {
          font_size: updated.fontSize,
          text_color: updated.textColor,
        });
      } catch (error) {
        console.error("Failed to save preferences to database:", error);
        // Optional: Add logic to revert the state change on DB update failure
      }
    }
  };

  return (
    <PersonalizationContext.Provider value={{ fontSize, textColor, updatePreferences }}>
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
}