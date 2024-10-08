import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeImage(imageUrl: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this medical image and provide the following information: modality, organ, analysis, abnormalities (if any), and treatment (if abnormalities are present). Format the response as a JSON object." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('Error analyzing image:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const gender = formData.get('gender') as string;
    const age = formData.get('age') as string;
    const conversation = formData.get('conversation') as string;
    const imageFile = formData.get('image') as File | null;

    if (!name || !gender || !age || !conversation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imageAnalysis = '';
    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const imageUrl = `data:${imageFile.type};base64,${base64}`;
      const analysis = await analyzeImage(imageUrl);
      if (analysis) {
        imageAnalysis = `Image Analysis: ${JSON.stringify(analysis)}. `;
      }
    }

    const userMessage = `Patient Information:
    Name: ${name}
    Gender: ${gender}
    Age: ${age}
    Conversation Summary: ${conversation}
    ${imageAnalysis}

    Based on the above information, please provide:
    1. A list of 5-6 probable chronic diseases with their chances as an array of objects, where each object has two keys: "disease" (name of the disease) and "chance" (chance percentage as a number).
    2. Remedies and recommendations that might help the patient with chronic or non-chronic diseases.
    3. Any other relevant health advice.

    Format the response as a valid JSON object with the following keys:
    - "probableDiseases" (array of objects with "disease" and "chance"),
    - "remedies" (string),
    - "advice" (string).`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant providing health risk assessments." },
        { role: "user", content: userMessage },
      ],
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 });
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return NextResponse.json({ error: 'Invalid JSON response from OpenAI' }, { status: 500 });
    }

    const { probableDiseases = [], remedies = '', advice = '' } = parsedResponse;

    if (!Array.isArray(probableDiseases)) {
      return NextResponse.json({ error: 'Invalid structure for probableDiseases' }, { status: 500 });
    }

    return NextResponse.json({
      probableDiseases,
      remedies,
      advice,
      imageAnalysis: imageAnalysis ? JSON.parse(imageAnalysis.replace('Image Analysis: ', '')) : null,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}