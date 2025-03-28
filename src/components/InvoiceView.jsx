import { forwardRef, useEffect, useState } from "react";
import useTemplateStore from "../hooks/useTemplateStore";

const InvoiceView = forwardRef(({ invoice }, ref) => {
  const { getActiveTemplate, initializeTemplates } = useTemplateStore();
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    initializeTemplates();
    setTemplate(getActiveTemplate());
  }, [initializeTemplates, getActiveTemplate]);

  if (!invoice) {
    return <div>No invoice data available.</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-AE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get template settings or use defaults
  const settings = template?.settings || {
    primaryColor: "#4F46E5",
    fontFamily: "Inter, sans-serif",
    showLogo: true,
    showPaymentDetails: true,
    showSignature: false,
    footerText: "Thank you for your business!",
  };

  // Apply template styling
  const accentColor = settings.primaryColor;
  const fontFamily = settings.fontFamily;

  // Dynamic styles based on template settings
  const dynamicStyles = {
    accentText: { color: accentColor },
    accentBg: { backgroundColor: accentColor },
    accentBorder: { borderColor: accentColor },
    fontStyle: { fontFamily },
  };

  return (
    <div
      ref={ref}
      className="bg-white rounded-lg border shadow-sm overflow-hidden max-w-4xl mx-auto"
      style={dynamicStyles.fontStyle}
    >
      <div className="p-8 space-y-8">
        {/* Header with Logo and Title */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            {settings.showLogo && invoice.seller?.logo && (
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={invoice.seller.logo}
                  alt="Company Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <div>
              <h1
                className="text-2xl font-bold"
                style={dynamicStyles.accentText}
              >
                INVOICE
              </h1>
              <p className="text-sm text-gray-500 mt-1">#{invoice.number}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-xl">
              {invoice.seller?.name || "Company Name"}
            </h2>
            <address className="not-italic text-sm text-gray-500">
              {invoice.seller?.address || "Address"}
              <br />
              {invoice.seller?.email && `Email: ${invoice.seller.email}`}
              <br />
              {invoice.seller?.phone && `Phone: ${invoice.seller.phone}`}
              <br />
              {invoice.seller?.trn && `TRN: ${invoice.seller.trn}`}
            </address>
          </div>
        </div>

        {/* Invoice Info and Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3
              className="font-medium text-sm uppercase mb-3"
              style={dynamicStyles.accentText}
            >
              Bill To:
            </h3>
            <h4 className="font-bold">{invoice.client?.name}</h4>
            <address className="not-italic text-sm text-gray-500">
              {invoice.client?.address}
              <br />
              {invoice.client?.email && `Email: ${invoice.client.email}`}
              <br />
              {invoice.client?.phone && `Phone: ${invoice.client.phone}`}
              <br />
              {invoice.client?.trn && `TRN: ${invoice.client.trn}`}
            </address>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3
                  className="font-medium text-sm uppercase mb-1"
                  style={dynamicStyles.accentText}
                >
                  Invoice Date:
                </h3>
                <p>{formatDate(invoice.invoiceDate)}</p>
              </div>
              <div>
                <h3
                  className="font-medium text-sm uppercase mb-1"
                  style={dynamicStyles.accentText}
                >
                  Due Date:
                </h3>
                <p>{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <h3
                  className="font-medium text-sm uppercase mb-1"
                  style={dynamicStyles.accentText}
                >
                  Status:
                </h3>
                <p
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                  ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : invoice.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div>
          <h3
            className="font-medium text-sm uppercase mb-3"
            style={dynamicStyles.accentText}
          >
            Invoice Items
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ backgroundColor: `${accentColor}15` }}>
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={dynamicStyles.accentText}
                  >
                    #
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={dynamicStyles.accentText}
                  >
                    Description
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={dynamicStyles.accentText}
                  >
                    Quantity
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={dynamicStyles.accentText}
                  >
                    Unit Price
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                    style={dynamicStyles.accentText}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items &&
                  invoice.items.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-gray-500">
                        {item.quantity} {item.unit || ""}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-gray-500">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-gray-900">
                        {formatCurrency(item.quantity * item.price)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">
                VAT ({invoice.vatRate || 5}%):
              </span>
              <span>{formatCurrency(invoice.vatAmount || 0)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold">
              <span>Total:</span>
              <span>{formatCurrency(invoice.total || 0)}</span>
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        {settings.showPaymentDetails &&
          invoice.seller?.bankDetails &&
          Object.values(invoice.seller.bankDetails).some((value) => value) && (
            <div className="border-t pt-4">
              <h3
                className="font-medium text-sm uppercase mb-2"
                style={dynamicStyles.accentText}
              >
                Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {invoice.seller.bankDetails.bankName && (
                  <div>
                    <span className="font-medium">Bank: </span>
                    <span>{invoice.seller.bankDetails.bankName}</span>
                  </div>
                )}
                {invoice.seller.bankDetails.accountName && (
                  <div>
                    <span className="font-medium">Account Name: </span>
                    <span>{invoice.seller.bankDetails.accountName}</span>
                  </div>
                )}
                {invoice.seller.bankDetails.accountNumber && (
                  <div>
                    <span className="font-medium">Account Number: </span>
                    <span>{invoice.seller.bankDetails.accountNumber}</span>
                  </div>
                )}
                {invoice.seller.bankDetails.iban && (
                  <div>
                    <span className="font-medium">IBAN: </span>
                    <span>{invoice.seller.bankDetails.iban}</span>
                  </div>
                )}
                {invoice.seller.bankDetails.swiftCode && (
                  <div>
                    <span className="font-medium">SWIFT/BIC: </span>
                    <span>{invoice.seller.bankDetails.swiftCode}</span>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Notes */}
        {invoice.notes && (
          <div className="border-t pt-4">
            <h3
              className="font-medium text-sm uppercase mb-2"
              style={dynamicStyles.accentText}
            >
              Notes
            </h3>
            <p className="text-sm">{invoice.notes}</p>
          </div>
        )}

        {/* Signature Area */}
        {settings.showSignature && (
          <div className="border-t pt-6">
            <div className="flex justify-end mt-8">
              <div className="w-64 text-center">
                {invoice.seller?.signature ? (
                  <img
                    src={invoice.seller.signature}
                    alt="Signature"
                    className="h-16 mx-auto"
                  />
                ) : (
                  <div
                    className="border-t-2 pt-2"
                    style={dynamicStyles.accentBorder}
                  ></div>
                )}
                <p className="text-sm mt-2">
                  {invoice.seller?.name || "Authorized Signature"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer with Terms */}
        <div className="border-t pt-6 text-center text-sm text-gray-500">
          <p>{settings.footerText}</p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceView;
