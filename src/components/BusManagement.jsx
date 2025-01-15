'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function BusRouteManagement() {
    const [routes, setRoutes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedRouteId, setExpandedRouteId] = useState(null);
    const [currentRoute, setCurrentRoute] = useState({
        routeName: '',
        description: '',
        busNumber: '',
        driverName: '',
        contactNumber: '',
        coordinatorName: '',
        stops: [{ name: '', time: '', order: 0 }]
    });

    useEffect(() => {
        fetchRoutes();
    }, []);

    const toggleRouteExpansion = (routeId) => {
        setExpandedRouteId(expandedRouteId === routeId ? null : routeId);
    };

    const handleCancel = () => {
        resetForm();
        setIsEditing(false);
    };

    const fetchRoutes = async () => {
        try {
            const response = await fetch('/api/routes');
            if (!response.ok) throw new Error('Failed to fetch routes');
            const data = await response.json();
            setRoutes(data);
        } catch (error) {
            toast.error('Failed to load routes');
            console.error('Fetch error:', error);
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
        if (!currentRoute.contactNumber.trim()) {
            toast.error('Contact number is required');
            return false;
        }
        if (!currentRoute.coordinatorName.trim()) {
            toast.error('Coordinator name is required');
            return false;
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

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentRoute),
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

    const resetForm = () => {
        setCurrentRoute({
            routeName: '',
            description: '',
            busNumber: '',
            driverName: '',
            contactNumber: '',
            coordinatorName: '',
            stops: [{ name: '', time: '', order: 0 }]
        });
        setIsEditing(false);
    };

    const handleEdit = (route) => {
        setCurrentRoute({
            ...route,
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
                    <img src="/logo1.png" alt="Left Logo" className="h-[100px] w-[100px] rounded-full " />
                    <div className="text-center">
                        <h1 className="text-3xl md:text-5xl font-bold text-black tracking-wider">
                            BUS ROUTE
                        </h1>
                        <p className="text-black font-medium">Management System</p>
                    </div>
                    <img src="/logo.png" alt="Right Logo" className="h-[100px] w-[100px] rounded-full " />
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg shadow-xl p-6 mb-8 border border-yellow-400/20">
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
                        <div>
                            <label className="block text-sm font-medium mb-1 text-yellow-400">Contact Number</label>
                            <input
                                type="tel"
                                name="contactNumber"
                                value={currentRoute.contactNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-yellow-400">Coordinator Name</label>
                            <input
                                type="text"
                                name="coordinatorName"
                                value={currentRoute.coordinatorName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                                required
                            />
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
                    {routes.map((route) => (
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
                                        <p className="text-gray-300">Contact: {route.contactNumber}</p>
                                        <p className="text-gray-300">Coordinator: {route.coordinatorName}</p>
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
                                    <h4 className="font-medium mb-3 text-yellow-400">Route Stops:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {route.stops.map((stop, index) => (
                                            <div key={stop.id} className="flex justify-between bg-gray-900 p-3 rounded-lg">
                                                <span className="font-medium text-gray-200">{index + 1}. {stop.name}</span>
                                                <span className="text-yellow-400">{stop.time}</span>
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