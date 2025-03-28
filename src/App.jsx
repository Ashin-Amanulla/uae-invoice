import { useEffect, lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CompanyProvider } from "./context/CompanyContext";
import useInvoiceStore from "./hooks/useInvoiceStore";
import useExpenseStore from "./hooks/useExpenseStore";
import Layout from "./layout/Layout";

// Lazy load page components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const InvoiceList = lazy(() => import("./pages/InvoiceList"));
const InvoiceDetail = lazy(() => import("./pages/InvoiceDetail"));
const NewInvoice = lazy(() => import("./pages/NewInvoice"));
const EditInvoice = lazy(() => import("./pages/EditInvoice"));
const Customers = lazy(() => import("./pages/Customers"));
const Products = lazy(() => import("./pages/Products"));
const CompanySettings = lazy(() => import("./pages/CompanySettings"));
const ExpenseList = lazy(() => import("./pages/ExpenseList"));
const NewExpense = lazy(() => import("./pages/NewExpense"));
const EditExpense = lazy(() => import("./pages/EditExpense"));

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

// Placeholder loading component
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]"></div>
      <p className="mt-2 text-gray-700">Loading...</p>
    </div>
  </div>
);

// App error boundary
const ErrorFallback = ({ error }) => (
  <div className="flex min-h-screen flex-col items-center justify-center p-4">
    <h2 className="text-2xl font-bold text-red-600 mb-4">
      Something went wrong
    </h2>
    <p className="text-lg mb-4">
      {error?.message || "An unknown error occurred"}
    </p>
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => window.location.reload()}
    >
      Reload the page
    </button>
  </div>
);

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const { initializeStore: initializeInvoiceStore } = useInvoiceStore();
  const { initializeStore: initializeExpenseStore } = useExpenseStore();
  const [error, setError] = useState(null);

  // Initialize stores
  useEffect(() => {
    try {
      initializeInvoiceStore();
      initializeExpenseStore();
    } catch (err) {
      console.error("Failed to initialize stores:", err);
      setError(err);
    }
  }, [initializeInvoiceStore, initializeExpenseStore]);

  if (error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/new" element={<NewInvoice />} />
          <Route path="invoices/:id/edit" element={<EditInvoice />} />
          <Route path="invoices/:id" element={<InvoiceDetail />} />
          <Route path="customers" element={<Customers />} />
          <Route path="products" element={<Products />} />
          <Route path="company-settings" element={<CompanySettings />} />
          <Route path="expenses" element={<ExpenseList />} />
          <Route path="expenses/new" element={<NewExpense />} />
          <Route path="expenses/:id/edit" element={<EditExpense />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster position="top-right" />
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;
