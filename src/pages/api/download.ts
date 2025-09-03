import type { APIRoute } from 'astro';

// Mock document generation function
function generateContestationDocument(formData: any): string {
  return `
LETTRE DE CONTESTATION D'AMENDE

Nom: ${formData.name}
Adresse: ${formData.address}
Email: ${formData.email}
Immatriculation: ${formData.immatriculation}

Date: ${new Date().toLocaleDateString('fr-FR')}

Objet: Contestation de l'amende

Madame, Monsieur,

Par la présente, je conteste l'amende qui m'a été notifiée concernant le véhicule immatriculé ${formData.immatriculation}.

Motifs de contestation:
- Analyse automatique par IA des éléments fournis
- Vérification des procédures légales
- Examen des documents justificatifs

Veuillez trouver ci-joint les documents justificatifs nécessaires à l'examen de ma contestation.

Dans l'attente d'une suite favorable, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${formData.name}

---
Document généré automatiquement par notre service de contestation d'amende.
Pour toute question: contact@contestation-amende.fr
  `;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { formData, sessionId } = body;

    if (!formData || !formData.name || !formData.email) {
      return new Response(JSON.stringify({ 
        error: 'Données du formulaire invalides' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate document content
    const documentContent = generateContestationDocument(formData);
    
    // Convert to base64 for download
    const base64Content = Buffer.from(documentContent, 'utf-8').toString('base64');
    
    return new Response(JSON.stringify({
      success: true,
      document: base64Content,
      filename: `contestation_${formData.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.txt`,
      contentType: 'text/plain'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating document:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la génération du document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  const sessionId = url.searchParams.get('session');
  
  if (!sessionId) {
    return new Response('Session ID requis', { status: 400 });
  }

  // In a real app, you'd retrieve the document from storage using the session ID
  // For now, return a simple success message
  return new Response(JSON.stringify({
    message: 'Document prêt au téléchargement',
    sessionId
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};