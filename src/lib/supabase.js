import { mockUsers } from "@/data/mockData";

export const supabase = {
  auth: {
    getSession: async () => ({
      data: { session: { user: mockUsers[0] } },
    }),

    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    }),

    signInWithPassword: async ({ email }) => ({
      data: { user: { ...mockUsers[0], email }, session: { user: { ...mockUsers[0], email } } },
      error: null,
    }),

    signUp: async ({ email, options }) => ({
      data: {
        user: { ...mockUsers[0], email, name: options?.data?.name || "Demo User" },
        session: { user: { ...mockUsers[0], email } }
      },
      error: null,
    }),

    signOut: async () => ({
      error: null,
    }),

    signInWithOAuth: async () => ({
      error: null,
    }),

    updateUser: async () => ({
      error: null,
    }),
  },

  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: mockUsers[0], error: null }),
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      order: () => Promise.resolve({ data: [], error: null }),
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: {}, error: null }),
      }),
    }),
    update: () => ({
      eq: async () => ({ data: {}, error: null }),
    }),
    upsert: async () => ({ data: {}, error: null }),
  }),
};