'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function BusRouteManagement() {
    const [routes, setRoutes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingRoutes, setIsFetchingRoutes] = useState(true);
    const [expandedRouteId, setExpandedRouteId] = useState(null);
    const [currentRoute, setCurrentRoute] = useState({
        routeName: '',
        description: '',
        busNumber: '',
        driverName: '',
        coordinators: [{ name: '', contactNumber: '' }],
        stops: [{ name: '', time: '', order: 0 }]
    });

    useEffect(() => {
        fetchRoutes();
    }, []);

    const toggleRouteExpansion = (routeId) => {
        setExpandedRouteId(expandedRouteId === routeId ? null : routeId);
    };


    const removeCoordinator = (index) => {
        if (currentRoute.coordinators.length <= 1) {
            toast.error('Route must have at least one coordinator');
            return;
        }
        const newCoordinators = currentRoute.coordinators.filter((_, i) => i !== index);
        setCurrentRoute(prev => ({ ...prev, coordinators: newCoordinators }));
    };

    const handleCoordinatorChange = (index, field, value) => {
        const newCoordinators = [...currentRoute.coordinators];
        newCoordinators[index] = {
            ...newCoordinators[index],
            [field]: value
        };
        setCurrentRoute(prev => ({ ...prev, coordinators: newCoordinators }));
    };

    const addCoordinator = () => {
        setCurrentRoute(prev => ({
            ...prev,
            coordinators: [
                ...prev.coordinators,
                { name: '', contactNumber: '' }
            ]
        }));
    };

    const handleCancel = () => {
        resetForm();
        setIsEditing(false);
    };

    const fetchRoutes = async () => {
        setIsFetchingRoutes(true);
        try {
            const response = await fetch('/api/routes');
            if (!response.ok) throw new Error('Failed to fetch routes');
            const data = await response.json();
            const routesWithCoordinators = data.map(route => ({
                ...route,
                coordinators: route.coordinators || []
            }));
            setRoutes(routesWithCoordinators);
        } catch (error) {
            toast.error('Failed to load routes');
            console.error('Fetch error:', error);
        } finally {
            setIsFetchingRoutes(false);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentRoute(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStopChange = (index, field, value) => {
        const newStops = [...currentRoute.stops];
        newStops[index] = {
            ...newStops[index],
            [field]: value,
            order: index
        };
        setCurrentRoute(prev => ({ ...prev, stops: newStops }));
    };

    const addStop = () => {
        setCurrentRoute(prev => ({
            ...prev,
            stops: [
                ...prev.stops,
                { name: '', time: '', order: prev.stops.length }
            ]
        }));
    };


    const removeStop = (index) => {
        if (currentRoute.stops.length <= 1) {
            toast.error('Route must have at least one stop');
            return;
        }
        const newStops = currentRoute.stops.filter((_, i) => i !== index);
        setCurrentRoute(prev => ({ ...prev, stops: newStops }));
    };

    const validateForm = () => {
        if (!currentRoute.routeName.trim()) {
            toast.error('Route name is required');
            return false;
        }
        if (!currentRoute.busNumber.trim()) {
            toast.error('Bus number is required');
            return false;
        }

        for (const coordinator of currentRoute.coordinators) {
            if (!coordinator.name.trim() || !coordinator.contactNumber.trim()) {
                toast.error('All coordinators must have a name and contact number');
                return false;
            }
        }

        for (const stop of currentRoute.stops) {
            if (!stop.name.trim() || !stop.time) {
                toast.error('All stops must have a name and time');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const url = isEditing ? `/api/routes/${currentRoute.id}` : '/api/routes';
            const method = isEditing ? 'PUT' : 'POST';

            const routeData = {
                routeName: currentRoute.routeName,
                description: currentRoute.description,
                busNumber: currentRoute.busNumber,
                driverName: currentRoute.driverName,
                stops: currentRoute.stops.map(stop => ({
                    name: stop.name,
                    time: stop.time,
                    order: stop.order,
                    ...(stop.id ? { id: stop.id } : {})
                })),
                coordinators: currentRoute.coordinators.map(coord => ({
                    name: coord.name,
                    contactNumber: coord.contactNumber,
                    ...(coord.id ? { id: coord.id } : {})
                }))
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(routeData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to save route');
            }

            const data = await response.json();
            toast.success(isEditing ? 'Route updated successfully' : 'Route created successfully');
            resetForm();
            fetchRoutes();
        } catch (error) {
            toast.error(error.message);
            console.error('Submit error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
        </div>
    );

    const LoadingOverlay = () => (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
        </div>
    );


    const resetForm = () => {
        setCurrentRoute({
            routeName: '',
            description: '',
            busNumber: '',
            driverName: '',
            coordinators: [{ name: '', contactNumber: '' }],
            stops: [{ name: '', time: '', order: 0 }]
        });
        setIsEditing(false);
    };

    const handleEdit = (route) => {
        const coordinators = route.coordinators?.length > 0
            ? route.coordinators
            : [{ name: '', contactNumber: '' }];

        setCurrentRoute({
            ...route,
            coordinators: coordinators,
            stops: route.stops
                .sort((a, b) => a.order - b.order)
                .map(stop => ({
                    ...stop,
                    order: stop.order
                }))
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this route?')) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/routes/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete route');

            toast.success('Route deleted successfully');
            fetchRoutes();
        } catch (error) {
            toast.error('Failed to delete route');
            console.error('Delete error:', error);
        } finally {
            setIsLoading(false);
        }
    };


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
                <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg shadow-xl p-6 mb-8 border border-yellow-400/20 relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg backdrop-blur-sm z-50">
                            <div className="bg-gray-900 p-4 rounded-lg shadow-xl flex items-center space-x-3">
                                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-yellow-400" />
                                <span className="text-sm sm:text-base text-yellow-400 font-medium">Processing...</span>
                            </div>
                        </div>
                    )}

                    <h2 className="text-2xl font-bold mb-6 text-yellow-400 border-b border-yellow-400/20 pb-2">
                        {isEditing ? 'Edit Route Details' : 'Add New Route'}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-yellow-400">Bus Number</label>
                            <input
                                type="text"
                                name="busNumber"
                                value={currentRoute.busNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-yellow-400">Driver Name</label>
                            <input
                                type="text"
                                name="driverName"
                                placeholder='Optional'
                                value={currentRoute.driverName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-yellow-400">Coordinators</h2>
                                <button
                                    type="button"
                                    onClick={addCoordinator}
                                    className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                                >
                                    Add Coordinator
                                </button>
                            </div>

                            <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
                                {currentRoute.coordinators.map((coordinator, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input
                                            type="text"
                                            value={coordinator.name}
                                            onChange={(e) => handleCoordinatorChange(index, 'name', e.target.value)}
                                            placeholder="Coordinator Name"
                                            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                                            required
                                        />
                                        <input
                                            type="tel"
                                            value={coordinator.contactNumber}
                                            onChange={(e) => handleCoordinatorChange(index, 'contactNumber', e.target.value)}
                                            placeholder="Contact Number"
                                            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeCoordinator(index)}
                                            className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-yellow-400">Route Name</label>
                            <input
                                type="text"
                                name="routeName"
                                value={currentRoute.routeName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-yellow-400">Description (Optional)</label>
                            <textarea
                                name="description"
                                value={currentRoute.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white resize-none"
                                placeholder="Enter route description..."
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-yellow-400">Route Stops</h2>
                            <button
                                type="button"
                                onClick={addStop}
                                className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                            >
                                Add Stop
                            </button>
                        </div>

                        <div className="space-y-4 bg-gray-800 p-4 rounded-lg">
                            {currentRoute.stops.map((stop, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        value={stop.name}
                                        onChange={(e) => handleStopChange(index, 'name', e.target.value)}
                                        placeholder="Stop Name"
                                        className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                                        required
                                    />
                                    <input
                                        type="time"
                                        value={stop.time}
                                        onChange={(e) => handleStopChange(index, 'time', e.target.value)}
                                        className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeStop(index)}
                                        className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                        >
                            {isEditing ? 'Update Route' : 'Create Route'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-6 text-yellow-400 border-b border-yellow-400/20 pb-2">Active Routes</h2>
                    {isFetchingRoutes ? (
                        <div className="flex items-center justify-center p-8 bg-gray-900 rounded-lg border border-yellow-400/20">
                            <div className="flex items-center space-x-3">
                                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-yellow-400" />
                                <span className="text-sm sm:text-base text-yellow-400 font-medium">Loading routes...</span>
                            </div>
                        </div>
                    ) : routes.length === 0 ? (
                        <div className="text-center py-8 bg-gray-900 rounded-lg border border-yellow-400/20">
                            <p className="text-gray-400">No routes found. Create your first route above.</p>
                        </div>
                    ) : (
                        routes.map((route) => (
                            <div key={route.id} className="bg-gray-900 rounded-lg overflow-hidden border border-yellow-400/20 hover:border-yellow-400/40 transition-colors">
                                <div
                                    className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                                    onClick={() => toggleRouteExpansion(route.id)}
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-white mb-2">{route.routeName}</h3>
                                            {route.description && (
                                                <p className="text-gray-400 mb-3">{route.description}</p>
                                            )}
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-yellow-400 text-black rounded-full text-sm font-medium">
                                                    Bus {route.busNumber}
                                                </span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-gray-400">{route.stops.length} stops</span>
                                            </div>
                                            <p className="text-gray-300">Driver: {route.driverName || 'Not assigned'}</p>
                                            {route.coordinators?.length > 0 && (
                                                <div className="text-gray-300">
                                                    <p className="font-medium mb-1">Coordinators:</p>
                                                    {route.coordinators.map((coord, index) => (
                                                        <p key={coord.id} className="ml-2 text-sm">
                                                            {coord.name} - {coord.contactNumber}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 ml-auto">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(route);
                                                }}
                                                className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(route.id);
                                                }}
                                                className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {expandedRouteId === route.id && (
                                    <div className="border-t border-yellow-400/10 p-4 bg-gray-800">
                                        <div className="mb-4">
                                            <h4 className="font-medium mb-3 text-yellow-400">Coordinators:</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {route.coordinators?.map((coordinator) => (
                                                    <div key={coordinator.id} className="flex justify-between bg-gray-900 p-3 rounded-lg">
                                                        <span className="font-medium text-gray-200">{coordinator.name}</span>
                                                        <span className="text-yellow-400">{coordinator.contactNumber}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <h4 className="font-medium mb-3 text-yellow-400">Route Stops:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {route.stops.map((stop) => (
                                                <div key={stop.id} className="flex justify-between bg-gray-900 p-3 rounded-lg">
                                                    <span className="font-medium text-gray-200">{stop.name}</span>
                                                    <span className="text-yellow-400">{stop.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )))}
                </div>
            </div>
        </div>
    );
}