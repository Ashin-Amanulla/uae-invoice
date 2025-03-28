import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate a formatted filename for the exported PDF
 * @param {Object} invoice - The invoice data
 * @returns {string} - The formatted filename
 */
export const generatePdfFilename = (invoice) => {
    const invoiceNumber = invoice.invoiceNumber || 'unknown';
    const customerName = invoice.customer?.name || 'customer';
    const cleanCustomerName = customerName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const date = new Date().toISOString().split('T')[0];

    return `invoice-${invoiceNumber}-${cleanCustomerName}-${date}.pdf`;
};

/**
 * Export the invoice element to PDF
 * @param {HTMLElement} element - The element to export
 * @param {Object} invoice - The invoice data
 * @returns {Promise<Blob>} - The generated PDF as a Blob
 */
export const exportToPdf = async (element, invoice) => {
    if (!element) {
        throw new Error('No element provided for PDF export');
    }

    try {
        // Add PDF export class to the element for styling
        element.classList.add('pdf-export');

        // Create canvas from the HTML element
        const canvas = await html2canvas(element, {
            scale: 2, // Higher scale for better quality
            useCORS: true, // Enable CORS for loading images
            logging: false,
            backgroundColor: '#ffffff',
        });

        // Remove PDF export class
        element.classList.remove('pdf-export');

        // Get dimensions
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Create PDF in A4 format
        const pdf = new jsPDF('p', 'mm', 'a4');

        let position = 0;
        let heightLeft = imgHeight;

        // Add image to PDF (first page)
        pdf.addImage(
            canvas.toDataURL('image/png'),
            'PNG',
            0,
            position,
            imgWidth,
            imgHeight,
            undefined,
            'FAST'
        );
        heightLeft -= pageHeight;

        // Add new pages if content exceeds A4 height
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(
                canvas.toDataURL('image/png'),
                'PNG',
                0,
                position,
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
            );
            heightLeft -= pageHeight;
        }

        // Generate filename and save PDF
        const filename = generatePdfFilename(invoice);
        pdf.save(filename);

        // Return blob for potential further processing
        return pdf.output('blob');
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}; 