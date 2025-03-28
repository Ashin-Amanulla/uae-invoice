import InvoiceForm from "../components/InvoiceForm";

const NewInvoice = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Create New Invoice</h1>
      <InvoiceForm />
    </div>
  );
};

export default NewInvoice;
