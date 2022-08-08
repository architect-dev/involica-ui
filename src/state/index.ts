import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import farmsReducer from './farms'
import expeditionReducer from './expedition'
import summitEcosystemReducer from './summitEcosystem'
import pricesReducer from './prices'
import tokensReducer from './tokens'
import glacierReducer from './glacier'
import everestReducer from './everest'

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    farms: farmsReducer,
    expedition: expeditionReducer,
    summitEcosystem: summitEcosystemReducer,
    prices: pricesReducer,
    tokens: tokensReducer,
    glacier: glacierReducer,
    everest: everestReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
  }),
})

export type RootState = ReturnType<typeof store.getState>
