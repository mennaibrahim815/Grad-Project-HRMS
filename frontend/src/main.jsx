import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/appStore";
import App from "./App"; // ✅ مهم
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App /> {/* ✅ بدل RouterProvider */}
    </Provider>
  </React.StrictMode>,
);
