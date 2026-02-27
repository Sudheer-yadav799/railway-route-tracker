import { configureStore } from "@reduxjs/toolkit";
import layersReducer from "./slices/layersSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    layers: layersReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;