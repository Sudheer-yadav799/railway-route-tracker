import { configureStore, combineReducers } from "@reduxjs/toolkit";
import layersReducer from "./slices/layersSlice";
import authReducer from "./slices/authSlice";
import railwayGeoReducer from "./slices/railwayGeoSlice";
import mapNavigationReducer from "./slices/mapNavigationSlice";
import projectReducer from "./slices/projectSlice";
import assetLayersReducer from "./slices/assetLayersSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const rootReducer = combineReducers({
  layers: layersReducer,
  auth: authReducer,
  railwayGeo: railwayGeoReducer,
  mapNavigation: mapNavigationReducer,
  project: projectReducer,
  assetLayers: assetLayersReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;