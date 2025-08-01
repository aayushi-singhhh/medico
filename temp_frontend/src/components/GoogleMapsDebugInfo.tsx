import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const GoogleMapsDebugInfo = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  const checkStatus = (value: string | undefined, placeholder: string) => {
    if (!value) return { status: 'missing', color: 'destructive' as const, icon: XCircle };
    if (value === placeholder) return { status: 'placeholder', color: 'secondary' as const, icon: AlertCircle };
    return { status: 'configured', color: 'default' as const, icon: CheckCircle };
  };

  const apiKeyStatus = checkStatus(apiKey, 'your_google_maps_api_key_here');
  const apiUrlStatus = checkStatus(apiBaseUrl, '');

  return (
    <div className="container mx-auto px-6 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🗺️ Google Maps Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {/* API Key Status */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Google Maps API Key</p>
                <p className="text-sm text-gray-600">VITE_GOOGLE_MAPS_API_KEY</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={apiKeyStatus.color}>
                  <apiKeyStatus.icon className="w-3 h-3 mr-1" />
                  {apiKeyStatus.status}
                </Badge>
              </div>
            </div>

            {/* API Base URL Status */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Backend API URL</p>
                <p className="text-sm text-gray-600">VITE_API_BASE_URL</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={apiUrlStatus.color}>
                  <apiUrlStatus.icon className="w-3 h-3 mr-1" />
                  {apiUrlStatus.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="space-y-3 mt-6">
            {apiKeyStatus.status === 'placeholder' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Google Maps:</strong> Currently using mock data. Replace the placeholder API key with a real one to enable Google Places API integration.
                </p>
              </div>
            )}
            
            {apiKeyStatus.status === 'missing' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Google Maps:</strong> No API key found. Add VITE_GOOGLE_MAPS_API_KEY to your environment variables.
                </p>
              </div>
            )}

            {apiKeyStatus.status === 'configured' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Google Maps:</strong> API key configured! Real Google Places API integration is active.
                </p>
              </div>
            )}

            {apiUrlStatus.status === 'configured' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Backend API:</strong> Connected to {apiBaseUrl}
                </p>
              </div>
            )}
          </div>

          {/* Environment Details */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Environment:</strong> {import.meta.env.MODE || 'development'}<br />
              <strong>API Key (first 10 chars):</strong> {apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'}<br />
              <strong>Backend URL:</strong> {apiBaseUrl || 'Not set'}
            </p>
          </div>

          {/* Next Steps */}
          <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Get a Google Maps API key from <a href="https://console.cloud.google.com/" target="_blank" className="underline">Google Cloud Console</a></li>
              <li>2. Enable Places API, Maps JavaScript API, and Geolocation API</li>
              <li>3. Update your .env.development file with the real API key</li>
              <li>4. Refresh this page to see the changes</li>
              <li>5. Test the "Nearby Services" functionality</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleMapsDebugInfo;
