import reducer, {
  addItemToCart,
  deleteItemFromCart,
  changeItemAmount,
} from "./winesSlice";
test("duplicate additions merge and deleting an unknown ID preserves the bag", () => {
  let state = reducer(
    undefined,
    addItemToCart({ item: { id: "wine" }, amount: 1 }),
  );
  state = reducer(state, addItemToCart({ item: { id: "wine" }, amount: 1 }));
  expect(state.cart).toHaveLength(1);
  expect(state.cart[0].amount).toBe(2);
  state = reducer(state, deleteItemFromCart("unknown"));
  expect(state.cart).toHaveLength(1);
  state = reducer(
    state,
    changeItemAmount({ currentItemId: "wine", currentAmount: 3 }),
  );
  expect(state.cart[0].amount).toBe(3);
  expect(reducer(state, deleteItemFromCart("wine")).cart).toEqual([]);
});
