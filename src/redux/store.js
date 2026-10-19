import { configureStore } from "@reduxjs/toolkit";

import winesReducer from "./winesSlice";

export const store = configureStore({
  reducer: {
    wines: winesReducer,
  },
});
