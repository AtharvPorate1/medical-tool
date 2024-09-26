import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { clerkId: userId },
    });

    if (!doctor) {
      return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
    }

    const { name, gender, age, conversation, imageAnalysis, probableDiseases, remedies, advice } = await req.json();

    // Parse the age to ensure it's an integer
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge)) {
      return NextResponse.json({ message: 'Invalid age value' }, { status: 400 });
    }

    // Create or update patient
    const patient = await prisma.patient.upsert({
      where: {
        doctorId_name: {
          doctorId: doctor.id,
          name: name,
        },
      },
      update: { gender, age: parsedAge }, // Use parsed age here
      create: {
        name,
        gender,
        age: parsedAge, // Use parsed age here
        doctorId: doctor.id,
      },
    });

    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        patientId: patient.id,
        conversation,
        imageAnalysis: imageAnalysis
          ? (typeof imageAnalysis === 'object' ? imageAnalysis : Prisma.JsonNull)
          : Prisma.JsonNull, // Handling the null or undefined case
        probableDiseases: JSON.stringify(probableDiseases),
        remedies,
        advice,
      },
    });

    return NextResponse.json({ message: 'Assessment saved successfully', assessment }, { status: 201 });
  } catch (error) {
    console.error('Error saving assessment:', error);
    return NextResponse.json({ message: 'An error occurred while saving the assessment' }, { status: 500 });
  }
}
