import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-hot-toast";
import useInvoiceStore from "../hooks/useInvoiceStore";
import Button from "../ui/Button";
import InvoiceView from "../components/InvoiceView";
import { exportToPdf, generatePdfFilename } from "../utils/pdfExport";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const {
    getInvoice,
    currentInvoice,
    isLoading,
    deleteInvoice,
    updateInvoice,
  } = useInvoiceStore();
  const printRef = useRef(null);

  useEffect(() => {
    const invoice = getInvoice(id);
    if (!invoice && !isLoading) {
      navigate("/invoices", { replace: true });
    }
  }, [id, getInvoice, navigate, isLoading]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice-${currentInvoice?.number || id}`,
    onAfterPrint: () => toast.success("Invoice ready for printing!"),
  });

  const handleExportPdf = async () => {
    if (!printRef.current) {
      toast.error("Invoice content not ready for export");
      return;
    }

    try {
      setIsPdfExporting(true);
      const fileName = generatePdfFilename(currentInvoice);
      await exportToPdf(printRef, fileName);
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsPdfExporting(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    updateInvoice(id, { status: newStatus });
    toast.success(`Invoice status updated to ${newStatus}`);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this invoice? This action cannot be undone."
      )
    ) {
      deleteInvoice(id);
      toast.success("Invoice deleted");
      navigate("/invoices");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading invoice...</p>
      </div>
    );
  }

  if (!currentInvoice) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Invoice #{currentInvoice.number}
          </h1>
          <p className="text-gray-500">
            View, print, or update invoice details
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/invoices/${id}/edit`}>
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            Print
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportPdf}
            disabled={isPdfExporting}
          >
            {isPdfExporting ? "Exporting..." : "Export PDF"}
          </Button>
          <div className="relative group">
            <Button variant="secondary" size="sm">
              Status:{" "}
              <span
                className={`ml-1 ${
                  currentInvoice.status === "paid"
                    ? "text-green-600"
                    : currentInvoice.status === "pending"
                    ? "text-yellow-600"
                    : "text-gray-600"
                }`}
              >
                {currentInvoice.status.charAt(0).toUpperCase() +
                  currentInvoice.status.slice(1)}
              </span>
            </Button>
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleStatusChange("draft")}
                  disabled={currentInvoice.status === "draft"}
                >
                  Mark as Draft
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleStatusChange("pending")}
                  disabled={currentInvoice.status === "pending"}
                >
                  Mark as Pending
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleStatusChange("paid")}
                  disabled={currentInvoice.status === "paid"}
                >
                  Mark as Paid
                </button>
              </div>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="no-print">
        <div className="rounded-lg border bg-white p-4 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium">Invoice Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                  ${
                    currentInvoice.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : currentInvoice.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentInvoice.status.charAt(0).toUpperCase() +
                    currentInvoice.status.slice(1)}
                </span>
                <div className="text-sm text-gray-500">
                  {currentInvoice.status === "paid"
                    ? "This invoice has been paid."
                    : currentInvoice.status === "pending"
                    ? "This invoice is awaiting payment."
                    : "This invoice is a draft."}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentInvoice.status === "draft" && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleStatusChange("pending")}
                >
                  Mark as Pending
                </Button>
              )}
              {currentInvoice.status === "pending" && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleStatusChange("paid")}
                >
                  Mark as Paid
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <InvoiceView invoice={currentInvoice} ref={printRef} />

      <div className="flex justify-between items-center mt-8 no-print">
        <Button variant="secondary" onClick={() => navigate("/invoices")}>
          Back to Invoices
        </Button>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleExportPdf}
            disabled={isPdfExporting}
          >
            {isPdfExporting ? "Exporting..." : "Export PDF"}
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Print Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
