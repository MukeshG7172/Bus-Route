import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma'

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { routeName, description, busNumber, driverName, contactNumber, coordinatorName, stops } = body;

    // Validate required fields
    if (!routeName || !busNumber || !contactNumber || !coordinatorName || !stops) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get existing stops
    const existingStops = await prisma.stop.findMany({
      where: { busRouteId: id }
    });

    // Create a map of existing stops by their id
    const existingStopsMap = new Map(
      existingStops.map(stop => [stop.id, stop])
    );

    // Separate stops into updates and creates
    const stopsToUpdate = stops.filter(stop => stop.id);
    const stopsToCreate = stops.filter(stop => !stop.id);

    // Delete stops that are no longer in the updated list
    const updatedStopIds = new Set(stopsToUpdate.map(stop => stop.id));
    const stopsToDelete = existingStops
      .filter(stop => !updatedStopIds.has(stop.id))
      .map(stop => stop.id);

    // Update route with new data using transaction
    const updatedRoute = await prisma.$transaction(async (tx) => {
      // Delete removed stops
      if (stopsToDelete.length > 0) {
        await tx.stop.deleteMany({
          where: { id: { in: stopsToDelete } }
        });
      }

      // Update existing stops
      for (const stop of stopsToUpdate) {
        await tx.stop.update({
          where: { id: stop.id },
          data: {
            name: stop.name,
            time: stop.time,
            order: stop.order
          }
        });
      }

      // Create new stops
      if (stopsToCreate.length > 0) {
        await tx.stop.createMany({
          data: stopsToCreate.map(stop => ({
            name: stop.name,
            time: stop.time,
            order: stop.order,
            busRouteId: id
          }))
        });
      }

      // Update route with new fields
      return await tx.busRoute.update({
        where: { id },
        data: {
          routeName,
          description,
          busNumber,
          driverName,
          contactNumber,
          coordinatorName,
        },
        include: {
          stops: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      });
    });

    return NextResponse.json(updatedRoute);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update route', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    await prisma.busRoute.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete route', details: error.message },
      { status: 500 }
    );
  }
}