import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import patientReducer from "../features/patient/patientSlice";
import medicineReducer from "../features/medicine/medicine";
import selectedPatientReducer from "../features/medicine/medicine";



export const store = configureStore({
  reducer: {
    user: userReducer,
    patient:patientReducer,
    medicine:medicineReducer,
    selectedPatient:selectedPatientReducer
  },
});
