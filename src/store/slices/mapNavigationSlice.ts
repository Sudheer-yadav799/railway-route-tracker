import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface MapNavigationState {
  flyToFeature: any | null
}

const initialState: MapNavigationState = {
  flyToFeature: null,
}

const mapNavigationSlice = createSlice({
  name: "mapNavigation",
  initialState,
  reducers: {

    setFlyToFeature(state, action: PayloadAction<any>) {
      state.flyToFeature = action.payload
    },

    clearFlyToFeature(state) {
      state.flyToFeature = null
    }

  },
})

export const {
  setFlyToFeature,
  clearFlyToFeature
} = mapNavigationSlice.actions

export default mapNavigationSlice.reducer