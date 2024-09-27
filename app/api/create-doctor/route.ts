import { NextResponse } from 'next/server';

import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db';

export async function POST() {
  const user = await currentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if the doctor already exists
  const existingDoctor = await prisma.doctor.findUnique({
    where: {
      clerkId: user.id as string,
    },
  });

  if (existingDoctor) {
    return NextResponse.json({ error: 'Doctor already exists' }, { status: 409 });
  }

  // Create new doctor
  const newDoctor = await prisma.doctor.create({
    data: {
      clerkId: user.id,
      name: user.fullName || 'Unnamed', // Fallback if fullName is not available
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return NextResponse.json(newDoctor, { status: 201 });
}
