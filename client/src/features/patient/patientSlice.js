import { createSlice } from "@reduxjs/toolkit";

const patientSlice = createSlice({
  name: "patient",
  initialState: [],
  reducers: {
    addPatient: (state, action) => {
      return action.payload || [];
    },
    removePatient: (state, action) => {
      return state.filter((patient) => patient._id !== action.payload);
    },
    updatePatient: (state, action) => {
      const { id, updatedData } = action.payload;
      return state.map((patient) =>
        patient._id === id ? { ...patient, ...updatedData } : patient
      );
    },
  },
});

export const { addPatient, removePatient, updatePatient } =
  patientSlice.actions;

export default patientSlice.reducer;
