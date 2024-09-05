import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const prefix = import.meta.env.VITE_HOST_API;
const getAll = `${prefix}/v1.0/PickleballMangement/GetAllMatchSchedule`;
// const getById = `${prefix}/v1.0/PickleballMangement/GetLeaguageById`;
const add = `${prefix}/v1.0/PickleballMangement/AddMatchSchedule`;
const update = `${prefix}/v1.0/PickleballMangement/UpdateMatchSchedule`;
const deleteMatchSchedule = `${prefix}/v1.0/PickleballMangement/DeleteMatchSchedule`;

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
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const updateMatchSchedule = createAsyncThunk(
  "MatchSchedule/updateMatchSchedule",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.put(`${update}`, payload);
      return response;
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
