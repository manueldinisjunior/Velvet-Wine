import { get } from "firebase/database";
import { winesLoad } from "./winesLoad";
import { updateData, updateLoadState } from "./winesSlice";
import savedWines from "../items.json";

jest.mock("../firebase-config", () => ({}));
jest.mock("firebase/database", () => ({ ref: jest.fn(), get: jest.fn() }));
beforeEach(() => { jest.useFakeTimers(); get.mockReset(); });
afterEach(() => { jest.useRealTimers(); });

test("concurrent loads share one request and clear its timeout after success", async () => {
  const dispatch = jest.fn();
  get.mockResolvedValue({ val: () => savedWines });
  const first = winesLoad(dispatch);
  const second = winesLoad(dispatch);
  expect(get).toHaveBeenCalledTimes(1);
  expect(jest.getTimerCount()).toBe(1);
  await Promise.all([first, second]);
  expect(jest.getTimerCount()).toBe(0);
  expect(dispatch).toHaveBeenCalledWith(updateData(savedWines));
  expect(dispatch).toHaveBeenLastCalledWith(updateLoadState({state:2,error:null}));
});

test("timeout falls back to saved wines, ignores late data and allows retry", async () => {
  const dispatch = jest.fn();
  let resolve;
  get.mockImplementationOnce(() => new Promise(done => { resolve = done; }));
  const request = winesLoad(dispatch);
  jest.advanceTimersByTime(6000);
  await request;
  expect(dispatch).toHaveBeenLastCalledWith(updateLoadState({state:2,error:"Live catalog unavailable"}));
  const count = dispatch.mock.calls.length;
  resolve({ val: () => savedWines.slice(0, 1) });
  await Promise.resolve();
  expect(dispatch).toHaveBeenCalledTimes(count);
  get.mockResolvedValueOnce({ val: () => savedWines });
  await winesLoad(dispatch);
  expect(dispatch).toHaveBeenLastCalledWith(updateLoadState({state:2,error:null}));
  expect(jest.getTimerCount()).toBe(0);
});
