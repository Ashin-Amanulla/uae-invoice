import { createContext, useContext, useState, useEffect } from "react";

const CompanyContext = createContext();

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
  const [companyDetails, setCompanyDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load company details from localStorage on initial render
    const savedCompanyDetails = localStorage.getItem("companyDetails");
    if (savedCompanyDetails) {
      setCompanyDetails(JSON.parse(savedCompanyDetails));
    } else {
      // Set default empty company details
      setCompanyDetails({
        name: "",
        logo: null,
        address: "",
        phone: "",
        email: "",
        website: "",
        taxId: "",
        bankDetails: {
          accountName: "",
          accountNumber: "",
          bankName: "",
          swiftCode: "",
          iban: "",
        },
        signature: null,
      });
    }
    setIsLoading(false);
  }, []);

  const updateCompanyDetails = (newDetails) => {
    const updatedDetails = { ...companyDetails, ...newDetails };
    setCompanyDetails(updatedDetails);
    localStorage.setItem("companyDetails", JSON.stringify(updatedDetails));
    return updatedDetails;
  };

  const updateBankDetails = (newBankDetails) => {
    const updatedDetails = {
      ...companyDetails,
      bankDetails: {
        ...companyDetails.bankDetails,
        ...newBankDetails,
      },
    };
    setCompanyDetails(updatedDetails);
    localStorage.setItem("companyDetails", JSON.stringify(updatedDetails));
    return updatedDetails;
  };

  const clearCompanyDetails = () => {
    const emptyDetails = {
      name: "",
      logo: null,
      address: "",
      phone: "",
      email: "",
      website: "",
      taxId: "",
      bankDetails: {
        accountName: "",
        accountNumber: "",
        bankName: "",
        swiftCode: "",
        iban: "",
      },
      signature: null,
    };
    setCompanyDetails(emptyDetails);
    localStorage.setItem("companyDetails", JSON.stringify(emptyDetails));
  };

  const value = {
    companyDetails,
    isLoading,
    updateCompanyDetails,
    updateBankDetails,
    clearCompanyDetails,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

export default CompanyContext;
