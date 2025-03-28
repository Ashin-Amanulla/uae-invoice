import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCompany } from "../context/CompanyContext";
import useInvoiceStore from "../hooks/useInvoiceStore";
import Button from "../ui/Button";
import FormField from "../ui/FormField";
import Select from "../ui/Select";
import Input from "../ui/Input";
import Label from "../ui/Label";

// UAE VAT rate is 5%
const VAT_RATE = 0.05;

const invoiceSchema = z.object({
  invoiceNumber: z.string().optional(),
  clientId: z.string().optional(),
  clientName: z.string().min(1, "Client name is required"),
  clientAddress: z.string().min(1, "Client address is required"),
  clientEmail: z.string().optional(), // Made email optional
  clientPhone: z.string().optional(),
  clientTRN: z.string().optional(),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["draft", "pending", "paid"]),
  notes: z.string().optional(),
});

const InvoiceForm = ({ existingInvoice = null }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { companyDetails } = useCompany();
  const { createInvoice, updateInvoice, calculateTotals, invoices } =
    useInvoiceStore();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState("");

  const [items, setItems] = useState(
    existingInvoice?.items || [
      {
        id: 1,
        description: "",
        quantity: 1,
        price: 0,
        productId: null,
        unit: "item",
      },
    ]
  );

  // Generate next invoice number
  useEffect(() => {
    if (!existingInvoice) {
      // Find highest invoice number to increment
      if (invoices && invoices.length > 0) {
        const highestNum = invoices
          .map((inv) => {
            if (inv.number) {
              const match = inv.number.match(/INV-(\d+)/);
              return match ? parseInt(match[1]) : 0;
            }
            return 0;
          })
          .reduce((max, num) => Math.max(max, num), 0);

        setNextInvoiceNumber(
          `INV-${(highestNum + 1).toString().padStart(6, "0")}`
        );
      } else {
        setNextInvoiceNumber("INV-000001");
      }
    } else {
      setNextInvoiceNumber(existingInvoice.number || "");
    }
  }, [existingInvoice, invoices]);

  // Load customers and products from localStorage
  useEffect(() => {
    const savedCustomers = localStorage.getItem("customers");
    const savedProducts = localStorage.getItem("products");

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: existingInvoice
      ? {
          invoiceNumber: existingInvoice.number || "",
          clientId: existingInvoice.client?.id || "",
          clientName: existingInvoice.client?.name || "",
          clientAddress: existingInvoice.client?.address || "",
          clientEmail: existingInvoice.client?.email || "",
          clientPhone: existingInvoice.client?.phone || "",
          clientTRN: existingInvoice.client?.trn || "",
          invoiceDate:
            existingInvoice.invoiceDate ||
            new Date().toISOString().split("T")[0],
          dueDate: existingInvoice.dueDate || "",
          status: existingInvoice.status || "draft",
          notes: existingInvoice.notes || "",
        }
      : {
          invoiceNumber: nextInvoiceNumber,
          clientId: "",
          clientName: "",
          clientAddress: "",
          clientEmail: "",
          clientPhone: "",
          clientTRN: "",
          invoiceDate: new Date().toISOString().split("T")[0],
          dueDate: new Date(new Date().setDate(new Date().getDate() + 14))
            .toISOString()
            .split("T")[0],
          status: "draft",
          notes: "",
        },
  });

  // Update invoice number field when nextInvoiceNumber changes
  useEffect(() => {
    if (nextInvoiceNumber && !existingInvoice) {
      setValue("invoiceNumber", nextInvoiceNumber);
    }
  }, [nextInvoiceNumber, setValue, existingInvoice]);

  // Watch for clientId changes
  const watchedClientId = watch("clientId");

  // Update client fields when clientId changes
  useEffect(() => {
    if (watchedClientId) {
      const customer = customers.find((c) => c.id === watchedClientId);
      if (customer) {
        setSelectedCustomer(customer);
        setValue("clientName", customer.name);
        setValue("clientEmail", customer.email || "");
        setValue("clientPhone", customer.phone || "");
        setValue("clientAddress", customer.address || "");
      }
    } else {
      setSelectedCustomer(null);
    }
  }, [watchedClientId, customers, setValue]);

  // Calculate totals based on current items
  const totals = calculateTotals(items);

  const addItem = () => {
    setItems([
      ...items,
      {
        id:
          items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1,
        description: "",
        quantity: 1,
        price: 0,
        productId: null,
        unit: "item",
      },
    ]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            [field]:
              field === "price" || field === "quantity"
                ? parseFloat(value) || 0
                : value,
          };

          // If updating productId, also update description, price, and unit
          if (field === "productId" && value) {
            const product = products.find((p) => p.id === value);
            if (product) {
              updatedItem.description = product.name;
              updatedItem.price = product.price;
              updatedItem.unit = product.unit || "item";
            }
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  // Save new customer to localStorage
  const saveNewCustomer = (customerData) => {
    const newCustomer = {
      id: Date.now().toString(),
      ...customerData,
      createdAt: new Date().toISOString(),
    };

    const updatedCustomers = [...customers, newCustomer];
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    setCustomers(updatedCustomers);

    return newCustomer;
  };

  // Save new product to localStorage
  const saveNewProduct = (productData) => {
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString(),
    };

    const updatedProducts = [...products, newProduct];
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);

    return newProduct;
  };

  const onSubmit = (data) => {
    if (items.length === 0) {
      toast.error("Please add at least one item to the invoice");
      return;
    }

    if (
      items.some(
        (item) => !item.description || item.quantity <= 0 || item.price <= 0
      )
    ) {
      toast.error("Please complete all item fields with valid values");
      return;
    }

    // Check if we need to add a new customer
    let clientData = {
      id: data.clientId,
      name: data.clientName,
      address: data.clientAddress,
      email: data.clientEmail || "",
      phone: data.clientPhone || "",
      trn: data.clientTRN || "",
    };

    // If customer doesn't exist in our list but has name and address, save as new
    if (!data.clientId && data.clientName && data.clientAddress) {
      const existingCustomer = customers.find(
        (c) => c.name === data.clientName && c.email === data.clientEmail
      );

      if (!existingCustomer) {
        const newCustomer = saveNewCustomer({
          name: data.clientName,
          address: data.clientAddress,
          email: data.clientEmail || "",
          phone: data.clientPhone || "",
          trn: data.clientTRN || "",
        });

        clientData.id = newCustomer.id;
        toast.success("New customer added");
      }
    }

    // Check if we need to add new products
    const processedItems = items.map((item) => {
      // If item has description but no product ID, check if we need to save as new product
      if (!item.productId && item.description && item.price > 0) {
        const existingProduct = products.find(
          (p) => p.name === item.description && p.price === item.price
        );

        if (!existingProduct) {
          const newProduct = saveNewProduct({
            name: item.description,
            price: item.price,
            unit: item.unit || "item",
          });

          return {
            ...item,
            productId: newProduct.id,
          };
        }
      }

      return item;
    });

    // Use company details if available, otherwise fall back to user data or demo data
    const sellerData = companyDetails?.name
      ? {
          name: companyDetails.name,
          address: companyDetails.address,
          email: companyDetails.email,
          phone: companyDetails.phone,
          trn: companyDetails.taxId,
          logo: companyDetails.logo,
          bankDetails: companyDetails.bankDetails,
          signature: companyDetails.signature,
        }
      : user || {
          name: "UAE Chemicals Ltd.",
          address: "Dubai, UAE",
          email: "info@uaechemicals.com",
          phone: "+971 4 123 4567",
          trn: "123456789012345",
        };

    // Use provided invoice number or fall back to auto-generated one
    const invoiceNumber = data.invoiceNumber || nextInvoiceNumber;

    const invoiceData = {
      number: invoiceNumber,
      client: clientData,
      seller: {
        name: sellerData.name,
        address: sellerData.address,
        email: sellerData.email,
        phone: sellerData.phone,
        trn: sellerData.trn,
        logo: sellerData.logo,
        bankDetails: sellerData.bankDetails,
        signature: sellerData.signature,
      },
      invoiceDate: data.invoiceDate,
      dueDate: data.dueDate,
      status: data.status,
      items: processedItems,
      notes: data.notes,
      ...totals,
    };

    try {
      if (existingInvoice) {
        updateInvoice(existingInvoice.id, invoiceData);
        toast.success("Invoice updated!");
        navigate(`/invoices/${existingInvoice.id}`);
      } else {
        const newInvoice = createInvoice(invoiceData);
        toast.success("Invoice created!");
        navigate(`/invoices/${newInvoice.id}`);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice. Please try again.");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="text-lg font-medium">Client Information</h3>

            {customers.length > 0 && (
              <div className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Select Customer</Label>
                  <Select
                    id="clientId"
                    {...register("clientId")}
                    className="w-full"
                  >
                    <option value="">
                      -- Select a customer or create new --
                    </option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}{" "}
                        {customer.email ? `(${customer.email})` : ""}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-4">
              <FormField
                label="Client Name"
                name="clientName"
                register={register}
                error={errors.clientName?.message}
                required
              />
              <FormField
                label="Client Address"
                name="clientAddress"
                register={register}
                error={errors.clientAddress?.message}
                required
              />
              <FormField
                label="Client Email"
                name="clientEmail"
                type="email"
                register={register}
                error={errors.clientEmail?.message}
              />
              <FormField
                label="Client Phone"
                name="clientPhone"
                register={register}
                error={errors.clientPhone?.message}
              />
              <FormField
                label="Client TRN (Tax Registration Number)"
                name="clientTRN"
                register={register}
                error={errors.clientTRN?.message}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="text-lg font-medium">Invoice Details</h3>
            <div className="mt-4 space-y-4">
              <FormField
                label="Invoice Number"
                name="invoiceNumber"
                register={register}
                error={errors.invoiceNumber?.message}
                placeholder={nextInvoiceNumber}
                tooltip="Leave blank for auto-generated number"
              />
              <FormField
                label="Invoice Date"
                name="invoiceDate"
                type="date"
                register={register}
                error={errors.invoiceDate?.message}
                required
              />
              <FormField
                label="Due Date"
                name="dueDate"
                type="date"
                register={register}
                error={errors.dueDate?.message}
                required
              />

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  {...register("status")}
                  error={!!errors.status}
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  className="flex w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  rows="3"
                  {...register("notes")}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Invoice Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            Add Item
          </Button>
        </div>

        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {products.length > 0 && (
                    <th className="pb-2 text-left text-sm font-medium">
                      Product
                    </th>
                  )}
                  <th className="pb-2 text-left text-sm font-medium">
                    Description
                  </th>
                  <th className="pb-2 text-left text-sm font-medium">
                    Quantity
                  </th>
                  <th className="pb-2 text-left text-sm font-medium">
                    Unit Price
                  </th>
                  <th className="pb-2 text-left text-sm font-medium">Total</th>
                  <th className="pb-2 text-left text-sm font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    {products.length > 0 && (
                      <td className="py-2 pr-4">
                        <Select
                          value={item.productId || ""}
                          onChange={(e) =>
                            updateItem(item.id, "productId", e.target.value)
                          }
                          className="w-full"
                        >
                          <option value="">-- Select or create new --</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - {formatCurrency(product.price)}
                            </option>
                          ))}
                        </Select>
                      </td>
                    )}
                    <td className="py-2 pr-4">
                      <Input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        placeholder="Item description"
                      />
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex items-center">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, "quantity", e.target.value)
                          }
                          className="w-24"
                        />
                        <span className="ml-2 text-sm text-gray-500">
                          {item.unit || "item"}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 pr-4">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(item.id, "price", e.target.value)
                        }
                        className="w-32"
                      />
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex items-center h-10">
                        {formatCurrency(item.quantity * item.price)}
                      </div>
                    </td>
                    <td className="py-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {items.length === 0 && (
            <div className="flex items-center justify-center p-4 text-sm text-gray-500">
              No items added yet. Click "Add Item" to add your first item.
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <div className="space-y-2 w-64">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>VAT ({totals.vatRate}%):</span>
                <span>{formatCurrency(totals.vatAmount)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2 font-medium">
                <span>Total:</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/invoices")}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {existingInvoice ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
