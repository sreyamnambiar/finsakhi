import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'hi' | 'ta';
export type LearningLevel = 'beginner' | 'intermediate';

interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  completedLessons: string[];
  earnedBadges: string[];
  quizScores: Record<string, number>;
}

interface AppSettings {
  language: Language;
  voiceMode: boolean;
  readAloud: boolean;
  learningLevel: LearningLevel;
  hasCompletedOnboarding: boolean;
}

interface AppState {
  settings: AppSettings;
  progress: UserProgress;
  setLanguage: (lang: Language) => void;
  setVoiceMode: (enabled: boolean) => void;
  setReadAloud: (enabled: boolean) => void;
  setLearningLevel: (level: LearningLevel) => void;
  completeOnboarding: () => void;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  earnBadge: (badgeId: string) => void;
  updateStreak: () => void;
  saveQuizScore: (lessonId: string, score: number) => void;
  resetProgress: () => void;
}

const initialSettings: AppSettings = {
  language: 'en',
  voiceMode: true,
  readAloud: false,
  learningLevel: 'beginner',
  hasCompletedOnboarding: false,
};

const initialProgress: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: null,
  completedLessons: [],
  earnedBadges: [],
  quizScores: {},
};

const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: initialSettings,
      progress: initialProgress,

      setLanguage: (lang) =>
        set((state) => ({
          settings: { ...state.settings, language: lang },
        })),

      setVoiceMode: (enabled) =>
        set((state) => ({
          settings: { ...state.settings, voiceMode: enabled },
        })),

      setReadAloud: (enabled) =>
        set((state) => ({
          settings: { ...state.settings, readAloud: enabled },
        })),

      setLearningLevel: (level) =>
        set((state) => ({
          settings: { ...state.settings, learningLevel: level },
        })),

      completeOnboarding: () =>
        set((state) => ({
          settings: { ...state.settings, hasCompletedOnboarding: true },
        })),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.progress.xp + amount;
          return {
            progress: {
              ...state.progress,
              xp: newXP,
              level: calculateLevel(newXP),
            },
          };
        }),

      completeLesson: (lessonId) =>
        set((state) => {
          if (state.progress.completedLessons.includes(lessonId)) {
            return state;
          }
          return {
            progress: {
              ...state.progress,
              completedLessons: [...state.progress.completedLessons, lessonId],
            },
          };
        }),

      earnBadge: (badgeId) =>
        set((state) => {
          if (state.progress.earnedBadges.includes(badgeId)) {
            return state;
          }
          return {
            progress: {
              ...state.progress,
              earnedBadges: [...state.progress.earnedBadges, badgeId],
            },
          };
        }),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const lastActive = state.progress.lastActiveDate;

          if (lastActive === today) {
            return state;
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          const newStreak =
            lastActive === yesterdayStr ? state.progress.streak + 1 : 1;

          return {
            progress: {
              ...state.progress,
              streak: newStreak,
              lastActiveDate: today,
            },
          };
        }),

      saveQuizScore: (lessonId, score) =>
        set((state) => ({
          progress: {
            ...state.progress,
            quizScores: { ...state.progress.quizScores, [lessonId]: score },
          },
        })),

      resetProgress: () =>
        set({
          progress: initialProgress,
        }),
    }),
    {
      name: 'finsakhi-storage',
    }
  )
);
