import React from "react";
const paths = {
  gift: "M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8H8a3 3 0 1 1 3-3l1 3Zm0 0h4a3 3 0 1 0-3-3l-1 3Z",
  basket: "m4 10 2 11h12l2-11M2 10h20M7 10l5-8 5 8M9 14v3M15 14v3",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  cart: "M2 3h3l3 13h11l3-10H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2",
  fingerprint: "M8 2.7a10 10 0 0 1 8 0 M4.5 6a10 10 0 0 1 15 0 M2.8 10a9.5 9.5 0 0 1 18.4 0 M3 15v-3a9 9 0 0 1 18 0v3 M5 18c1-2 .1-4 .1-6a6.9 6.9 0 0 1 13.8 0c0 3 .5 5-.4 8 M7.2 20c1.5-3 .2-5.6.2-8a4.6 4.6 0 0 1 9.2 0c0 4 .6 6.4-1 9.3 M9.7 21.4c1.5-3 .1-6.7.1-9.4a2.2 2.2 0 0 1 4.4 0c0 4 1 7-1.1 10 M12 12c0 3 1 5.5-.4 8.5",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "m6 6 12 12M6 18 18 6",
  up: "m6 10 6-6 6 6M12 4v16",
  down: "m6 14 6 6 6-6M12 4v16",
  left: "m10 6-6 6 6 6M4 12h16",
  external: "M7 17 17 7M7 7h10v10",
  sparkle: "M12 2v20M2 12h20M5 5l14 14M5 19 19 5",
};
export default function Icon({ name, size = 20 }) {
  return <svg className="ui-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}
