// store/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: localStorage.getItem("theme") || "dark",
  },
  reducers: {
  toggleTheme: (state) => {
  state.mode = state.mode === "dark" ? "light" : "dark";
  localStorage.setItem("theme", state.mode);
  document.documentElement.setAttribute("data-theme", state.mode); // ← ناقص
},
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;