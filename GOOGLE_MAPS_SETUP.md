# Google Maps API Integration Guide

## Setup Instructions for Real Google Maps API Integration

### 1. Get Google Maps API Key

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Places API
   - Maps JavaScript API
   - Geolocation API

4. Create credentials (API Key)
5. Restrict the API key to your domains

### 2. Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. Install Required Dependencies

```bash
npm install @googlemaps/js-api-loader
```

### 4. Update NearbyServices Component

Replace the mock implementation in `src/components/NearbyServices.tsx` with:

```typescript
import { Loader } from '@googlemaps/js-api-loader';

// Add this function to find real nearby places
const findNearbyPlaces = async (location: { lat: number; lng: number }, serviceType: string) => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    libraries: ['places']
  });

  try {
    const google = await loader.load();
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    
    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 5000, // 5km radius
      type: serviceType === 'hospital' ? 'hospital' : 
            serviceType === 'pharmacy' ? 'pharmacy' : 
            serviceType === 'laboratory' ? 'hospital' : 'clinic'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const places = results.slice(0, 6).map(place => ({
          place_id: place.place_id || '',
          name: place.name || '',
          vicinity: place.vicinity || '',
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
      }
      setLoading(false);
    });
  } catch (error) {
    console.error('Error loading Google Maps:', error);
    setError('Failed to load Google Maps. Please try again.');
    setLoading(false);
  }
};
```

### 5. Security Considerations

- Never expose your API key in client-side code for production
- Use environment variables and proper domain restrictions
- Consider implementing a backend proxy for API calls
- Set up billing alerts in Google Cloud Console

### 6. Rate Limiting

- Google Places API has usage limits
- Implement caching to reduce API calls
- Consider using session tokens for better pricing

### 7. Testing

- Test with different location permissions
- Handle cases where location access is denied
- Test with different device types and browsers

## Current Implementation

The current implementation uses mock data for demonstration purposes. To see the real Google Maps integration, follow the steps above and replace the mock `findNearbyPlaces` function.
