import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProjectState {
  projectId: number | null;
  lat: number | null;
  lng: number | null;
}

const initialState: ProjectState = {
  projectId: null,
  lat: null,
  lng: null,
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setSelectedProject: (
      state,
      action: PayloadAction<{
        projectId: number;
        lat: number;
        lng: number;
      }>
    ) => {
      state.projectId = action.payload.projectId;
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
    },
  },
});

export const { setSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;