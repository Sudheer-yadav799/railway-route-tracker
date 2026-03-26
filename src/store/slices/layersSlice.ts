import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LayerItem {
  id: string;
  name: string;
  type: string;
  isenabled: boolean;
  section: number;
  apiendpoint?: string;
  geoserverWorkSpace?: string;
  opacity?: string;
}

interface LayersState {
  sections: any[];
}

const initialState: LayersState = {
  sections: [],
};

const layersSlice = createSlice({
  name: "layers",
  initialState,
  reducers: {
    setLayers(state, action: PayloadAction<any[]>) {
      state.sections = action.payload;
    },
    toggleLayer(state, action: PayloadAction<string>) {
      state.sections.forEach((section) => {
        section.layers.forEach((layer: LayerItem) => {
          if (layer.id === action.payload) {
            layer.isenabled = !layer.isenabled;
          }
        });
      });
    },
  },
});

export const { setLayers, toggleLayer } = layersSlice.actions;
export default layersSlice.reducer;