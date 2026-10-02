import { BrowserRouter, Routes, Route } from "react-router-dom";

import StartScreening from "../pages/StartScreening/StartScreening";
import UploadResumes from "../pages/UploadResumes/UploadResumes";
import Results from "../pages/Results/Results";
import ScreeningHistory from "../pages/ScreeningHistory/ScreeningHistory";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<StartScreening />}
        />

        <Route
  path="/upload-resumes/:sessionId"
  element={<UploadResumes />}
        />
        <Route path="/history" element={<ScreeningHistory />} />

        <Route
          path="/results"
          element={<Results />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;