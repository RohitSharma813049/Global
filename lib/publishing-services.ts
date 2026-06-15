/**
 * Mock publishing services for Global Scholar Publications
 * Handles DOI generation, Plagiarism scans, and Certificate generation
 */

// 1. Mock DOI Generator (Stage 6)
export const assignDOI = async (publicationId: string): Promise<string> => {
    // Simulate network delay to Crossref API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const prefix = "10.5555"; // Example mock prefix
    const suffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}/gsp.${publicationId.substring(0, 8)}.${suffix}`;
};

// 2. Mock Plagiarism Checker (Stage 4)
export interface PlagiarismReport {
    score: number; // 0 to 100
    status: 'Pass' | 'Fail' | 'Needs Review';
    matchesFound: number;
}

export const scanForPlagiarism = async (contentOrFileUrl: string): Promise<PlagiarismReport> => {
    // Simulate deep scan delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock logic: randomly generate a score
    // In reality, this would call Turnitin, Copyscape, or a custom NLP model
    const score = Math.floor(Math.random() * 25); // Typically expect 0-25% for good papers
    
    let status: 'Pass' | 'Fail' | 'Needs Review' = 'Pass';
    if (score > 30) status = 'Fail';
    else if (score > 15) status = 'Needs Review';

    return {
        score,
        status,
        matchesFound: Math.floor(score / 2), // Mock matches
    };
};

// 3. Mock PDF Certificate Generator (Stage 6)
export const generateCertificatePDFUrl = async (scholarName: string, title: string, doi: string): Promise<string> => {
    // Simulate PDF generation delay (e.g. jspdf, pdf-lib, or a serverless function)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock URL where the certificate is "stored"
    const mockFilename = `certificate_${scholarName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    return `https://storage.globalscholar.com/certificates/${mockFilename}`;
};
