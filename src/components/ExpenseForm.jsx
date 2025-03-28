import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

// Predefined expense categories
const EXPENSE_CATEGORIES = [
  "Office Supplies",
  "Rent",
  "Utilities",
  "Salaries",
  "Marketing",
  "Travel",
  "Software",
  "Equipment",
  "Maintenance",
  "Insurance",
  "Legal & Professional",
  "Meals & Entertainment",
  "Taxes",
  "Miscellaneous",
];

// Form validation schema
const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  notes: z.string().optional(),
  paymentMethod: z.string().optional(),
  receipt: z.string().optional(),
});

const ExpenseForm = ({ onSubmit, existingExpense = null }) => {
  const navigate = useNavigate();
  const [customCategory, setCustomCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: existingExpense
      ? {
          date: existingExpense.date || new Date().toISOString().split("T")[0],
          amount: existingExpense.amount?.toString() || "",
          category: existingExpense.category || "",
          description: existingExpense.description || "",
          notes: existingExpense.notes || "",
          paymentMethod: existingExpense.paymentMethod || "",
          receipt: existingExpense.receipt || "",
        }
      : {
          date: new Date().toISOString().split("T")[0],
          amount: "",
          category: "",
          description: "",
          notes: "",
          paymentMethod: "",
          receipt: "",
        },
  });

  // Watch the category field
  const watchedCategory = watch("category");

  // Set custom category flag if category is not in predefined list
  useEffect(() => {
    if (
      existingExpense?.category &&
      !EXPENSE_CATEGORIES.includes(existingExpense.category)
    ) {
      setCustomCategory(true);
      setSelectedCategory("custom");
    } else if (existingExpense?.category) {
      setSelectedCategory(existingExpense.category);
    }
  }, [existingExpense]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);

    if (value === "custom") {
      setCustomCategory(true);
      setValue("category", "");
    } else {
      setCustomCategory(false);
      setValue("category", value);
    }
  };

  const handleFormSubmit = (data) => {
    // Convert amount to number
    const formattedData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date*
            </label>
            <input
              type="date"
              {...register("date")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount*
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                {...register("amount")}
                className="w-full pl-7 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category*
            </label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Category --</option>
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="custom">Custom Category</option>
            </select>

            {customCategory && (
              <div className="mt-2">
                <input
                  type="text"
                  {...register("category")}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter custom category"
                />
              </div>
            )}

            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              {...register("paymentMethod")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Payment Method --</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
              <option value="Digital Wallet">Digital Wallet</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <input
              type="text"
              {...register("description")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of expense"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register("notes")}
              rows="3"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional details about this expense..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Receipt URL
            </label>
            <input
              type="text"
              {...register("receipt")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Link to digital receipt (if available)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Add URL for cloud-stored receipts or images
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/expenses")}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {existingExpense ? "Update Expense" : "Save Expense"}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
