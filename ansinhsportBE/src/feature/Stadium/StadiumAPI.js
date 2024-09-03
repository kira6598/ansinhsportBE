import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';

const prefix = import.meta.env.VITE_HOST_API;
const getAll = `${prefix}/v1.0/PickleballMangement/GetAllStadium`
const add = `${prefix}/v1.0/PickleballMangement/AddStadium`
const update = `${prefix}/v1.0/PickleballMangement/UpdateStadium`
const deleteStadium = `${prefix}/v1.0/PickleballMangement/DeleteStadium`

export const getAllStadium = createAsyncThunk(
    'stadium/getAllStadium',
    async (payload, thunkAPI) => {
      const response = await axios.get(`${getAll}/${payload}`)
      return response
    },
  )

