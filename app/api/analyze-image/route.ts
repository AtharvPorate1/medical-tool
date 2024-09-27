import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeImage(base64Image: string, mimeType: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this medical image and provide a structured JSON object containing the following information: modality, organ, analysis, abnormalities (if any), and treatment (if abnormalities are present). Please ensure the response is valid JSON without any additional formatting." },
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content;

    // Strip out any code formatting or additional characters
    const jsonResponse = content?.replace(/```/g, '').trim();

    // Try to parse the content as JSON
    try {
      return jsonResponse ? JSON.parse(jsonResponse) : null;
    } catch (jsonError) {
      console.error('Response is not valid JSON:', jsonResponse);
      console.error('Response is not valid JSON:', jsonError);
      return jsonResponse;  // Return raw content if JSON parsing fails
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    return null;
  }
}



export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    const buffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    const analysis = await analyzeImage(base64Image, imageFile.type);

    if (!analysis) {
      return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error processing image analysis request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
