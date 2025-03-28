import { useState, useEffect } from "react";
import useTemplateStore from "../hooks/useTemplateStore";
import Button from "../ui/Button";

const TemplateSelector = ({ onClose }) => {
  const {
    templates,
    activeTemplateId,
    setActiveTemplate,
    getActiveTemplate,
    updateTemplateSettings,
    initializeTemplates,
    isLoading,
  } = useTemplateStore();

  const [selectedTemplateId, setSelectedTemplateId] =
    useState(activeTemplateId);
  const [customSettings, setCustomSettings] = useState({});

  // Initialize templates and load current template settings
  useEffect(() => {
    initializeTemplates();
  }, [initializeTemplates]);

  // Update selected template when activeTemplateId changes
  useEffect(() => {
    if (activeTemplateId && !selectedTemplateId) {
      setSelectedTemplateId(activeTemplateId);
    }
  }, [activeTemplateId, selectedTemplateId]);

  // Load template settings when selected template changes
  useEffect(() => {
    if (selectedTemplateId && templates.length > 0) {
      const template = templates.find((t) => t.id === selectedTemplateId);
      if (template?.settings) {
        setCustomSettings(template.settings);
      }
    }
  }, [selectedTemplateId, templates]);

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
  };

  const handleSettingChange = (setting, value) => {
    setCustomSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleColorChange = (color) => {
    setCustomSettings((prev) => ({
      ...prev,
      primaryColor: color,
    }));
  };

  const handleSave = () => {
    // Update template settings
    if (selectedTemplateId) {
      updateTemplateSettings(selectedTemplateId, customSettings);
      setActiveTemplate(selectedTemplateId);
    }

    if (onClose) onClose();
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading templates...</div>;
  }

  const activeTemplate = getActiveTemplate();

  return (
    <div className="p-4 space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium">Invoice Templates</h3>
        <p className="text-sm text-gray-500">
          Choose a template for your invoices
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedTemplateId === template.id
                ? "ring-2 ring-blue-500 shadow-md"
                : "hover:shadow-md"
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <div className="aspect-video bg-gray-100 relative">
              {template.previewImage ? (
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <span className="text-gray-500 text-sm">No preview</span>
                </div>
              )}
              {template.isDefault && (
                <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Default
                </span>
              )}
            </div>
            <div className="p-3">
              <h4 className="font-medium">{template.name}</h4>
              <p className="text-xs text-gray-500">{template.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplateId && (
        <div className="border rounded-lg p-4 mt-6">
          <h4 className="font-medium mb-4">Template Settings</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex space-x-2">
                {[
                  "#4F46E5", // Indigo
                  "#0EA5E9", // Sky
                  "#10B981", // Emerald
                  "#F59E0B", // Amber
                  "#EF4444", // Red
                  "#8B5CF6", // Violet
                  "#EC4899", // Pink
                  "#374151", // Gray
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full ${
                      customSettings.primaryColor === color
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                value={customSettings.fontFamily || "Inter, sans-serif"}
                onChange={(e) =>
                  handleSettingChange("fontFamily", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Poppins, sans-serif">Poppins</option>
                <option value="Montserrat, sans-serif">Montserrat</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Display Options
              </label>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showLogo"
                  checked={customSettings.showLogo || false}
                  onChange={(e) =>
                    handleSettingChange("showLogo", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="showLogo"
                  className="ml-2 text-sm text-gray-700"
                >
                  Show Company Logo
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showPaymentDetails"
                  checked={customSettings.showPaymentDetails || false}
                  onChange={(e) =>
                    handleSettingChange("showPaymentDetails", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="showPaymentDetails"
                  className="ml-2 text-sm text-gray-700"
                >
                  Show Payment Details
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showSignature"
                  checked={customSettings.showSignature || false}
                  onChange={(e) =>
                    handleSettingChange("showSignature", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="showSignature"
                  className="ml-2 text-sm text-gray-700"
                >
                  Show Signature Line
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Footer Text
              </label>
              <input
                type="text"
                value={customSettings.footerText || ""}
                onChange={(e) =>
                  handleSettingChange("footerText", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Thank you for your business"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Apply Template
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelector;
