import { forwardRef } from "react";

const InvoiceView = forwardRef(({ invoice }, ref) => {
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

  return (
    <div
      ref={ref}
      className="bg-white rounded-lg border shadow-sm overflow-hidden max-w-4xl mx-auto"
    >
      <div className="p-8 space-y-8">
        {/* Header with Logo and Title */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            {invoice.seller?.logo && (
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={invoice.seller.logo}
                  alt="Company Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-blue-600">INVOICE</h1>
              <p className="text-sm text-gray-500 mt-1">#{invoice.number}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-xl">
              {invoice.seller?.name || "UAE Chemicals Ltd."}
            </h2>
            <address className="not-italic text-sm text-gray-500">
              {invoice.seller?.address || "Dubai, UAE"}
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
            <h3 className="font-medium text-sm uppercase text-gray-500 mb-3">
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
                <h3 className="font-medium text-sm uppercase text-gray-500 mb-1">
                  Invoice Date:
                </h3>
                <p>{formatDate(invoice.invoiceDate)}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm uppercase text-gray-500 mb-1">
                  Due Date:
                </h3>
                <p>{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm uppercase text-gray-500 mb-1">
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
          <h3 className="font-medium text-sm uppercase text-gray-500 mb-3">
            Invoice Items
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
        {invoice.seller?.bankDetails &&
          Object.values(invoice.seller.bankDetails).some((value) => value) && (
            <div className="border-t pt-4">
              <h3 className="font-medium text-sm uppercase text-gray-500 mb-2">
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
            <h3 className="font-medium text-sm uppercase text-gray-500 mb-2">
              Notes
            </h3>
            <p className="text-sm">{invoice.notes}</p>
          </div>
        )}

        {/* Footer with Terms */}
        <div className="border-t pt-6 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          {invoice.seller?.signature && (
            <div className="mt-4 flex justify-center">
              <div className="max-w-[200px] h-16">
                <img
                  src={invoice.seller.signature}
                  alt="Digital Signature"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}
          <p className="mt-1">This invoice was created using InvoicePro.</p>
        </div>
      </div>
    </div>
  );
});

InvoiceView.displayName = "InvoiceView";
export default InvoiceView;
