import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./redux/store";
import { LanguageProvider } from "./i18n";
import WineShop from "./components/WineShop";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <LanguageProvider>
          <WineShop />
        </LanguageProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
