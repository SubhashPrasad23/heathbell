import { createSlice } from "@reduxjs/toolkit";

const selectedPatientSlice = createSlice({
  name: "selectedPatient",
  initialState: [],
  reducers: {
    selectedPatient: (state, action) => {
      return action.payload || [];
    },
  },
});

export const { selectedPatient } = selectedPatientSlice.actions;

export default selectedPatientSlice.reducer;
