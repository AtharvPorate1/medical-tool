// app/api/health-assessment/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, gender, age, conversation } = body;

    // Validate input data
    if (!name || !gender || !age || !conversation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Construct the prompt for OpenAI
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

    // Make the API call to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant providing health risk assessments." },
        { role: "user", content: userMessage },
      ],
    });

    // Get the content from the response
    const responseContent = completion.choices?.[0]?.message?.content;

    if (!responseContent) {
      return NextResponse.json({ error: 'No response from OpenAI' }, { status: 500 });
    }

    // Parse the JSON response from OpenAI
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return NextResponse.json({ error: 'Invalid JSON response from OpenAI' }, { status: 500 });
    }

    // Ensure the response contains the required structure
    const { probableDiseases = [], remedies = '', advice = '' } = parsedResponse;

    if (!Array.isArray(probableDiseases)) {
      return NextResponse.json({ error: 'Invalid structure for probableDiseases' }, { status: 500 });
    }

    // Respond with the parsed data
    return NextResponse.json({
      probableDiseases,
      remedies,
      advice,
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
