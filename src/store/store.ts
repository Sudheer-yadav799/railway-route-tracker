import { configureStore, combineReducers } from "@reduxjs/toolkit";
import layersReducer from "./slices/layersSlice";
import authReducer from "./slices/authSlice";
import railwayGeoReducer from "./slices/railwayGeoSlice";
import mapNavigationReducer from "./slices/mapNavigationSlice";
import projectReducer from "./slices/projectSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

/* -----------------------------
   Combine reducers
----------------------------- */

const rootReducer = combineReducers({
  layers: layersReducer,
  auth: authReducer,
  railwayGeo: railwayGeoReducer,
  mapNavigation: mapNavigationReducer,
  project: projectReducer 
});

/* -----------------------------
   Persist config
----------------------------- */

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only auth will persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* -----------------------------
   Store
----------------------------- */

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

/* -----------------------------
   Types
----------------------------- */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;