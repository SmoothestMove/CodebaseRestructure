/// <reference lib="dom" />

import { LocationData } from '../types/marvin';

interface GeolocationResult {
  success: boolean;
  location?: LocationData;
  error?: string;
}

class LocationService {
  private cachedLocation: LocationData | null = null;
  private locationExpiryTime = 10 * 60 * 1000; // 10 minutes

  /**
   * Get user's current location using browser geolocation API
   * Caches location for 10 minutes to avoid repeated requests
   */
  async getCurrentLocation(): Promise<GeolocationResult> {
    // Check if we have a cached location that's still valid
    if (this.cachedLocation && this.cachedLocation.timestamp) {
      const now = Date.now();
      const locationAge = now - this.cachedLocation.timestamp;
      
      if (locationAge < this.locationExpiryTime) {
        console.log('Using cached location data');
        return { success: true, location: this.cachedLocation };
      }
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      return { 
        success: false, 
        error: 'Geolocation is not supported by this browser' 
      };
    }

    return new Promise((resolve) => {
      const options: PositionOptions = {
        enableHighAccuracy: false, // Use network location for faster response
        timeout: 10000, // 10 second timeout
        maximumAge: 5 * 60 * 1000 // Accept cached position up to 5 minutes old
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude, accuracy } = position.coords;
            
            console.log('Geolocation obtained:', { latitude, longitude, accuracy });
            
            // Try to get city/state from reverse geocoding
            const locationData: LocationData = {
              latitude,
              longitude,
              accuracy,
              timestamp: Date.now()
            };

            // Attempt to get city/state using reverse geocoding
            try {
              const reverseGeoData = await this.reverseGeocode(latitude, longitude);
              if (reverseGeoData) {
                locationData.city = reverseGeoData.city;
                locationData.state = reverseGeoData.state;
                locationData.country = reverseGeoData.country;
              }
            } catch (error) {
              console.warn('Reverse geocoding failed:', error);
              // Continue without city/state data
            }

            // Cache the location
            this.cachedLocation = locationData;
            
            resolve({ success: true, location: locationData });
          } catch (error) {
            console.error('Error processing geolocation:', error);
            resolve({ 
              success: false, 
              error: 'Failed to process location data' 
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          resolve({ success: false, error: errorMessage });
        },
        options
      );
    });
  }

  /**
   * Simple reverse geocoding using a free service
   * Falls back gracefully if service is unavailable
   */
  private async reverseGeocode(lat: number, lon: number): Promise<{
    city?: string;
    state?: string;
    country?: string;
  } | null> {
    try {
      // Using OpenStreetMap Nominatim (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SmoothMovesApp/1.0' // Required by Nominatim
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.address) {
        return {
          city: data.address.city || data.address.town || data.address.village,
          state: data.address.state,
          country: data.address.country
        };
      }
      
      return null;
    } catch (error) {
      console.warn('Reverse geocoding service unavailable:', error);
      return null;
    }
  }

  /**
   * Request permission for location access
   * Call this proactively to get user consent
   */
  async requestLocationPermission(): Promise<boolean> {
    if (!navigator.permissions) {
      // If permissions API not available, try direct geolocation
      const result = await this.getCurrentLocation();
      return result.success;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      
      if (permission.state === 'granted') {
        return true;
      } else if (permission.state === 'prompt') {
        // User will be prompted when we actually request location
        return true;
      } else {
        // Permission denied
        return false;
      }
    } catch (error) {
      console.warn('Permission API unavailable:', error);
      return true; // Assume we can try
    }
  }

  /**
   * Clear cached location data
   */
  clearLocationCache(): void {
    this.cachedLocation = null;
  }

  /**
   * Get cached location without making new request
   */
  getCachedLocation(): LocationData | null {
    if (this.cachedLocation && this.cachedLocation.timestamp) {
      const now = Date.now();
      const locationAge = now - this.cachedLocation.timestamp;
      
      if (locationAge < this.locationExpiryTime) {
        return this.cachedLocation;
      }
    }
    
    return null;
  }
}

// Export singleton instance
export const locationService = new LocationService();