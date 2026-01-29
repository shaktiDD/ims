const pdf = require('pdf-parse');
const mammoth = require('mammoth');

exports.extractTextFromPdf = async (buffer) => {
    try {
        // v1.1.1 usage: pdf(buffer) returns a promise resolving to data object
        if (typeof pdf !== 'function') {
            console.error("Critical Error: pdf-parse is not a function:", typeof pdf);
            // In v1.1.1 it MUST be a function. If not, installation is broken.
            if (pdf && typeof pdf === 'object') {
                console.error("Keys:", Object.keys(pdf));
            }
            throw new Error("Internal Server Error: PDF parser library misconfigured");
        }

        // Basic validation of buffer
        if (!buffer || buffer.length === 0) {
            throw new Error("Empty PDF buffer provided");
        }
        console.log(`Processing PDF buffer of size: ${buffer.length} bytes`);

        const data = await pdf(buffer);
        console.log("PDF parsed successfully, text length:", data.text ? data.text.length : 0);
        return data.text;
    } catch (error) {
        console.error("Detailed PDF Error:", error);
        // Add specific advice for "Invalid PDF structure" logic if needed, 
        // but essentially we just propagate it.
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
};

exports.extractTextFromDocx = async (buffer) => {
    try {
        const result = await mammoth.extractRawText({ buffer: buffer });
        return result.value;
    } catch (error) {
        console.error("Error extracting text from DOCX:", error);
        throw new Error("Failed to extract text from DOCX");
    }
};
