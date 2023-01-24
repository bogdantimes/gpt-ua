import React from "react";
import { createRoot } from "react-dom/client";

const App = () => <div>Hello, World!</div>;
const app = document.getElementById(`app`);
const root = createRoot(app);
root.render(<App />);
