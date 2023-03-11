import React from "react";
import App from "./App";
import {createRoot} from "react-dom/client";

// import i18n (needs to be bundled)
import "./i18n";

const app = document.getElementById(`app`);
const root = createRoot(app);
root.render(<>
  <App/>
</>);
