import { createSlice } from "@reduxjs/toolkit";

export interface sidebarState {
  value: boolean;
}

const initialState: sidebarState = {
  value: true,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    sidebar: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = !state.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { sidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
