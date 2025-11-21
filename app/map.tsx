import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// Mock points of interest relevant to music/Spotify theme
const MOCK_POINTS_OF_INTEREST = [
  {
    id: 1,
    title: 'Spotify Headquarters',
    description: 'Global music streaming hub',
    latitude: 37.7749,
    longitude: -122.4194,
    type: 'headquarters',
  },
  {
    id: 2,
    title: 'Live Music Venue',
    description: 'Popular concert location',
    latitude: 37.7849,
    longitude: -122.4094,
    type: 'venue',
  },
  {
    id: 3,
    title: 'Recording Studio',
    description: 'Professional music production',
    latitude: 37.7649,
    longitude: -122.4294,
    type: 'studio',
  },
  {
    id: 4,
    title: 'Music Festival Grounds',
    description: 'Annual music event location',
    latitude: 37.7549,
    longitude: -122.4394,
    type: 'festival',
  },
];

// Geofence regions (100-meter radius around points of interest)
const GEOFENCE_REGIONS = MOCK_POINTS_OF_INTEREST.map(point => ({
  ...point,
  radius: 100, // 100 meters
}));

// Dark mode map style
const DARK_MAP_STYLE = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#1DB954"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];

export default function MapScreen() {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [activeGeofences, setActiveGeofences] = useState<number[]>([]);
  const [mapStyle, setMapStyle] = useState(DARK_MAP_STYLE);
  const mapRef = useRef<MapView>(null);

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      const newLocation = { latitude, longitude };
      setCurrentLocation(newLocation);
      
      // Update map region to center on current location
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Check geofences
      checkGeofences(latitude, longitude);
    } catch (error) {
      console.error('Error in getCurrentLocation:', error);
      Alert.alert('Error', 'Failed to get your location. Please check your device settings.');
    }
  };

  // Watch location changes for geofencing
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startLocationWatch = async () => {
      try {
        const hasPermission = await requestLocationPermission();
        
        if (hasPermission) {
          subscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              distanceInterval: 10, // Update every 10 meters
            },
            (location: Location.LocationObject) => {
              const { latitude, longitude } = location.coords;
              setCurrentLocation({ latitude, longitude });
              checkGeofences(latitude, longitude);
            }
          );
        }
      } catch (error) {
        console.error('Error starting location watch:', error);
      }
    };

    startLocationWatch();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if user is within any geofence
  const checkGeofences = (userLat: number, userLon: number) => {
    const newActiveGeofences: number[] = [];

    GEOFENCE_REGIONS.forEach((fence) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        fence.latitude,
        fence.longitude
      );

      if (distance <= fence.radius) {
        newActiveGeofences.push(fence.id);
      }
    });

    // Check for changes in active geofences
    const enteredGeofences = newActiveGeofences.filter(
      id => !activeGeofences.includes(id)
    );
    const exitedGeofences = activeGeofences.filter(
      id => !newActiveGeofences.includes(id)
    );

    // Trigger alerts for geofence changes
    enteredGeofences.forEach((id) => {
      const fence = GEOFENCE_REGIONS.find(f => f.id === id);
      if (fence) {
        Alert.alert(
          'Geofence Alert',
          `You entered the ${fence.title} area! 🎵`,
          [{ text: 'OK' }]
        );
      }
    });

    exitedGeofences.forEach((id) => {
      const fence = GEOFENCE_REGIONS.find(f => f.id === id);
      if (fence) {
        Alert.alert(
          'Geofence Alert',
          `You left the ${fence.title} area`,
          [{ text: 'OK' }]
        );
      }
    });

    setActiveGeofences(newActiveGeofences);
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Map control functions
  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...region,
        latitudeDelta: region.latitudeDelta * 0.5,
        longitudeDelta: region.longitudeDelta * 0.5,
      });
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...region,
        latitudeDelta: region.latitudeDelta * 2,
        longitudeDelta: region.longitudeDelta * 2,
      });
    }
  };

  const centerOnUser = () => {
    if (currentLocation) {
      setRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      getCurrentLocation();
    }
  };

  const toggleMapStyle = () => {
    setMapStyle(mapStyle === DARK_MAP_STYLE ? [] : DARK_MAP_STYLE);
  };

  // Get marker color based on type
  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'headquarters':
        return '#1DB954'; // Spotify green
      case 'venue':
        return '#FF6B6B'; // Red
      case 'studio':
        return '#4ECDC4'; // Teal
      case 'festival':
        return '#FFD93D'; // Yellow
      default:
        return '#1DB954';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1DB954", "#000000"]}
        style={styles.gradient}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Music Locations Map</Text>
          <View style={styles.placeholder} />
        </View>

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          customMapStyle={mapStyle}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          showsBuildings={true}
          showsTraffic={true}
        >
          {/* Current location marker */}
          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="Your Location"
              description="You are here"
              pinColor="#1DB954"
            />
          )}

          {/* Points of interest markers */}
          {MOCK_POINTS_OF_INTEREST.map((point) => (
            <Marker
              key={point.id}
              coordinate={{
                latitude: point.latitude,
                longitude: point.longitude,
              }}
              title={point.title}
              description={point.description}
              pinColor={getMarkerColor(point.type)}
            />
          ))}

          {/* Geofence circles */}
          {GEOFENCE_REGIONS.map((fence) => (
            <Circle
              key={fence.id}
              center={{
                latitude: fence.latitude,
                longitude: fence.longitude,
              }}
              radius={fence.radius}
              strokeColor={
                activeGeofences.includes(fence.id) ? '#FF6B6B' : '#1DB954'
              }
              fillColor={
                activeGeofences.includes(fence.id)
                  ? 'rgba(255, 107, 107, 0.2)'
                  : 'rgba(29, 185, 84, 0.1)'
              }
              strokeWidth={2}
            />
          ))}
        </MapView>

        {/* Map Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={zoomIn}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={zoomOut}>
            <Ionicons name="remove" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={centerOnUser}>
            <Ionicons name="location" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={toggleMapStyle}>
            <Ionicons name="color-palette" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Location Info */}
        <View style={styles.infoPanel}>
          <Text style={styles.infoTitle}>Music Locations Near You</Text>
          <Text style={styles.infoText}>
            {activeGeofences.length > 0
              ? `${activeGeofences.length} active geofence(s)`
              : 'No active geofences'}
          </Text>
          {currentLocation && (
            <Text style={styles.coordinates}>
              Lat: {currentLocation.latitude.toFixed(4)}, Lon: {currentLocation.longitude.toFixed(4)}
            </Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 34,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    right: 20,
    top: height * 0.25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 5,
  },
  controlButton: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 15,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    color: '#1DB954',
    fontSize: 14,
    marginBottom: 5,
  },
  coordinates: {
    color: '#b3b3b3',
    fontSize: 12,
  },
});
