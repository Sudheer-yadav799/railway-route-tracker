import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AssetLayersState {
  enabledLayers: Record<string, boolean>;
  availableLayers: string[];

  parentChildMap:
    Record<string, string[]>;
}

const initialState: AssetLayersState = {
  enabledLayers: {},
  availableLayers: [],
  parentChildMap: {}
};

const assetLayersSlice = createSlice({
  name: "assetLayers",

  initialState,

  reducers: {
setAvailableLayers: (
  state,
  action
) => {
  const {
    parentType,
    layers
  } = action.payload;

  const normalized =
    layers.map((l:string) =>
      l.trim().toUpperCase()
    );

  state.parentChildMap[
    parentType
  ] = [
    ...(state.parentChildMap[
      parentType
    ] || []),
    ...normalized.filter(
      l =>
        !(
          state.parentChildMap[
            parentType
          ] || []
        ).includes(l)
    )
  ];

  normalized.forEach(
    (layer:string) => {
      if (
        state.enabledLayers[
          layer
        ] === undefined
      ) {
        state.enabledLayers[
          layer
        ] = true;
      }
    }
  );
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