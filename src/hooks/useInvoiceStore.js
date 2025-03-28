import { create } from 'zustand';

// UAE VAT rate is 5%
const VAT_RATE = 0.05;

const useInvoiceStore = create((set, get) => ({
    invoices: [],
    currentInvoice: null,
    isLoading: false,
    error: null,

    // For demo, we'll use local storage to persist invoices
    // In a real app, these would be API calls
    initializeStore: () => {
        const savedInvoices = localStorage.getItem('invoices');
        if (savedInvoices) {
            set({ invoices: JSON.parse(savedInvoices) });
        }
    },

    saveToLocalStorage: () => {
        localStorage.setItem('invoices', JSON.stringify(get().invoices));
    },

    // Create a new invoice
    createInvoice: (invoiceData) => {
        const newInvoice = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            number: `INV-${Date.now().toString().slice(-6)}`,
            status: 'draft',
            ...invoiceData,
        };

        set((state) => {
            const updatedInvoices = [...state.invoices, newInvoice];
            localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
            return { invoices: updatedInvoices, currentInvoice: newInvoice };
        });

        return newInvoice;
    },

    // Get all invoices
    getInvoices: () => {
        set({ isLoading: true, error: null });
        try {
            const savedInvoices = localStorage.getItem('invoices');
            set({
                invoices: savedInvoices ? JSON.parse(savedInvoices) : [],
                isLoading: false
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Get a single invoice by ID
    getInvoice: (id) => {
        set({ isLoading: true, error: null });
        try {
            const invoice = get().invoices.find(inv => inv.id === id);
            set({ currentInvoice: invoice, isLoading: false });
            return invoice;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return null;
        }
    },

    // Update an invoice
    updateInvoice: (id, updatedData) => {
        set((state) => {
            const updatedInvoices = state.invoices.map(inv =>
                inv.id === id ? { ...inv, ...updatedData } : inv
            );
            localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
            return {
                invoices: updatedInvoices,
                currentInvoice: updatedInvoices.find(inv => inv.id === id)
            };
        });
    },

    // Delete an invoice
    deleteInvoice: (id) => {
        set((state) => {
            const updatedInvoices = state.invoices.filter(inv => inv.id !== id);
            localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
            return {
                invoices: updatedInvoices,
                currentInvoice: null
            };
        });
    },

    // Calculate totals for an invoice
    calculateTotals: (items) => {
        const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        const vatAmount = subtotal * VAT_RATE;
        const total = subtotal + vatAmount;

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            vatAmount: parseFloat(vatAmount.toFixed(2)),
            vatRate: VAT_RATE * 100,
            total: parseFloat(total.toFixed(2))
        };
    }
}));

export default useInvoiceStore; 