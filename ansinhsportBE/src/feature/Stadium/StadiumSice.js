import { createSlice, isPending } from "@reduxjs/toolkit";
import { getAllStadium } from "./StadiumAPI";
const initialState = {
  entities: [],
  isFetching: false,
  isSuccess: false,
  isError: false,
  errMsg: "",
};

export const StadiumSlice = createSlice({
  name: "stadium",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllStadium.pending, (state) => {
        state.isFetching = true;
      })
      // Add reducers for additional action types here, and handle loading state as needed
      .addCase(getAllStadium.fulfilled, (state, action) => {
        // Add user to the state array
        // state.entities.push(action.payload);
        state.isSuccess = true;
        state.isFetching = false;
      })
      .addCase(getAllStadium.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.isError = true;
        state.errMsg = payload || "";
      });
  },
});

// Action creators are generated for each case reducer function

export default StadiumSlice.reducer;
