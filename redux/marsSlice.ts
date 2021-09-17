import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface MarsModel {
  title: string;
  url: string;
  service_version: string;
  media_type: string;
  hdurl: string;
  explanation: string;
  date: string;
  height: number;
}

interface MarsState {
  pending: boolean;
  items: MarsModel[];
}

const initialState: MarsState = {
  pending: false,
  items: [],
};

export const fetchMarsData = createAsyncThunk<MarsModel[]>(
  "users/fetchByIdStatus",
  async (thunkAPI) => {
    const response = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=mRmZB4JsbyH1Gvxd3bs4f3sP4IxzGua8eV2m6Sah&count=5"
    );
    return response
      .json()
      .then((res) => {
        return res as MarsModel[];
      })
      .then((data) => {
        data.forEach((x) => (x.height = Math.round(Math.random() * 150 + 150)));
        return data;
      });
  }
);

export const marsSlice = createSlice({
  name: "mars",
  initialState,
  reducers: {
    // increment: (state) => {
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMarsData.pending, (state, action) => {
      state.pending = true;
    });
    builder.addCase(fetchMarsData.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const {} = marsSlice.actions;

// export const selectMars = (state: RootState) => state.mars.value;

export default marsSlice.reducer;
