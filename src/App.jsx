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
import PublicRouteGuard from "./routes/PublicRouteGuard";
import PrivateRouteGuard from "./routes/PrivateRouteGuard";

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
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
