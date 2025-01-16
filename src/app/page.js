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
      <header className="bg-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-yellow-400">
            {isAdmin ? "Bus Route Management" : "Bus Log"}
          </h1>
          <LoginButton session={session} className="bg-black text-yellow-400 py-2 px-4 rounded-md hover:bg-yellow-500 hover:text-black transition-colors" />
        </div>
      </header>


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