import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const prefix = import.meta.env.VITE_HOST_API;
const getAll = `${prefix}/v1.0/PickleballMangement/GetAllPlayers`;
// const getById = `${prefix}/v1.0/PickleballMangement/GetLeaguageById`;
const add = `${prefix}/v1.0/PickleballMangement/AddPlayer`;
const update = `${prefix}/v1.0/PickleballMangement/UpdatePlayer`;
const deletePlayer = `${prefix}/v1.0/PickleballMangement/DeletePlayer`;

export const GetAllPlayers = createAsyncThunk(
  "Player/GetAllPlayers",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.get(`${getAll}/${payload}`);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const addPlayer = createAsyncThunk(
  "Player/addPlayer",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(`${add}`, payload);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const updatePlayer = createAsyncThunk(
  "Player/updatePlayer",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.put(`${update}`, payload);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
export const deletePlayerFn = createAsyncThunk(
  "Player/deletePlayer",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.delete(`${deletePlayer}/${payload}`);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
