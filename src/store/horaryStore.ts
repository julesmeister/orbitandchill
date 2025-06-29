/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HoraryQuestion {
  id: string;
  question: string;
  date: Date;
  answer?: 'Yes' | 'No' | 'Maybe';
  timing?: string;
  chartData?: any; // Will store the calculated chart data
  interpretation?: string;
  userId?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  category?: string;
  tags?: string[];
  chartSvg?: string;
  ascendantDegree?: number;
  moonSign?: string;
  moonVoidOfCourse?: boolean;
  planetaryHour?: string;
  isRadical?: boolean;
  chartWarnings?: string[];
  aspectCount?: number;
  retrogradeCount?: number;
  significatorPlanet?: string;
  isShared?: boolean;
  shareToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  customLocation?: {
    name: string;
    coordinates: { lat: string; lon: string };
  };
}

interface HoraryState {
  questions: HoraryQuestion[];
  isLoading: boolean;
  
  // Actions
  loadQuestions: (userId?: string) => Promise<void>;
  addQuestion: (question: Omit<HoraryQuestion, 'id'>) => Promise<HoraryQuestion | null>;
  updateQuestion: (id: string, updates: Partial<HoraryQuestion>) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  getQuestionById: (id: string) => HoraryQuestion | undefined;
  getQuestionsByUser: (userId: string) => HoraryQuestion[];
  clearAllQuestions: () => void;
  
  // Local-only actions for fallback when database is unavailable
  addQuestionLocal: (question: Omit<HoraryQuestion, 'id'>) => void;
  updateQuestionLocal: (id: string, updates: Partial<HoraryQuestion>) => void;
}

export const useHoraryStore = create<HoraryState>()(
  persist(
    (set, get) => ({
      questions: [],
      isLoading: false,

      // Load questions from database
      loadQuestions: async (userId) => {
        set({ isLoading: true });
        try {
          // Add debug logging for user ID tracking
          console.log('🔍 Loading horary questions for user:', {
            userId,
            userIdType: typeof userId,
            userIdExists: !!userId
          });

          // Verify user exists in database before loading questions (for Google users)
          if (userId && userId.startsWith('google_')) {
            try {
              const userCheck = await fetch(`/api/users/profile?userId=${userId}`);
              if (!userCheck.ok) {
                console.warn('⚠️ Google user not found in database, using local storage only');
                set({ isLoading: false });
                return;
              }
              console.log('✅ Google user verified in database');
            } catch (error) {
              console.warn('⚠️ User verification failed, continuing with local storage:', error);
            }
          }

          const params = new URLSearchParams();
          if (userId) params.append('userId', userId);
          params.append('includeAnonymous', 'true');
          params.append('limit', '100');

          const response = await fetch(`/api/horary/questions?${params}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              const questions = data.questions.map((q: any) => {
                // Handle date conversion more carefully
                let questionDate = new Date();
                if (q.date) {
                  if (typeof q.date === 'number') {
                    // If it's a number, check if it's in seconds (Unix timestamp) or milliseconds
                    // Unix timestamps in seconds would be < 10^12, in milliseconds would be >= 10^12
                    questionDate = q.date < 10000000000 ? new Date(q.date * 1000) : new Date(q.date);
                  } else {
                    questionDate = new Date(q.date);
                  }
                  
                  // Validate the date
                  if (isNaN(questionDate.getTime()) || questionDate.getFullYear() < 1990) {
                    console.warn('Invalid date in question from database:', q.date, 'Using current time instead');
                    questionDate = new Date();
                  }
                }
                
                return {
                  ...q,
                  date: questionDate,
                  createdAt: q.createdAt ? new Date(q.createdAt) : undefined,
                  updatedAt: q.updatedAt ? new Date(q.updatedAt) : undefined,
                };
              });
              
              set({ questions, isLoading: false });
              console.log(`✅ Loaded ${questions.length} horary questions from database for user:`, userId);
              return;
            }
          }
          
          console.warn('⚠️ Failed to load questions from database, using local storage');
          set({ isLoading: false });
        } catch (error) {
          console.error('❌ Error loading questions from database:', error);
          set({ isLoading: false });
        }
      },

      // Add question with database persistence
      addQuestion: async (questionData) => {
        try {
          // Add debug logging for question submission
          console.log('🔍 Adding horary question:', {
            userId: questionData.userId,
            userIdType: typeof questionData.userId,
            userIdExists: !!questionData.userId,
            question: questionData.question.substring(0, 50) + '...'
          });

          // Prepare data for API
          const apiData = {
            question: questionData.question,
            date: questionData.date,
            userId: questionData.userId,
            category: questionData.category,
            tags: questionData.tags,
            customLocation: questionData.customLocation
          };

          const response = await fetch('/api/horary/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiData)
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              const newQuestion: HoraryQuestion = {
                ...data.question,
                date: new Date(data.question.date),
                createdAt: data.question.createdAt ? new Date(data.question.createdAt) : undefined,
              };
              
              set((state) => ({
                questions: [newQuestion, ...state.questions].sort((a, b) => 
                  new Date(b.date).getTime() - new Date(a.date).getTime()
                ),
              }));
              
              console.log(`✅ Saved horary question to database:`, {
                id: newQuestion.id,
                userId: newQuestion.userId,
                question: newQuestion.question.substring(0, 50) + '...'
              });
              return newQuestion;
            }
          }
          
          console.warn('⚠️ Failed to save to database, falling back to local storage');
          get().addQuestionLocal(questionData);
          return null;
        } catch (error) {
          console.error('❌ Error saving question to database:', error);
          get().addQuestionLocal(questionData);
          return null;
        }
      },

      // Update question with database persistence
      updateQuestion: async (id, updates) => {
        console.log('Updating question:', { id, updatesKeys: Object.keys(updates) });
        
        try {
          const response = await fetch(`/api/horary/questions/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              const updatedQuestion = {
                ...data.question,
                date: new Date(data.question.date),
                createdAt: data.question.createdAt ? new Date(data.question.createdAt) : undefined,
                updatedAt: data.question.updatedAt ? new Date(data.question.updatedAt) : undefined,
              };
              
              set((state) => {
                const questionIndex = state.questions.findIndex(q => q.id === id);
                if (questionIndex === -1) return state;
                
                const newQuestions = [...state.questions];
                newQuestions[questionIndex] = updatedQuestion;
                
                return { questions: newQuestions };
              });
              
              console.log(`✅ Updated horary question in database: ${id}`);
              return;
            }
          }
          
          console.warn('⚠️ Failed to update in database, falling back to local storage');
          get().updateQuestionLocal(id, updates);
        } catch (error) {
          console.error('❌ Error updating question in database:', error);
          get().updateQuestionLocal(id, updates);
        }
      },

      // Delete question with database persistence
      deleteQuestion: async (id) => {
        try {
          const response = await fetch(`/api/horary/questions/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              set((state) => ({
                questions: state.questions.filter((q) => q.id !== id),
              }));
              
              console.log(`✅ Deleted horary question from database: ${id}`);
              return;
            }
          }
          
          console.warn('⚠️ Failed to delete from database, removing from local storage only');
          set((state) => ({
            questions: state.questions.filter((q) => q.id !== id),
          }));
        } catch (error) {
          console.error('❌ Error deleting question from database:', error);
          set((state) => ({
            questions: state.questions.filter((q) => q.id !== id),
          }));
        }
      },

      // Local storage fallback methods
      addQuestionLocal: (questionData) => {
        const newQuestion: HoraryQuestion = {
          ...questionData,
          id: `horary_local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          date: new Date(questionData.date),
        };
        
        set((state) => ({
          questions: [newQuestion, ...state.questions].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        }));
      },

      updateQuestionLocal: (id, updates) => {
        set((state) => {
          const questionIndex = state.questions.findIndex(q => q.id === id);
          if (questionIndex === -1) return state;
          
          const existingQuestion = state.questions[questionIndex];
          const updatedQuestion = { 
            ...existingQuestion, 
            ...updates,
            date: existingQuestion.date instanceof Date ? existingQuestion.date : new Date(existingQuestion.date)
          };
          
          const newQuestions = [...state.questions];
          newQuestions[questionIndex] = updatedQuestion;
          
          return { questions: newQuestions };
        });
      },

      getQuestionById: (id) => {
        return get().questions.find((q) => q.id === id);
      },

      getQuestionsByUser: (userId) => {
        return get().questions.filter((q) => q.userId === userId);
      },

      clearAllQuestions: () => {
        set({ questions: [] });
      },
    }),
    {
      name: 'horary-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          const parsed = JSON.parse(str);
          return {
            ...parsed,
            state: {
              ...parsed.state,
              questions: parsed.state.questions.map((q: any) => ({
                ...q,
                date: new Date(q.date),
                // Ensure chartData is properly deserialized
                chartData: q.chartData ? {
                  ...q.chartData,
                  metadata: q.chartData.metadata ? {
                    ...q.chartData.metadata,
                    chartTime: typeof q.chartData.metadata.chartTime === 'string' 
                      ? new Date(q.chartData.metadata.chartTime) 
                      : q.chartData.metadata.chartTime
                  } : undefined
                } : undefined
              })),
            },
          };
        },
        setItem: (name, value) => {
          const serialized = JSON.stringify({
            ...value,
            state: {
              ...value.state,
              questions: value.state.questions.map((q: HoraryQuestion) => ({
                ...q,
                date: q.date instanceof Date ? q.date.toISOString() : q.date,
                // Ensure chartData is properly serialized
                chartData: q.chartData ? {
                  ...q.chartData,
                  metadata: q.chartData.metadata ? {
                    ...q.chartData.metadata,
                    chartTime: q.chartData.metadata.chartTime instanceof Date 
                      ? q.chartData.metadata.chartTime.toISOString() 
                      : q.chartData.metadata.chartTime
                  } : undefined
                } : undefined
              })),
            },
          });
          localStorage.setItem(name, serialized);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);