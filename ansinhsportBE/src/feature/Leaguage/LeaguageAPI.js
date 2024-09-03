import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';

const prefix = import.meta.env.VITE_HOST_API;
const getAll = `${prefix}/v1.0/PickleballMangement/GetAllLeaguage`
const add = `${prefix}/v1.0/PickleballMangement/AddLeaguage`
const update = `${prefix}/v1.0/PickleballMangement/UpdateStadium`
const deleteStadium = `${prefix}/v1.0/PickleballMangement/DeleteStadium`

export const getAllLeaguage = createAsyncThunk(
    'Leaguage/getAllLeaguage',
    async (payload, thunkAPI) => {
      const response = await axios.get(`${getAll}`)
      return response
    },
)
export const addLeaguage = createAsyncThunk(
    'Leaguage/addLeaguage',
    async (payload, thunkAPI) => {
        let form = new FormData();

        const response = await axios.post(`${add}`,payload,{
            headers:{
                "Content-Type":"multipart/form-data"
            }
        })
        return response
      },
)

