import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Diğer reducer'lar buraya eklenecek
  },
  devTools: import.meta.env.MODE !== 'production',
});

// RootState ve AppDispatch tipleri
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
