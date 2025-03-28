import { create } from 'zustand';

const useExpenseStore = create((set, get) => ({
    expenses: [],
    isLoading: false,
    error: null,

    // Initialize store from localStorage
    initializeStore: () => {
        const savedExpenses = localStorage.getItem('expenses');
        if (savedExpenses) {
            set({ expenses: JSON.parse(savedExpenses) });
        }
    },

    // Helper to save to localStorage
    saveToLocalStorage: () => {
        localStorage.setItem('expenses', JSON.stringify(get().expenses));
    },

    // Create a new expense
    createExpense: (expenseData) => {
        const newExpense = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...expenseData,
        };

        set((state) => {
            const updatedExpenses = [...state.expenses, newExpense];
            localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
            return { expenses: updatedExpenses };
        });

        return newExpense;
    },

    // Get all expenses
    getExpenses: () => {
        set({ isLoading: true, error: null });
        try {
            const savedExpenses = localStorage.getItem('expenses');
            set({
                expenses: savedExpenses ? JSON.parse(savedExpenses) : [],
                isLoading: false
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Get a single expense by ID
    getExpense: (id) => {
        set({ isLoading: true, error: null });
        try {
            const expense = get().expenses.find(exp => exp.id === id);
            set({ isLoading: false });
            return expense;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return null;
        }
    },

    // Update an expense
    updateExpense: (id, updatedData) => {
        set((state) => {
            const updatedExpenses = state.expenses.map(exp =>
                exp.id === id ? { ...exp, ...updatedData } : exp
            );
            localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
            return { expenses: updatedExpenses };
        });
    },

    // Delete an expense
    deleteExpense: (id) => {
        set((state) => {
            const updatedExpenses = state.expenses.filter(exp => exp.id !== id);
            localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
            return { expenses: updatedExpenses };
        });
    },

    // Filter expenses by category
    filterExpensesByCategory: (category) => {
        const { expenses } = get();
        if (!category || category === 'all') return expenses;
        return expenses.filter(expense => expense.category === category);
    },

    // Filter expenses by date range
    filterExpensesByDateRange: (startDate, endDate) => {
        const { expenses } = get();
        if (!startDate && !endDate) return expenses;

        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            if (startDate && endDate) {
                return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
            } else if (startDate) {
                return expenseDate >= new Date(startDate);
            } else if (endDate) {
                return expenseDate <= new Date(endDate);
            }
            return true;
        });
    },

    // Calculate total expenses
    calculateTotal: (expenses = null) => {
        const expensesToCalculate = expenses || get().expenses;
        return expensesToCalculate.reduce((total, expense) => total + parseFloat(expense.amount), 0);
    },

    // Get expense categories
    getCategories: () => {
        const { expenses } = get();
        const categories = new Set(expenses.map(expense => expense.category));
        return Array.from(categories);
    }
}));

export default useExpenseStore; 