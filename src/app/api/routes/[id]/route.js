import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma'

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { routeName, description, busNumber, driverName, coordinators, stops } = body;

    // Validate required fields
    if (!routeName || !busNumber || !coordinators || !stops) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get existing stops and coordinators
    const existingStops = await prisma.stop.findMany({
      where: { busRouteId: id }
    });

    const existingCoordinators = await prisma.coordinator.findMany({
      where: { busRouteId: id }
    });

    // Create maps of existing items by their id
    const existingStopsMap = new Map(
      existingStops.map(stop => [stop.id, stop])
    );

    const existingCoordinatorsMap = new Map(
      existingCoordinators.map(coordinator => [coordinator.id, coordinator])
    );

    // Separate items into updates and creates
    const stopsToUpdate = stops.filter(stop => stop.id);
    const stopsToCreate = stops.filter(stop => !stop.id);

    const coordinatorsToUpdate = coordinators.filter(coord => coord.id);
    const coordinatorsToCreate = coordinators.filter(coord => !coord.id);

    // Get IDs of items to delete
    const updatedStopIds = new Set(stopsToUpdate.map(stop => stop.id));
    const stopsToDelete = existingStops
      .filter(stop => !updatedStopIds.has(stop.id))
      .map(stop => stop.id);

    const updatedCoordinatorIds = new Set(coordinatorsToUpdate.map(coord => coord.id));
    const coordinatorsToDelete = existingCoordinators
      .filter(coord => !updatedCoordinatorIds.has(coord.id))
      .map(coord => coord.id);

    // Update route with new data using transaction
    const updatedRoute = await prisma.$transaction(async (tx) => {
      // Delete removed items
      if (stopsToDelete.length > 0) {
        await tx.stop.deleteMany({
          where: { id: { in: stopsToDelete } }
        });
      }

      if (coordinatorsToDelete.length > 0) {
        await tx.coordinator.deleteMany({
          where: { id: { in: coordinatorsToDelete } }
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

      // Update existing coordinators
      for (const coordinator of coordinatorsToUpdate) {
        await tx.coordinator.update({
          where: { id: coordinator.id },
          data: {
            name: coordinator.name,
            contactNumber: coordinator.contactNumber
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

      // Create new coordinators
      if (coordinatorsToCreate.length > 0) {
        await tx.coordinator.createMany({
          data: coordinatorsToCreate.map(coordinator => ({
            name: coordinator.name,
            contactNumber: coordinator.contactNumber,
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
        },
        include: {
          stops: {
            orderBy: {
              order: 'asc'
            }
          },
          coordinators: true
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

// DELETE handler remains the same
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