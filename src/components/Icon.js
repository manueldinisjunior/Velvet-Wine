import React from "react";
const paths = {
  shield: "M12 3 4 6v6c0 4 8 9 8 9s8-5 8-9V6l-8-3Z M9 12l2 2 4-4",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "m6 6 12 12M6 18 18 6",
  up: "m6 10 6-6 6 6M12 4v16",
  down: "m6 14 6 6 6-6M12 4v16",
  left: "m10 6-6 6 6 6M4 12h16",
  external: "M7 17 17 7M7 7h10v10",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  sparkle: "M12 2v20M2 12h20M5 5l14 14M5 19 19 5",
};
export default function Icon({ name, size = 20 }) {
  return <svg className="ui-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}
