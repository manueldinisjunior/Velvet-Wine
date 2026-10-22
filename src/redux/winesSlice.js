import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataLoadState: 0, //0 - not loaded, 1 - is loading, 2 - loaded, 3 - error
  dataLoadError: null,
  initialData: null,
  data: null,
  cart: [],
  cartNotice: null,
  addSequence: 0,
};

export const winesSlice = createSlice({
  name: "wines",
  initialState,
  reducers: {
    updateLoadState: (state, action) => {
      state.dataLoadState = action.payload.state;
      state.dataLoadError = action.payload.error;
    },

    updateData: (state, action) => {
      state.initialData = action.payload;
      state.data = action.payload;
    },

    addItemToCart: (state, action) => {
      state.addSequence += 1;
      state.cartNotice = action.payload.item.name;
      const existing = state.cart.find(
        (entry) => entry.item.id === action.payload.item.id,
      );
      if (existing) existing.amount += action.payload.amount;
      else state.cart.push(action.payload);
    },

    changeItemAmount: (state, action) => {
      state.cart.forEach((v) => {
        if (v.item.id === action.payload.currentItemId) {
          v.amount = action.payload.currentAmount;
        }
      });
    },

    deleteItemFromCart: (state, action) => {
      const index = state.cart.findIndex((v) => v.item.id === action.payload);
      if (index !== -1) state.cart.splice(index, 1);
    },

    clearCart: (state, action) => {
      state.cart = [];
    },

    updateCart: (state, action) => {
      state.cart = action.payload;
    },

    setPageWines: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const {
  updateLoadState,
  updateData,
  addItemToCart,
  changeItemAmount,
  deleteItemFromCart,
  clearCart,
  updateCart,
  setPageWines,
} = winesSlice.actions;

export default winesSlice.reducer;
