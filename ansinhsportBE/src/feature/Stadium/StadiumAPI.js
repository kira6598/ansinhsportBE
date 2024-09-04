import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const prefix = import.meta.env.VITE_HOST_API;
const getAll = `${prefix}/v1.0/PickleballMangement/GetAllStadium`;
const add = `${prefix}/v1.0/PickleballMangement/AddStadium`;
const update = `${prefix}/v1.0/PickleballMangement/UpdateStadium`;
const deleteStadium = `${prefix}/v1.0/PickleballMangement/DeleteStadium`;

export const getAllStadium = createAsyncThunk(
  "stadium/getAllStadium",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.get(`${getAll}/${payload}`);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const addStadium = createAsyncThunk(
  "stadium/addStadium",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(`${add}`, payload);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateStadium = createAsyncThunk(
  "stadium/updateStadium",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(`${update}`, payload);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteStadiums = createAsyncThunk(
  "stadium/deleteStadium",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.delete(`${deleteStadium}/${payload}`);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
