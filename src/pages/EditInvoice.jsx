import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InvoiceForm from "../components/InvoiceForm";
import useInvoiceStore from "../hooks/useInvoiceStore";

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvoice, currentInvoice, isLoading } = useInvoiceStore();

  useEffect(() => {
    const invoice = getInvoice(id);
    if (!invoice && !isLoading) {
      navigate("/invoices", { replace: true });
    }
  }, [id, getInvoice, navigate, isLoading]);

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
      <h1 className="text-3xl font-bold tracking-tight">
        Edit Invoice #{currentInvoice.number}
      </h1>
      <InvoiceForm existingInvoice={currentInvoice} />
    </div>
  );
};

export default EditInvoice;
