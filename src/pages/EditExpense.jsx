import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useExpenseStore from "../hooks/useExpenseStore";
import { toast } from "react-hot-toast";

// Lazy load the form
const ExpenseForm = lazy(() => import("../components/ExpenseForm"));

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getExpense, updateExpense } = useExpenseStore();
  const [expense, setExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExpense = async () => {
      try {
        setIsLoading(true);
        const loadedExpense = getExpense(id);

        if (!loadedExpense) {
          toast.error("Expense not found");
          navigate("/expenses");
          return;
        }

        setExpense(loadedExpense);
      } catch (error) {
        console.error("Error loading expense:", error);
        toast.error("Failed to load expense details");
        navigate("/expenses");
      } finally {
        setIsLoading(false);
      }
    };

    loadExpense();
  }, [id, getExpense, navigate]);

  const handleSubmit = (data) => {
    try {
      updateExpense(id, data);
      toast.success("Expense updated successfully");
      navigate("/expenses");
    } catch (error) {
      toast.error("Failed to update expense. Please try again.");
      console.error("Error updating expense:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading expense details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Expense</h1>
        <p className="text-gray-500">Update expense details</p>
      </div>

      <Suspense
        fallback={<div className="p-8 text-center">Loading form...</div>}
      >
        {expense && (
          <ExpenseForm onSubmit={handleSubmit} existingExpense={expense} />
        )}
      </Suspense>
    </div>
  );
};

export default EditExpense;
