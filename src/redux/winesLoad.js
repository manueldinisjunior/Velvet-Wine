import alcoholFree from "../data/alcoholFree.json";
import { ref, get } from "firebase/database";
import { updateLoadState, updateData } from "./winesSlice";
import database from "../firebase-config";
import savedWines from "../items.json";
let pending;
export function winesLoad(dispatch) {
  dispatch(updateLoadState({ state: 1, error: null }));
  if (!pending)
    pending = Promise.race([
      get(ref(database, "wines/")).then((snapshot) => {
        const value = snapshot.val();
        const wines = Array.isArray(value) ? value : Object.values(value || {});
        if (
          !wines.length ||
          !wines.every(
            (wine) =>
              wine?.id &&
              typeof wine.name === "string" &&
              Array.isArray(wine.region) &&
              Array.isArray(wine.grapeSort) &&
              typeof wine.type === "string" &&
              Number.isFinite(wine.price),
          )
        )
          throw new Error("Invalid catalog");
        return wines;
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Catalog timeout")), 6000),
      ),
    ]).finally(() => {
      pending = null;
    });
  return pending
    .then((wines) => {
      dispatch(updateData([...wines.filter(wine => !alcoholFree.some(item => item.id === wine.id)), ...alcoholFree]));
      dispatch(updateLoadState({ state: 2, error: null }));
    })
    .catch(() => {
      dispatch(updateData([...savedWines, ...alcoholFree]));
      dispatch(
        updateLoadState({ state: 2, error: "Live catalog unavailable" }),
      );
    });
}
