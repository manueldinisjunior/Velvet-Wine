import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./redux/store";
import WineShop from "./components/WineShop";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <WineShop />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
