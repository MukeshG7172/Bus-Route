
import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma'

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
    // Log the full error
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
    const { routeName, description, busNumber, driverName, contactNumber, coordinatorName, stops } = body;

    
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
