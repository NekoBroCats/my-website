import { Routes, Route } from "react-router-dom";
import { ViewModeProvider } from "./context/ViewModeContext";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { WorksPage } from "./pages/WorksPage";
import { CareerPage } from "./pages/CareerPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <ViewModeProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-(--ink) focus:px-4 focus:py-2 focus:text-(--paper)"
      >
        本文へスキップ
      </a>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ViewModeProvider>
  );
}
