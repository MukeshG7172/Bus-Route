'use client';
import { useState, useEffect } from 'react';
import { Bus, User, Phone, UserCircle, Clock, MapPin, ChevronDown, ChevronUp, Users, Search } from 'lucide-react';

export default function BusRouteViewer() {
  const [routes, setRoutes] = useState([]);
  const [expandedRouteIds, setExpandedRouteIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [matchedStops, setMatchedStops] = useState(new Map());

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    filterRoutes();
  }, [searchQuery, routes]);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/routes');
      if (!response.ok) throw new Error('Failed to fetch routes');
      const data = await response.json();
      setRoutes(data);
      setFilteredRoutes(data);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to load routes. Please try again later.');
      setIsLoading(false);
    }
  };

  const filterRoutes = () => {
    const query = searchQuery.toLowerCase().trim();
    const newMatchedStops = new Map();
    const newExpandedRouteIds = new Set();

    if (!query) {
      setFilteredRoutes(routes);
      setMatchedStops(new Map());
      setExpandedRouteIds(new Set());
      return;
    }

    const filtered = routes.filter(route => {
      // Check route name
      const routeNameMatch = route.routeName.toLowerCase().includes(query);
      
      // Check stops and store matched stops
      const matchedStopIndices = [];
      route.stops.forEach((stop, index) => {
        if (stop.name.toLowerCase().includes(query)) {
          matchedStopIndices.push(index);
        }
      });

      if (matchedStopIndices.length > 0) {
        newMatchedStops.set(route.id, matchedStopIndices);
        newExpandedRouteIds.add(route.id);
      }

      return routeNameMatch || matchedStopIndices.length > 0;
    });

    setFilteredRoutes(filtered);
    setMatchedStops(newMatchedStops);
    setExpandedRouteIds(newExpandedRouteIds);
  };

  const toggleRouteExpansion = (routeId) => {
    const newExpandedRouteIds = new Set(expandedRouteIds);
    if (newExpandedRouteIds.has(routeId)) {
      newExpandedRouteIds.delete(routeId);
    } else {
      newExpandedRouteIds.add(routeId);
    }
    setExpandedRouteIds(newExpandedRouteIds);
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
      <header className="bg-yellow-400 py-3 px-6 shadow-lg relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img
            src="/logo1.png"
            alt="Left Logo"
            className="h-[70px] w-[100px] sm:hidden rounded-full object-contain"
          />
          <img
            src="/logo1.png"
            alt="Left Logo"
            className="hidden sm:block sm:h-[100px] sm:w-[200px] rounded-full object-contain"
          />

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black tracking-wider">
              BUS ROUTE
            </h1>
            <p className="text-black font-medium">Management System</p>
          </div>

          <img
            src="/logo.png"
            alt="Right Logo"
            className="h-[70px] w-[70px] sm:hidden rounded-full object-contain"
          />
          <img
            src="/logo.png"
            alt="Right Logo"
            className="hidden sm:block sm:h-[100px] sm:w-[100px] rounded-full object-contain"
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search routes or stops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-yellow-400/20 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-yellow-400/40 transition-colors"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-gray-400">
              Found {filteredRoutes.length} {filteredRoutes.length === 1 ? 'route' : 'routes'}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {filteredRoutes.map((route) => (
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
                      {expandedRouteIds.has(route.id) ?
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
                    </div>

                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="text-yellow-400 h-5 w-5" />
                        <span className="text-yellow-400 font-medium">Coordinators</span>
                      </div>
                      <div className="">
                        {route.coordinators?.map((coordinator, index) => (
                          <div key={coordinator.id} className="flex items-center gap-2 text-sm">
                            <UserCircle className="text-gray-400 h-4 w-4" />
                            <span className="text-gray-300">{coordinator.name}</span>
                            <span className="text-gray-400">-</span>
                            <span className="text-gray-300">{coordinator.contactNumber}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {expandedRouteIds.has(route.id) && (
                <div className="border-t border-yellow-400/10 p-4 bg-gray-800">
                  <h4 className="font-medium mb-4 text-yellow-400 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Route Stops ({route.stops.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {route.stops.map((stop, index) => {
                      const isMatched = matchedStops.get(route.id)?.includes(index);
                      return (
                        <div 
                          key={index} 
                          className={`flex justify-between items-center p-3 rounded-lg ${
                            isMatched 
                              ? 'bg-yellow-400/20 border border-yellow-400' 
                              : 'bg-gray-900'
                          }`}
                        >
                          <span className="font-medium text-gray-200">
                            {index + 1}. {stop.name}
                          </span>
                          <span className="flex items-center gap-2 text-yellow-400">
                            <Clock className="h-4 w-4" />
                            {stop.time}
                          </span>
                        </div>
                      );
                    })}
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