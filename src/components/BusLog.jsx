'use client';
import { useState, useEffect } from 'react';
import { Bus, User, Phone, UserCircle, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export default function BusRouteViewer() {
  const [routes, setRoutes] = useState([]);
  const [expandedRouteId, setExpandedRouteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/routes');
      if (!response.ok) throw new Error('Failed to fetch routes');
      const data = await response.json();
      setRoutes(data);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to load routes. Please try again later.');
      setIsLoading(false);
    }
  };

  const toggleRouteExpansion = (routeId) => {
    setExpandedRouteId(expandedRouteId === routeId ? null : routeId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <header className="bg-yellow-400 py-3 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img src="/logo1.png" alt="Left Logo" className="h-24 w-24 rounded-full" />
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-black tracking-wider">
              BUS ROUTES
            </h1>
            <p className="text-black font-medium">View Schedule</p>
          </div>
          <img src="/logo.png" alt="Right Logo" className="h-24 w-24 rounded-full" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="space-y-4">
          {routes.map((route) => (
            <div key={route.id} 
                 className="bg-gray-900 rounded-lg overflow-hidden border border-yellow-400/20 hover:border-yellow-400/40 transition-colors">
              <div
                className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleRouteExpansion(route.id)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-3 w-full">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-white flex-grow">{route.routeName}</h3>
                      {expandedRouteId === route.id ? 
                        <ChevronUp className="text-yellow-400 h-5 w-5" /> : 
                        <ChevronDown className="text-yellow-400 h-5 w-5" />
                      }
                    </div>
                    
                    {route.description && (
                      <p className="text-gray-400">{route.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <Bus className="text-yellow-400 h-5 w-5" />
                        <span className="text-gray-300">Bus {route.busNumber}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="text-yellow-400 h-5 w-5" />
                        <span className="text-gray-300">{route.driverName || 'Driver Not Assigned'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="text-yellow-400 h-5 w-5" />
                        <span className="text-gray-300">{route.contactNumber}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <UserCircle className="text-yellow-400 h-5 w-5" />
                        <span className="text-gray-300">{route.coordinatorName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {expandedRouteId === route.id && (
                <div className="border-t border-yellow-400/10 p-4 bg-gray-800">
                  <h4 className="font-medium mb-4 text-yellow-400 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Route Stops ({route.stops.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {route.stops.map((stop, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-900 p-3 rounded-lg">
                        <span className="font-medium text-gray-200">
                          {index + 1}. {stop.name}
                        </span>
                        <span className="flex items-center gap-2 text-yellow-400">
                          <Clock className="h-4 w-4" />
                          {stop.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}