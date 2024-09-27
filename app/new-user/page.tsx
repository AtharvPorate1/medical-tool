import { currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

const NewUserPage = async () => {
  const user = await currentUser(); // Fetch current user from Clerk

  if (!user) {
    // Redirect to sign-in page if not authenticated
    redirect('/auth/signin');
    return;
  }

  // Check if the doctor already exists in the database
  const existingUser = await prisma.doctor.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!existingUser) {
    // If the doctor doesn't exist, create a new one
    await prisma.doctor.create({
      data: {
        clerkId: user.id,
        name: user.fullName || 'Unnamed Doctor', // Set a default if no name is provided
        email: user.emailAddresses[0]?.emailAddress || '', // Ensure email is valid
      },
    });
  }

  // After creation (or if the user exists), redirect to home page or dashboard
  redirect('/home');
};

export default NewUserPage;
