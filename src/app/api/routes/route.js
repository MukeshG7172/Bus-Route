
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'

// GET handler - No changes needed as it will automatically include the new fields
export async function GET() {
  try {
    

    const routes = await prisma.busRoute.findMany({
      include: {
        stops: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    return NextResponse.json(routes);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

// POST handler - Updated to include routeName and description
export async function POST(request) {
  try {

    const body = await request.json();
    const { routeName, description, busNumber, driverName, contactNumber, coordinatorName, stops } = body;

    // Validate required fields
    if (!routeName || !busNumber || !contactNumber || !coordinatorName || !stops) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const route = await prisma.busRoute.create({
      data: {
        routeName,
        description,
        busNumber,
        driverName,
        contactNumber,
        coordinatorName,
        stops: {
          create: stops.map(stop => ({
            name: stop.name,
            time: stop.time,
            order: stop.order
          }))
        }
      },
      include: {
        stops: true
      }
    });

    return NextResponse.json(route);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create route', details: error.message },
      { status: 500 }
    );
  }
}
