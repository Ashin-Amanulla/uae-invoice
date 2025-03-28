import { useState, useEffect, useRef } from "react";
import { useCompany } from "../context/CompanyContext";
import Button from "../ui/Button";
import { toast } from "react-hot-toast";

const CompanySettings = () => {
  const { companyDetails, updateCompanyDetails, updateBankDetails, isLoading } =
    useCompany();
  const [activeTab, setActiveTab] = useState("general");
  const [logoPreview, setLogoPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);

  const logoInputRef = useRef(null);
  const signatureInputRef = useRef(null);

  useEffect(() => {
    if (companyDetails?.logo) {
      setLogoPreview(companyDetails.logo);
    }
    if (companyDetails?.signature) {
      setSignaturePreview(companyDetails.signature);
    }
  }, [companyDetails]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleGeneralSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const updatedDetails = {
      name: formData.get("name"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      website: formData.get("website"),
      taxId: formData.get("taxId"),
    };

    updateCompanyDetails(updatedDetails);
    toast.success("Company details updated successfully");
  };

  const handleBankDetailsSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const bankDetails = {
      accountName: formData.get("accountName"),
      accountNumber: formData.get("accountNumber"),
      bankName: formData.get("bankName"),
      swiftCode: formData.get("swiftCode"),
      iban: formData.get("iban"),
    };

    updateBankDetails(bankDetails);
    toast.success("Bank details updated successfully");
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        updateCompanyDetails({ logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
        updateCompanyDetails({ signature: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    updateCompanyDetails({ logo: null });
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleRemoveSignature = () => {
    setSignaturePreview(null);
    updateCompanyDetails({ signature: null });
    if (signatureInputRef.current) {
      signatureInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading company details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Company Settings</h1>
        <p className="text-gray-500">
          Manage your company details and branding
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex -mb-px">
          <button
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === "general"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => handleTabChange("general")}
          >
            General Information
          </button>
          <button
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === "branding"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => handleTabChange("branding")}
          >
            Logo & Signature
          </button>
          <button
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === "bank"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => handleTabChange("bank")}
          >
            Bank Details
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        {activeTab === "general" && (
          <form onSubmit={handleGeneralSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={companyDetails?.name || ""}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax ID / TRN
                </label>
                <input
                  type="text"
                  name="taxId"
                  defaultValue={companyDetails?.taxId || ""}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={companyDetails?.email || ""}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={companyDetails?.phone || ""}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  defaultValue={companyDetails?.website || ""}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  defaultValue={companyDetails?.address || ""}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                Save General Information
              </Button>
            </div>
          </form>
        )}

        {activeTab === "branding" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Company Logo</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Company Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="mt-1 text-sm text-gray-500">
                          No logo uploaded
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="ml-5 space-y-2">
                    <label className="block">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => logoInputRef.current?.click()}
                      >
                        Upload Logo
                      </Button>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>

                    {logoPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveLogo}
                      >
                        Remove Logo
                      </Button>
                    )}
                    <p className="text-xs text-gray-500">
                      Recommended size: 500x500 pixels (PNG, JPG, GIF)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Digital Signature</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-40 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-white">
                    {signaturePreview ? (
                      <img
                        src={signaturePreview}
                        alt="Signature"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <p className="text-sm text-gray-500">
                          No signature uploaded
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="ml-5 space-y-2">
                    <label className="block">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => signatureInputRef.current?.click()}
                      >
                        Upload Signature
                      </Button>
                      <input
                        ref={signatureInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleSignatureChange}
                        className="hidden"
                      />
                    </label>

                    {signaturePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveSignature}
                      >
                        Remove Signature
                      </Button>
                    )}
                    <p className="text-xs text-gray-500">
                      Recommended: Dark signature on transparent background
                      (PNG)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bank" && (
          <form onSubmit={handleBankDetailsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  defaultValue={companyDetails?.bankDetails?.accountName || ""}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  defaultValue={companyDetails?.bankDetails?.bankName || ""}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  defaultValue={
                    companyDetails?.bankDetails?.accountNumber || ""
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SWIFT/BIC Code
                </label>
                <input
                  type="text"
                  name="swiftCode"
                  defaultValue={companyDetails?.bankDetails?.swiftCode || ""}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IBAN
                </label>
                <input
                  type="text"
                  name="iban"
                  defaultValue={companyDetails?.bankDetails?.iban || ""}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                Save Bank Details
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CompanySettings;
