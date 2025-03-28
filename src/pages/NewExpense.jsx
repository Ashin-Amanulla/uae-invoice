import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import useExpenseStore from "../hooks/useExpenseStore";
import { toast } from "react-hot-toast";

// Lazy load the form
const ExpenseForm = lazy(() => import("../components/ExpenseForm"));

const NewExpense = () => {
  const navigate = useNavigate();
  const { createExpense } = useExpenseStore();

  const handleSubmit = (data) => {
    try {
      createExpense(data);
      toast.success("Expense recorded successfully");
      navigate("/expenses");
    } catch (error) {
      toast.error("Failed to create expense. Please try again.");
      console.error("Error creating expense:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Record Expense</h1>
        <p className="text-gray-500">Add a new business expense</p>
      </div>

      <Suspense
        fallback={<div className="p-8 text-center">Loading form...</div>}
      >
        <ExpenseForm onSubmit={handleSubmit} />
      </Suspense>
    </div>
  );
};

export default NewExpense;
