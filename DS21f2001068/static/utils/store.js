const store = new Vuex.Store({
  state: {
      authToken: localStorage.getItem("authToken") || "",
      test: "to test vuex working",
      user: null, // User profile data can be stored here
      role: null,
  },
  mutations: {
      setAuthToken(state, token) {
          state.authToken = token;
          localStorage.setItem("authToken", token); // Persist token in local storage
      },
      setUser(state, user) {
          state.user = user;
      },
      setRole(state, role) {
          state.role = role;
      },
      logout(state) {
          state.authToken = "";
          localStorage.removeItem("authToken"); // Remove token from local storage on logout
          state.user = null;
          state.role = null;
      },
  },
  actions: {
      // Actions to fetch user data, handle authentication, etc.
  },
  getters: {
      isLoggedIn: (state) => !!state.authToken,
  },
});

export default store;
