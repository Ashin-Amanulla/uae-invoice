import { create } from "zustand";

const DEFAULT_TEMPLATES = [
    {
        id: "classic",
        name: "Classic",
        description: "Simple and professional invoice design",
        previewImage: "/templates/classic.png",
        isDefault: true,
        settings: {
            primaryColor: "#4F46E5",
            fontFamily: "Inter, sans-serif",
            showLogo: true,
            showPaymentDetails: true,
            showSignature: false,
            footerText: "Thank you for your business",
        },
    },
    {
        id: "modern",
        name: "Modern",
        description: "Sleek, minimal design with accent color",
        previewImage: "/templates/modern.png",
        isDefault: false,
        settings: {
            primaryColor: "#0EA5E9",
            fontFamily: "Poppins, sans-serif",
            showLogo: true,
            showPaymentDetails: true,
            showSignature: true,
            footerText: "Payment due within 30 days",
        },
    },
    {
        id: "professional",
        name: "Professional",
        description: "Corporate style with detailed sections",
        previewImage: "/templates/professional.png",
        isDefault: false,
        settings: {
            primaryColor: "#374151",
            fontFamily: "Roboto, sans-serif",
            showLogo: true,
            showPaymentDetails: true,
            showSignature: true,
            footerText: "Terms & Conditions Apply",
        },
    },
];

const saveToLocalStorage = (templates, activeTemplateId) => {
    localStorage.setItem("invoiceTemplates", JSON.stringify(templates));
    localStorage.setItem("activeTemplateId", activeTemplateId);
};

const useTemplateStore = create((set, get) => ({
    templates: [],
    activeTemplateId: null,
    isLoading: true,

    // Initialize store from localStorage or defaults
    initializeTemplates: () => {
        const stored = localStorage.getItem("invoiceTemplates");
        const storedActiveId = localStorage.getItem("activeTemplateId");

        let templates = [];
        let activeId = null;

        if (stored) {
            templates = JSON.parse(stored);
        } else {
            templates = DEFAULT_TEMPLATES;
        }

        if (storedActiveId) {
            activeId = storedActiveId;
        } else {
            // Find default template
            const defaultTemplate = templates.find(t => t.isDefault);
            activeId = defaultTemplate ? defaultTemplate.id : templates[0]?.id;
        }

        set({
            templates,
            activeTemplateId: activeId,
            isLoading: false
        });
    },

    // Get all templates
    getTemplates: () => get().templates,

    // Get active template
    getActiveTemplate: () => {
        const { templates, activeTemplateId } = get();
        return templates.find(t => t.id === activeTemplateId) || templates[0];
    },

    // Set active template
    setActiveTemplate: (templateId) => {
        const { templates } = get();

        if (templates.some(t => t.id === templateId)) {
            set({ activeTemplateId: templateId });
            saveToLocalStorage(templates, templateId);
            return true;
        }

        return false;
    },

    // Create custom template
    createTemplate: (templateData) => {
        const { templates } = get();

        // Generate unique ID
        const id = `custom-${Date.now()}`;

        const newTemplate = {
            id,
            isDefault: false,
            ...templateData,
        };

        const updatedTemplates = [...templates, newTemplate];

        set({
            templates: updatedTemplates,
            activeTemplateId: id
        });

        saveToLocalStorage(updatedTemplates, id);
        return id;
    },

    // Update template
    updateTemplate: (templateId, updates) => {
        const { templates } = get();
        const index = templates.findIndex(t => t.id === templateId);

        if (index !== -1) {
            const updatedTemplates = [...templates];
            updatedTemplates[index] = {
                ...updatedTemplates[index],
                ...updates
            };

            set({ templates: updatedTemplates });
            saveToLocalStorage(updatedTemplates, get().activeTemplateId);
            return true;
        }

        return false;
    },

    // Delete custom template
    deleteTemplate: (templateId) => {
        const { templates, activeTemplateId } = get();

        // Prevent deleting default templates
        const targetTemplate = templates.find(t => t.id === templateId);
        if (!targetTemplate || targetTemplate.id.indexOf('custom-') !== 0) {
            return false;
        }

        const updatedTemplates = templates.filter(t => t.id !== templateId);

        // If active template is deleted, set active to default
        let newActiveId = activeTemplateId;
        if (activeTemplateId === templateId) {
            const defaultTemplate = templates.find(t => t.isDefault);
            newActiveId = defaultTemplate ? defaultTemplate.id : updatedTemplates[0]?.id;
        }

        set({
            templates: updatedTemplates,
            activeTemplateId: newActiveId
        });

        saveToLocalStorage(updatedTemplates, newActiveId);
        return true;
    },

    // Update template settings
    updateTemplateSettings: (templateId, settingsUpdates) => {
        const { templates } = get();
        const index = templates.findIndex(t => t.id === templateId);

        if (index !== -1) {
            const updatedTemplates = [...templates];
            updatedTemplates[index] = {
                ...updatedTemplates[index],
                settings: {
                    ...updatedTemplates[index].settings,
                    ...settingsUpdates
                }
            };

            set({ templates: updatedTemplates });
            saveToLocalStorage(updatedTemplates, get().activeTemplateId);
            return true;
        }

        return false;
    }
}));

export default useTemplateStore; 