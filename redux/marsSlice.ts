import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MarsModel } from "./MarsModel";
import { RootState } from "./store";

interface MarsState {
  pending: boolean;
  items: MarsModel[];
  favorites: MarsModel[];
}

const initialState: MarsState = {
  pending: false,
  items: [],
  favorites: [],
};

export const fetchMarsData = createAsyncThunk<MarsModel[]>(
  "users/fetchByIdStatus",
  async (thunkAPI) => {
    const response = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=mRmZB4JsbyH1Gvxd3bs4f3sP4IxzGua8eV2m6Sah&count=10"
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
    removeFromFavorite: (state, action: PayloadAction<MarsModel>) => {
      const removeIndex = state.favorites.findIndex(
        (item) => item.title === action.payload.title
      );
      if (removeIndex != -1) {
        state.favorites.splice(removeIndex, 1);
      }
    },
    addToFavorite: (state, action: PayloadAction<MarsModel>) => {
      if (
        state.favorites.findIndex(
          (item) => item.title === action.payload.title
        ) === -1
      ) {
        state.favorites.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMarsData.pending, (state, action) => {
      state.pending = true;
    });
    builder.addCase(fetchMarsData.fulfilled, (state, action) => {
      state.items = action.payload;
      state.pending = false;
    });
  },
});

export const { addToFavorite, removeFromFavorite } = marsSlice.actions;

// export const selectMars = (state: RootState) => state.mars.value;

export default marsSlice.reducer;
