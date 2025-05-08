import { createSlice } from "@reduxjs/toolkit";

const medicineSlice = createSlice({
  name: "medicine",
  initialState: [],
  reducers: {
    addMedicine: (state, action) => {
      return action.payload || [];
    },
    removeMedicine: (state, action) => {
      return state.filter((medicine) => medicine._id !== action.payload);
    },
    updateMedicine: (state, action) => {
      const { id, updatedData } = action.payload;
      return state.map((medicine) =>
        medicine._id === id ? { ...medicine, ...updatedData } : medicine
      );
    },
  },
});

export const { addMedicine, removeMedicine, updateMedicine } = medicineSlice.actions;

export default medicineSlice.reducer;
