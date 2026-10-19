import { selectWines } from "./PageMain";
import wines from "../items.json";

test("country, case-insensitive type, search and price sort compose without changing the catalog", () => {
  const original = wines.map((w) => w.id);
  const selected = selectWines(
    wines,
    "italy",
    "white",
    "freschello",
    "price-low",
  );
  expect(selected.length).toBeGreaterThan(0);
  selected.forEach((w) => {
    expect(w.region[0]).toBe("Italy");
    expect(w.type.toLowerCase()).toBe("white");
  });
  expect(selected.map((w) => w.price)).toEqual(
    selected.map((w) => w.price).sort((a, b) => a - b),
  );
  expect(wines.map((w) => w.id)).toEqual(original);
});
test("New World includes USA subregions and unmatched searches return empty", () => {
  expect(
    selectWines(wines, "new-world", "all", "", "featured").some(
      (w) => w.region[0] === "USA, California",
    ),
  ).toBe(true);
  expect(
    selectWines(wines, "", "all", "nothing-matches-this", "featured"),
  ).toEqual([]);
});
