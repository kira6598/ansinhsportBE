import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const prefix = import.meta.env.VITE_HOST_API;
const getAll = `${prefix}/v1.0/PickleballMangement/GetAllLeaguage`;
const getById = `${prefix}/v1.0/PickleballMangement/GetLeaguageById`;
const add = `${prefix}/v1.0/PickleballMangement/AddLeaguage`;
const update = `${prefix}/v1.0/PickleballMangement/UpdateLeaguage`;
const deleteStadium = `${prefix}/v1.0/PickleballMangement/DeleteLeaguage`;

export const getAllLeaguage = createAsyncThunk(
  "Leaguage/getAllLeaguage",
  async (payload, thunkAPI) => {
    const response = await axios.get(`${getAll}`);
    return response;
  }
);
export const addLeaguage = createAsyncThunk(
  "Leaguage/addLeaguage",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(`${add}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { data: response.data };
    } catch (error) {
      return { error: error.response?.data || "An error occurred" }; // Return the error
    }
  }
);
export const updateLeaguage = createAsyncThunk(
  "Leaguage/updateLeaguage",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(`${update}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { data: response.data }; // Return the response data
    } catch (error) {
      return { error: error.response?.data || "An error occurred" }; // Return the error
    }
    // Return the error
  }
);
export const getLeaguageById = createAsyncThunk(
  "Leaguage/getLeaguageById",
  async (payload, thunkAPI) => {
    const response = await axios.get(`${getById}/${payload}`);
    return response;
  }
);
export const deleteLeaguageById = createAsyncThunk(
  "Leaguage/deleteLeaguageById",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.delete(`${deleteStadium}/${payload}`);
      return { data: response.data }; // Return the response data
    } catch (error) {
      return { error: error.response?.data || "An error occurred" }; // Return the error
    }
  }
);
