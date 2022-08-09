import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    position: positionReducer,
    tokens: tokensReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: true,
    immutableCheck: true,
  }),
})

export type RootState = ReturnType<typeof store.getState>
