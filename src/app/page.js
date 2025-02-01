// app/page.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import LoginButton from "@/components/LoginButton";
import BusManagement from "@/components/BusManagement";
import BusLog from "@/components/BusLog";

export default async function Home() {
  const session = await getServerSession(authOptions);
  let isAdmin = false;

  if (session?.user?.email) {
    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email },
    });
    isAdmin = !!admin;
  }

  return (
    <div className="min-h-screen">


      <main>
        {isAdmin ? (

          <BusManagement />
        ) : (
          <BusLog />
        )}
      </main>
    </div>
  );
}