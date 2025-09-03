const { promises: fs } = require('fs');
const path = require('path');

// Mock PDF generation (in production, you'd use a library like jsPDF or Puppeteer)
function generateContestationPDF(formData) {
  const content = `
LETTRE DE CONTESTATION D'AMENDE

Nom: ${formData.name}
Adresse: ${formData.address}
Email: ${formData.email}
Immatriculation: ${formData.immatriculation}

Objet: Contestation de l'amende

Madame, Monsieur,

Par la présente, je conteste l'amende qui m'a été notifiée pour les raisons suivantes:

[Motifs de contestation générés par IA]

Veuillez trouver ci-joint les documents justificatifs.

Cordialement,
${formData.name}

---
Document généré automatiquement par notre service de contestation d'amende.
  `;
  
  return content;
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { formData, paymentStatus } = JSON.parse(event.body);

    // Verify payment status (in production, you'd verify with Stripe)
    if (paymentStatus !== 'completed') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Payment not completed' }),
      };
    }

    // Generate the PDF content
    const pdfContent = generateContestationPDF(formData);
    
    // In production, you would:
    // 1. Generate an actual PDF using a library
    // 2. Upload it to Netlify Blobs or another storage service
    // 3. Return a download URL
    
    // For now, return the content as text
    const base64Content = Buffer.from(pdfContent).toString('base64');
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="contestation.pdf"',
      },
      body: base64Content,
      isBase64Encoded: true,
    };

  } catch (error) {
    console.error('Error generating document:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
    };
  }
};