import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useTemplateStore from "../hooks/useTemplateStore";
import TemplateSelector from "../components/TemplateSelector";
import Button from "../ui/Button";
import { toast } from "react-hot-toast";

const Templates = () => {
  const {
    templates,
    activeTemplateId,
    initializeTemplates,
    setActiveTemplate,
  } = useTemplateStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    initializeTemplates();
  }, [initializeTemplates]);

  const handleActivateTemplate = (id) => {
    const success = setActiveTemplate(id);
    if (success) {
      toast.success("Template activated successfully");
    } else {
      toast.error("Failed to activate template");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Invoice Templates</h1>
          <p className="text-gray-500">Manage your invoice templates</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Customize Templates
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => {
          const isActive = template.id === activeTemplateId;

          return (
            <div
              key={template.id}
              className={`bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow transition-all ${
                isActive ? "ring-2 ring-blue-500" : ""
              }`}
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

                {isActive && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Active
                  </div>
                )}

                {template.isDefault && (
                  <div className="absolute top-2 left-2 bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                    Default
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-medium text-lg">{template.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {template.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor:
                          template.settings?.primaryColor || "#4F46E5",
                      }}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {template.settings?.fontFamily?.split(",")[0] ||
                        "Default font"}
                    </span>
                  </div>

                  <div>
                    {!isActive ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleActivateTemplate(template.id)}
                      >
                        Set as Active
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Customize
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h2 className="text-lg font-medium mb-4">Template Preview</h2>
        <p className="text-sm text-gray-500 mb-6">
          The selected template will be used when creating new invoices and for
          PDF exports. Click on 'Customize Templates' to modify the appearance
          of your templates.
        </p>

        <div className="flex gap-4">
          <Link to="/invoices/new">
            <Button variant="primary">Create Invoice with Template</Button>
          </Link>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            Customize Active Template
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <TemplateSelector onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
