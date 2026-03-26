import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface RailwayGeoState {
  geojson: any | null
  features: any[]
  loading: boolean
}

const initialState: RailwayGeoState = {
  geojson: null,
  features: [],
  loading: false,
}

const railwayGeoSlice = createSlice({
  name: "railwayGeo",
  initialState,
  reducers: {
    setGeoJson(state, action: PayloadAction<any>) {
      state.geojson = action.payload
      state.features = action.payload?.features || []
    },
    clearGeoJson(state) {
      state.geojson = null
      state.features = []
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
  },
})

export const { setGeoJson, clearGeoJson, setLoading } =
  railwayGeoSlice.actions

export default railwayGeoSlice.reducer