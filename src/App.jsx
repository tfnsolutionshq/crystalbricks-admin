import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/shared/context/AuthContext";

import SignInPage from "./features/auth/pages/SignInPage";
import SetPasscodePage from "./features/auth/pages/SetPasscodePage";
import ResetPasscodePage from "./features/auth/pages/ResetPasscodePage";
import DashboardPage from "./features/dashboard/pages/AdminDashboard";
import ProductsPage from "./features/products/pages/ProductsPage";
import RateConfigPage from "./features/rate-config/pages/RateConfigPage";
import RateConfigDetailsPage from "./features/rate-config/pages/RateConfigDetails";
import CustomersPage from "./features/customers/pages/CustomersPage";
import CustomerDetailsPage from "./features/customers/pages/CustomerDetailsPage";
import TransactionsPage from "./features/transactions/pages/TransactionsPage";
import TransactionDetailsPage from "./features/transactions/pages/TransactionDetailsPage";
import AnalyticsPage from "./features/analytics/pages/AnalyticsPage";
import PublicRouteGuard from "./routes/PublicRouteGuard";
import PrivateRouteGuard from "./routes/PrivateRouteGuard";
import TeamManagementPage from "./features/team-management/pages/TeamManagementPage";
import PersonalInfoPage from "./features/settings/pages/PersonalInfoPage";
import SecurityPage from "./features/settings/pages/SecurityPage";
import DevicesPage from "./features/settings/pages/DevicesPage";
import ContributionsPage from "./features/contributions/pages/ContributionsPage";
import CustomerContributionDetailsPage from "./features/contributions/pages/CustomerContributionDetailsPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PublicRouteGuard />}>
            <Route path="/" element={<Navigate to="/signin" replace />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/set-passcode" element={<SetPasscodePage />} />
            <Route path="/reset-passcode" element={<ResetPasscodePage />} />
          </Route>

          <Route element={<PrivateRouteGuard />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/rate-config" element={<RateConfigPage />} />
            <Route
              path="/rate-config/:productId"
              element={<RateConfigDetailsPage />}
            />
            <Route path="/customers" element={<CustomersPage />} />
            <Route
              path="/customers/:customerId"
              element={<CustomerDetailsPage />}
            />
            <Route
              path="/customers/:customerId/transactions/:transactionId"
              element={<TransactionDetailsPage />}
            />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route
              path="/transactions/:transactionId"
              element={<TransactionDetailsPage />}
            />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/team-management" element={<TeamManagementPage />} />

            <Route
              path="/settings"
              element={<Navigate to="/settings/personal-info" replace />}
            />
            <Route
              path="/settings/personal-info"
              element={<PersonalInfoPage />}
            />
            <Route path="/settings/security" element={<SecurityPage />} />
            <Route path="/settings/devices" element={<DevicesPage />} />
            <Route path="/contributions" element={<ContributionsPage />} />
            <Route
              path="/contributions/:customerId"
              element={<CustomerContributionDetailsPage />}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
