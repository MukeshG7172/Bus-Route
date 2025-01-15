-- CreateTable
CREATE TABLE "BusRoute" (
    "id" TEXT NOT NULL,
    "busNumber" TEXT NOT NULL,
    "driverName" TEXT,
    "contactNumber" TEXT NOT NULL,
    "coordinatorName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "busRouteId" TEXT NOT NULL,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stop" ADD CONSTRAINT "Stop_busRouteId_fkey" FOREIGN KEY ("busRouteId") REFERENCES "BusRoute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
