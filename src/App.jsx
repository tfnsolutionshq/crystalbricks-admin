import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignInPage from "./features/auth/pages/SignInPage";
import SetPasscodePage from "./features/auth/pages/SetPasscodePage";
import ResetPasscodePage from "./features/auth/pages/ResetPasscodePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/set-passcode" element={<SetPasscodePage />} />
        <Route path="/reset-passcode" element={<ResetPasscodePage />} />
      </Routes>
    </Router>
  );
}
