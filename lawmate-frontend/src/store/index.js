import { configureStore } from '@reduxjs/toolkit';
import { lawmateApi } from './services/lawmateApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [lawmateApi.reducerPath]: lawmateApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(lawmateApi.middleware),
});

export default store;
