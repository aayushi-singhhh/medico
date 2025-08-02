import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Star, Navigation, Hospital, Pill, TestTube, Stethoscope } from "lucide-react";
import { Loader } from '@googlemaps/js-api-loader';

interface ImportMetaEnv {
  VITE_GOOGLE_MAPS_API_KEY?: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  formatted_phone_number?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  business_status?: string;
}

const NearbyServices = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('hospital');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('general');
  const [error, setError] = useState<string>('');

  const serviceTypes = [
    { id: 'hospital', name: 'Hospitals', icon: Hospital, query: 'hospital' },
    { id: 'pharmacy', name: 'Pharmacies', icon: Pill, query: 'pharmacy' },
    { id: 'laboratory', name: 'Labs', icon: TestTube, query: 'medical laboratory' },
    { id: 'doctor', name: 'Doctors', icon: Stethoscope, query: 'doctor' }
  ];

  const doctorSpecialties = [
    { id: 'general', name: 'General Practitioner', query: 'general practitioner' },
    { id: 'cardiologist', name: 'Cardiologist', query: 'cardiologist' },
    { id: 'dermatologist', name: 'Dermatologist', query: 'dermatologist' },
    { id: 'pediatrician', name: 'Pediatrician', query: 'pediatrician' },
    { id: 'orthopedic', name: 'Orthopedic', query: 'orthopedic surgeon' },
    { id: 'neurologist', name: 'Neurologist', query: 'neurologist' },
    { id: 'gynecologist', name: 'Gynecologist', query: 'gynecologist' },
    { id: 'psychiatrist', name: 'Psychiatrist', query: 'psychiatrist' },
    { id: 'ophthalmologist', name: 'Ophthalmologist', query: 'ophthalmologist' },
    { id: 'dentist', name: 'Dentist', query: 'dentist' }
  ];

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        const specialty = selectedService === 'doctor' ? selectedSpecialty : undefined;
        findNearbyPlaces(location, selectedService, specialty);
      },
      (error) => {
        setError('Error getting your location. Please enable location services.');
        setLoading(false);
        console.error('Geolocation error:', error);
      }
    );
  };

  // Find nearby places using Google Places API
  const findNearbyPlaces = async (location: { lat: number; lng: number }, serviceType: string, specialty?: string) => {
    // Check if Google Maps API key is available
    const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key not found.');
    }
    // Real Google Maps API implementation
    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places']
    });

    try {
      const google = await loader.load();
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      
      let searchQuery = '';
      if (serviceType === 'doctor') {
        const selectedSpec = doctorSpecialties.find(s => s.id === specialty) || doctorSpecialties[0];
        searchQuery = selectedSpec.query;
      } else {
        searchQuery = serviceType === 'hospital' ? 'hospital' : 
                     serviceType === 'pharmacy' ? 'pharmacy' : 
                     'medical laboratory';
      }

      const request = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: 5000, // 5km radius
        query: searchQuery
      };

      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const places = results.slice(0, 6).map(place => ({
            place_id: place.place_id || '',
            name: place.name || '',
            vicinity: place.vicinity || place.formatted_address || '',
            rating: place.rating,
            geometry: {
              location: {
                lat: place.geometry?.location?.lat() || 0,
                lng: place.geometry?.location?.lng() || 0
              }
            },
            types: place.types || [],
            business_status: place.business_status
          }));
          setPlaces(places);
        } else {
          setError('No places found nearby. Please try a different location or service type.');
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      setError('Failed to load Google Maps. Please try again.');
      setLoading(false);
    }
  };

  const handleServiceChange = (serviceType: string) => {
    setSelectedService(serviceType);
    // Reset specialty to general when changing service type
    if (serviceType === 'doctor') {
      setSelectedSpecialty('general');
    }
    if (userLocation) {
      setLoading(true);
      const specialty = serviceType === 'doctor' ? 'general' : undefined;
      findNearbyPlaces(userLocation, serviceType, specialty);
    }
  };

  const openInMaps = (place: Place) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Nearby Medical Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover hospitals, pharmacies, labs, and clinics in your area with just one click
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Service Type Selection */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {serviceTypes.map((service) => {
              const IconComponent = service.icon;
              return (
                <Button
                  key={service.id}
                  variant={selectedService === service.id ? "default" : "outline"}
                  onClick={() => handleServiceChange(service.id)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {service.name}
                </Button>
              );
            })}
          </div>

          {/* Doctor Specialty Selection - Only show when 'doctor' is selected */}
          {selectedService === 'doctor' && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
                Select Specialty
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {doctorSpecialties.map((specialty) => (
                  <Button
                    key={specialty.id}
                    variant={selectedSpecialty === specialty.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedSpecialty(specialty.id);
                      if (userLocation) {
                        setLoading(true);
                        findNearbyPlaces(userLocation, selectedService, specialty.id);
                      }
                    }}
                    className="text-xs"
                  >
                    {specialty.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Find Services Button */}
          <div className="text-center mb-8">
            <Button
              onClick={getCurrentLocation}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full"
            >
              <Navigation className="mr-2 w-4 h-4" />
              {loading ? 'Finding Services...' : 'Find Nearby Services'}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center mb-8">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            </div>
          )}

          {/* Results */}
          {places.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <Card key={place.place_id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{place.name}</CardTitle>
                      {place.rating && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {place.rating}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{place.vicinity}</span>
                    </div>
                    
                    {place.formatted_phone_number && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <a 
                          href={`tel:${place.formatted_phone_number}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {place.formatted_phone_number}
                        </a>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openInMaps(place)}
                        className="flex-1"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        View on Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Note about implementation */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {(import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ? 
                'Using Google Places API for real-time results. Doctors can be filtered by specialty for precise search results.' :
                'Note: Add VITE_GOOGLE_MAPS_API_KEY to your .env file for real Google Places API integration.'
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NearbyServices;
