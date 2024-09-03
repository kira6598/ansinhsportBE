import { configureStore } from '@reduxjs/toolkit'
import StadiumReducer from '../feature/Stadium/StadiumSice'
export const store = configureStore({
  reducer: {
    stadium : StadiumReducer
  },
})