import OpenAI from 'openai';
import FormData from 'form-data';
import fetch from 'node-fetch'; // Assuming Node.js environment for image upload

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface HealthAssessmentResponse {
  probableDiseases: { disease: string; chance: number }[];
  remedies: string;
  advice: string;
  imageInsights?: string; // Added to store insights from the image
}

// Helper function for text-based health assessment
export const getHealthAssessment = async (name: string, gender: string, age: number, conversation: string): Promise<HealthAssessmentResponse> => {
  const userMessage = `Patient Information:
  Name: ${name}
  Gender: ${gender}
  Age: ${age}
  Conversation Summary: ${conversation}

  Based on the above information, please provide:
  1. A list of 5-6 probable chronic diseases with their chances as an array of objects, where each object has two keys: "disease" (name of the disease) and "chance" (chance percentage as a number).
  2. Remedies and recommendations that might help the patient with chronic or non-chronic diseases.
  3. Any other relevant health advice.

  Format the response as a valid JSON object with the following keys:
  - "probableDiseases" (array of objects with "disease" and "chance"),
  - "remedies" (string),
  - "advice" (string).`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant providing health risk assessments." },
        { role: "user", content: userMessage },
      ],
    });

    const responseContent = completion.choices?.[0]?.message?.content;
    if (!responseContent) throw new Error('No response from OpenAI');

    const parsedResponse = JSON.parse(responseContent);

    const { probableDiseases = [], remedies = '', advice = '' } = parsedResponse;
    if (!Array.isArray(probableDiseases)) throw new Error('Invalid structure for probableDiseases');

    return { probableDiseases, remedies, advice };
  } catch (error) {
    console.error('Error in OpenAI request:', error);
    throw error;
  }
};

// Helper function for image-based health analysis (e.g., skin lesion or X-ray)
export const analyzeImage = async (imageFile: Buffer): Promise<HealthAssessmentResponse> => {
  const form = new FormData();
  form.append('image', imageFile, {
    filename: 'image.png',
    contentType: 'image/png',
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a medical assistant analyzing images for health assessments." },
        { role: "user", content: `Please analyze the uploaded image and provide the following insights:
          1. What does the image depict?
          2. Any visible health concerns or potential diseases related to the visual content.
          3. Recommendations for further action or observation based on the image.
          
          Format the response as a JSON object with keys:
          - "imageDescription" (string): a description of what the image shows.
          - "healthConcerns" (array of objects): each object should contain "concern" (description of the concern) and "severity" (low, medium, high).
          - "recommendations" (string): suggested next steps based on the analysis.`
        },
      ],
    });

    const responseContent = completion.choices?.[0]?.message?.content;
    if (!responseContent) throw new Error('No response from OpenAI');

    // Parse the JSON response from OpenAI
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }

    return parsedResponse;

  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};
