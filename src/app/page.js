import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import BusRouteManagement from "@/components/BusManagement";
import BusLog from "@/components/BusLog";
import ViewToggle from "@/components/ViewToggle";
import LoginButton from "@/components/LoginButton";

const prisma = new PrismaClient();

export default async function Home() {
  const session = await getServerSession(authOptions);
  let isAdmin = false;

  // Set a default view as "buslog" if no searchParams are used
  const currentView = "buslog";

  if (session?.user?.email) {
    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email },
    });
    isAdmin = !!admin;
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {isAdmin && <ViewToggle currentView={currentView} />}
          <LoginButton session={session} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin && currentView === "management" ? (
          <BusRouteManagement />
        ) : (
          <BusLog />
        )}
      </main>
    </div>
  );
}
