import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const routes = await prisma.busRoute.findMany({
      include: {
        stops: {
          orderBy: {
            order: 'asc'
          }
        },
        coordinators: true
      }
    });
    return NextResponse.json(routes);
  } catch (error) {
    console.error('Detailed GET error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { routeName, description, busNumber, driverName, coordinators, stops } = body;

    // Validate required fields
    if (!routeName || !busNumber || !coordinators || !stops) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the route with related data in a single transaction
    const route = await prisma.busRoute.create({
      data: {
        routeName,
        description,
        busNumber,
        driverName,
        stops: {
          create: stops.map(stop => ({
            name: stop.name,
            time: stop.time,
            order: stop.order
          }))
        },
        coordinators: {
          create: coordinators.map(coordinator => ({
            name: coordinator.name,
            contactNumber: coordinator.contactNumber
          }))
        }
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

    return NextResponse.json(route);
  } catch (error) {
    console.error('POST error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    return NextResponse.json(
      { error: 'Failed to create route', details: error.message },
      { status: 500 }
    );
  }
}