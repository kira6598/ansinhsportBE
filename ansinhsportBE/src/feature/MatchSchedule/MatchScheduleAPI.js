import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const prefix = import.meta.env.VITE_HOST_API;
const getAll = `${prefix}/v1.0/PickleballMangement/GetAllMatchSchedule`;
// const getById = `${prefix}/v1.0/PickleballMangement/GetLeaguageById`;
const add = `${prefix}/v1.0/PickleballMangement/AddMatchSchedule`;
const update = `${prefix}/v1.0/PickleballMangement/UpdateMatchSchedule`;
const deleteMatchSchedule = `${prefix}/v1.0/PickleballMangement/DeleteMatchSchedule`;
const curentStadium = `${prefix}/v1.0/PickleballMangement/GetCurrentStadium`;
export const getAllMatchSchedule = createAsyncThunk(
  "MatchSchedule/GetAllMatchSchedules",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.get(`${getAll}/${payload}`);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const addMatchSchedule = createAsyncThunk(
  "MatchSchedule/addMatchSchedule",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(`${add}`, payload);
      return { data: response.data }; // Return the response data
      
    } catch (error) {
      return { error: error.response?.data || "An error occurred" }; // Return the error
    }
  }
);
export const getCurrentStadium = createAsyncThunk(
  "MatchSchedule/getCurrentStadium",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.get(`${curentStadium}/${payload}`);
      return { data: response.data }; // Return the response data
      
    } catch (error) {
      return { error: error.response?.data || "An error occurred" }; // Return the error
    }
  }
);
export const updateMatchSchedule = createAsyncThunk(
  "MatchSchedule/updateMatchSchedule",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.put(`${update}`, payload);
      return {status,data};
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const deleteMatchScheduleFn = createAsyncThunk(
  "MatchSchedule/deleteMatchSchedule",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.delete(`${deleteMatchSchedule}/${payload}`);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
