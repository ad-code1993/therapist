// Mock auth for development - replace with real auth later
export const auth = {
  // Mock auth methods
  async getSession() {
    return {
      user: {
        id: "mock-user-id",
        email: "mock@example.com",
        name: "Mock User"
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  },
  async signIn() {
    return { success: true };
  },
  async signOut() {
    return { success: true };
  }
};