import { createSlice } from '@reduxjs/toolkit';
import { lawmateApi } from '../services/lawmateApi';

/**
 * Auth slice — holds the logged-in user object and JWT token.
 * The user object is populated from the RTK Query `getMe` endpoint
 * and enriched with the advocate profilePicture when applicable.
 */

const initialState = {
  user: null,
  token: localStorage.getItem('lawmate-token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('lawmate-token', action.payload);
      } else {
        localStorage.removeItem('lawmate-token');
      }
    },

    setUser(state, action) {
      state.user = action.payload;
    },

    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('lawmate-token');
    },

    // Merge profilePicture from advocate profile into user so Navbar can use it
    mergeProfilePicture(state, action) {
      if (state.user) {
        state.user = { ...state.user, profileImage: action.payload };
      }
    },
  },

  extraReducers: (builder) => {
    // When login mutation succeeds → store token + user from response
    builder.addMatcher(
      lawmateApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
        localStorage.setItem('lawmate-token', payload.token);
      }
    );

    // When register mutation succeeds → same
    builder.addMatcher(
      lawmateApi.endpoints.register.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
        localStorage.setItem('lawmate-token', payload.token);
      }
    );

    // When getMe succeeds → update user (e.g. after page refresh)
    builder.addMatcher(
      lawmateApi.endpoints.getMe.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
      }
    );

    // When advocate profile picture upload succeeds → update navbar avatar
    builder.addMatcher(
      lawmateApi.endpoints.uploadAdvocateProfilePicture.matchFulfilled,
      (state, { payload }) => {
        if (state.user && payload.profilePicture) {
          state.user = { ...state.user, profileImage: payload.profilePicture };
        }
      }
    );
  },
});

export const { setToken, setUser, logout, mergeProfilePicture } = authSlice.actions;
export default authSlice.reducer;
