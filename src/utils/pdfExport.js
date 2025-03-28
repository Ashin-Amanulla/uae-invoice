import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports an invoice as a PDF file
 * @param {React.RefObject} invoiceRef - React ref to the invoice DOM element
 * @param {string} fileName - Name of the file to be downloaded
 * @returns {Promise<void>}
 */
export const exportToPdf = async (invoiceRef, fileName = 'invoice.pdf') => {
    if (!invoiceRef.current) {
        throw new Error('No invoice element found to export');
    }

    try {
        // Temporarily add a class to handle printing styles
        invoiceRef.current.classList.add('pdf-export');

        // Create a new jsPDF instance (A4 format by default)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        // Calculate the optimal scaling factor
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Render the invoice to canvas
        const canvas = await html2canvas(invoiceRef.current, {
            scale: 2, // Higher scale for better quality
            useCORS: true, // To handle images from different origins
            logging: false,
            allowTaint: true,
        });

        // Calculate the optimal scaling
        const imgWidth = pageWidth - 20; // 10mm margins on each side
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Handle multi-page content if the invoice is too long
        let position = 10; // Starting position from top
        const imgData = canvas.toDataURL('image/png');

        // Add the first page
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);

        // Add more pages if needed
        let heightLeft = imgHeight;
        while (heightLeft >= pageHeight - 20) { // 10mm margins top and bottom
            position = heightLeft - pageHeight + 20;
            heightLeft -= pageHeight - 20;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, -position, imgWidth, imgHeight);
        }

        // Save the PDF
        pdf.save(fileName);

        // Remove the temporary class
        invoiceRef.current.classList.remove('pdf-export');

        return true;
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        throw error;
    }
};

/**
 * Generates a filename for the invoice PDF
 * @param {Object} invoice - The invoice object
 * @returns {string} Formatted filename
 */
export const generatePdfFilename = (invoice) => {
    if (!invoice) return 'invoice.pdf';

    const invoiceNumber = invoice.number || '';
    const clientName = invoice.client?.name
        ? invoice.client.name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')
        : 'client';

    const date = new Date().toISOString().split('T')[0];

    return `Invoice_${invoiceNumber}_${clientName}_${date}.pdf`;
}; 