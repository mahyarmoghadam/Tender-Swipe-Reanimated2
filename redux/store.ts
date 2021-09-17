import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import marsSlice from "./marsSlice";

const middlewares = [thunkMiddleware];
const middlewareEnhancer = applyMiddleware(...middlewares);

const reducer = combineReducers({
  mars: marsSlice,
});

export const store = configureStore({
  reducer,
  middleware: middlewares,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
