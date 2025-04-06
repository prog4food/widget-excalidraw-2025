import { createRoot } from 'react-dom/client'
import "./index.css";
import App from "./App";
import { getBlockIdFromUrl, getURLSearchParams } from "./utils/siyuan";
import AppView from "./AppView";

const root = createRoot(
  document.getElementById("root") as HTMLElement
);
const view = getURLSearchParams("view") === '1' || !getBlockIdFromUrl();
root.render(
  <>
    {view ? <AppView /> : <App />}
  </>
);
