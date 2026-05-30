import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AssetLayersState {
  enabledLayers: Record<string, boolean>;
  availableLayers: string[];
}

const initialState: AssetLayersState = {
  enabledLayers: {},
  availableLayers: []
};

const assetLayersSlice = createSlice({
  name: "assetLayers",

  initialState,

  reducers: {
  setAvailableLayers: (state, action) => {
  const normalized = action.payload.map((l) =>
    l.trim().toUpperCase()
  );

  state.availableLayers = [
    ...new Set([...state.availableLayers, ...normalized]),
  ];

  normalized.forEach((layer) => {
    if (state.enabledLayers[layer] === undefined) {
      state.enabledLayers[layer] = true;
    }
  });
},

    toggleAssetLayer: (
      state,
      action: PayloadAction<string>
    ) => {
      const layer = action.payload.toUpperCase();

      state.enabledLayers[layer] =
        !state.enabledLayers[layer];
    },

    enableAllAssetLayers: (state) => {
      Object.keys(state.enabledLayers).forEach(
        (layer) => {
          state.enabledLayers[layer] = true;
        }
      );
    },

    disableAllAssetLayers: (state) => {
      Object.keys(state.enabledLayers).forEach(
        (layer) => {
          state.enabledLayers[layer] = false;
        }
      );
    }
  }
});

export const {
  setAvailableLayers,
  toggleAssetLayer,
  enableAllAssetLayers,
  disableAllAssetLayers
} = assetLayersSlice.actions;

export default assetLayersSlice.reducer;