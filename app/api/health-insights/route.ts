import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const gender = formData.get('gender') as string;
    const age = formData.get('age') as string;
    const conversation = formData.get('conversation') as string;
    const imageAnalysis = formData.get('imageAnalysis') as string | null;

    if (!name || !gender || !age || !conversation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userMessage = `Patient Information:
    Name: ${name}
    Gender: ${gender}
    Age: ${age}
    Conversation Summary: ${conversation}
    ${imageAnalysis ? `Image Analysis: ${imageAnalysis}` : ''}

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

    return NextResponse.json({
      probableDiseases,
      remedies,
      advice,
      imageAnalysis: imageAnalysis ? JSON.parse(imageAnalysis) : null,
    });
  } catch (error) {
    console.error('Error processing health insights request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
