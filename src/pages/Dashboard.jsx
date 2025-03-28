import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useInvoiceStore from "../hooks/useInvoiceStore";
import Button from "../ui/Button";

const Dashboard = () => {
  const { user } = useAuth();
  const { invoices } = useInvoiceStore();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    totalRevenue: 0,
  });

  // Get current date in format: Tuesday, March 28, 2023
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    // Load customers and products from localStorage
    const savedCustomers = localStorage.getItem("customers");
    const savedProducts = localStorage.getItem("products");

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    // Calculate statistics from invoices
    const totalInvoices = invoices.length;
    const totalPaid = invoices.filter((inv) => inv.status === "paid").length;
    const totalUnpaid = totalInvoices - totalPaid;

    const totalRevenue = invoices.reduce((sum, invoice) => {
      return invoice.status === "paid" ? sum + invoice.total : sum;
    }, 0);

    setStats({
      totalInvoices,
      totalPaid,
      totalUnpaid,
      totalRevenue,
    });
  }, [invoices]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get most recent invoices
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back, {user?.name || "User"}! Today is {today}
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Invoices"
          value={stats.totalInvoices}
          linkTo="/invoices"
          linkText="View all"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          bgColor="bg-blue-50"
        />

        <StatCard
          title="Paid Invoices"
          value={stats.totalPaid}
          subText={`${
            stats.totalInvoices
              ? Math.round((stats.totalPaid / stats.totalInvoices) * 100)
              : 0
          }%`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          bgColor="bg-green-50"
        />

        <StatCard
          title="Unpaid Invoices"
          value={stats.totalUnpaid}
          subText={`${
            stats.totalInvoices
              ? Math.round((stats.totalUnpaid / stats.totalInvoices) * 100)
              : 0
          }%`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          bgColor="bg-red-50"
        />

        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          bgColor="bg-purple-50"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Create Invoice"
            to="/invoices/new"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            }
            bgColor="bg-blue-50"
          />

          <QuickActionCard
            title="Add Customer"
            to="/customers"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            }
            bgColor="bg-green-50"
          />

          <QuickActionCard
            title="Add Product"
            to="/products"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            }
            bgColor="bg-purple-50"
          />

          <QuickActionCard
            title="View All Invoices"
            to="/invoices"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
            bgColor="bg-amber-50"
          />
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-semibold text-lg">Recent Invoices</h2>
              <Link
                to="/invoices"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View All
              </Link>
            </div>
            <div className="p-1">
              {recentInvoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Invoice
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Client
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              #{invoice.invoiceNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {invoice.clientName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(invoice.total)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                invoice.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {invoice.status === "paid" ? "Paid" : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/invoices/${invoice.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500 mb-4">No invoices yet</p>
                  <Link to="/invoices/new">
                    <Button variant="primary" size="sm">
                      Create Your First Invoice
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="space-y-6">
          {/* Customers Card */}
          <SummaryCard
            title="Customers"
            count={customers.length}
            viewAllLink="/customers"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            bgColor="bg-blue-50"
            emptyText="No customers yet"
            emptyActionText="Add Customer"
            emptyActionLink="/customers"
            items={customers.slice(0, 3).map((customer) => ({
              id: customer.id,
              primary: customer.name,
              secondary: customer.email,
            }))}
          />

          {/* Products Card */}
          <SummaryCard
            title="Products"
            count={products.length}
            viewAllLink="/products"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            }
            bgColor="bg-purple-50"
            emptyText="No products yet"
            emptyActionText="Add Product"
            emptyActionLink="/products"
            items={products.slice(0, 3).map((product) => ({
              id: product.id,
              primary: product.name,
              secondary: `${formatCurrency(product.price)} / ${
                product.unit || "item"
              }`,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  subText,
  icon,
  linkTo,
  linkText,
  bgColor,
}) => (
  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <span className={`p-2 rounded-full ${bgColor}`}>{icon}</span>
    </div>
    <div className="flex items-baseline justify-between">
      <div>
        <span className="text-2xl font-semibold">{value}</span>
        {subText && (
          <span className="ml-2 text-xs text-gray-500">{subText}</span>
        )}
      </div>
      {linkTo && (
        <Link to={linkTo} className="text-sm text-blue-600 hover:text-blue-800">
          {linkText}
        </Link>
      )}
    </div>
  </div>
);

const QuickActionCard = ({ title, to, icon, bgColor }) => (
  <Link to={to}>
    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors flex items-center gap-3">
      <div className={`p-2 rounded-full ${bgColor}`}>{icon}</div>
      <span className="font-medium">{title}</span>
    </div>
  </Link>
);

const SummaryCard = ({
  title,
  count,
  viewAllLink,
  icon,
  bgColor,
  items,
  emptyText,
  emptyActionText,
  emptyActionLink,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b">
      <h2 className="font-semibold text-lg">{title}</h2>
      <Link
        to={viewAllLink}
        className="text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        View All
      </Link>
    </div>
    <div className="p-5">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full mr-4 ${bgColor}`}>{icon}</div>
        <div>
          <h3 className="text-2xl font-bold">{count}</h3>
          <p className="text-gray-500 text-sm">Total {title}</p>
        </div>
      </div>

      {items.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li
              key={item.id}
              className="py-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{item.primary}</p>
                <p className="text-sm text-gray-500">{item.secondary}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-3">{emptyText}</p>
          <Link to={emptyActionLink}>
            <Button variant="secondary" size="sm">
              {emptyActionText}
            </Button>
          </Link>
        </div>
      )}
    </div>
  </div>
);

export default Dashboard;
