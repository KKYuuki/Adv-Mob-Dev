import React, { useState, useRef, useCallback, memo } from 'react';
import { View, StyleSheet, Pressable, Text, Alert, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { PhotoStorage } from '../utils/photoStorage';
import { ImageFilters } from '../utils/imageFilters';

interface CameraWithFiltersProps {
  onPhotoCapture: (photoUri: string) => void;
  onClose: () => void;
}

type FilterType = 'none' | 'grayscale' | 'sepia';

export const CameraWithFilters = memo<CameraWithFiltersProps>(({ onPhotoCapture, onClose }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [filterIntensity, setFilterIntensity] = useState(1);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 20, y: 20, width: 60, height: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 300, height: 400 });
  const [croppedPhotoUri, setCroppedPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const photoContainerRef = useRef<View>(null);

  const getFilterStyle = useCallback(() => {
    // Return base style since CSS filters don't work in React Native
    // The filter will be applied during photo processing
    return { flex: 1 };
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo && photo.uri) {
          setCapturedPhoto(photo.uri);
        }
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setCroppedPhotoUri(null);
    setRotation(0);
    setCropMode(false);
    setCropArea({ x: 20, y: 20, width: 60, height: 60 });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleCropMode = async () => {
    if (cropMode) {
      // Apply crop when exiting crop mode
      console.log('Applying crop to image:', cropArea);
      
      try {
        if (capturedPhoto) {
          // Apply the crop to the image
          const croppedUri = await ImageFilters.applyFilter(capturedPhoto, {
            type: 'none',
            intensity: 1,
            rotation: rotation,
            crop: cropArea,
          });
          
          console.log('Cropped image URI:', croppedUri);
          setCroppedPhotoUri(croppedUri);
        }
      } catch (error) {
        console.error('Error applying crop:', error);
        Alert.alert('Error', 'Failed to apply crop');
      }
    }
    setCropMode(!cropMode);
  };

  const adjustCropSize = () => {
    if (!cropMode) return;
    
    // Cycle through different crop sizes
    const sizes = [
      { width: 80, height: 80 },  // Large square
      { width: 60, height: 60 },  // Medium square
      { width: 40, height: 40 },  // Small square
      { width: 70, height: 50 },  // Landscape
      { width: 50, height: 70 },  // Portrait
    ];
    
    const currentIndex = sizes.findIndex(size => 
      Math.abs(size.width - cropArea.width) < 5 && Math.abs(size.height - cropArea.height) < 5
    );
    const nextIndex = (currentIndex + 1) % sizes.length;
    const nextSize = sizes[nextIndex];
    
    // Center the crop area
    const newCropArea = {
      x: (100 - nextSize.width) / 2,
      y: (100 - nextSize.height) / 2,
      width: nextSize.width,
      height: nextSize.height,
    };
    
    console.log('Adjusting crop size:', newCropArea);
    setCropArea(newCropArea);
  };

  const applyCropToImage = () => {
    // This will be handled in handleConfirm with the actual crop processing
    console.log('Crop will be applied to image:', cropArea);
  };

  const handleCropPanStart = (event: any) => {
    if (!cropMode || isResizing) return;
    const { locationX, locationY } = event;
    
    // Use actual container dimensions
    const { width: containerWidth, height: containerHeight } = containerDimensions;
    
    // Convert current crop percentages to pixels
    const cropXPixels = (cropArea.x / 100) * containerWidth;
    const cropYPixels = (cropArea.y / 100) * containerHeight;
    
    // Calculate the offset from touch to crop box edge
    const offsetX = locationX - cropXPixels;
    const offsetY = locationY - cropYPixels;
    
    setIsDragging(true);
    setDragStart({ 
      x: locationX, 
      y: locationY,
      offsetX: offsetX,
      offsetY: offsetY
    });
  };

  const handleCropPanMove = (event: any) => {
    if (!isDragging || !cropMode || isResizing) return;
    const { locationX, locationY } = event;
    
    // Use actual container dimensions
    const { width: containerWidth, height: containerHeight } = containerDimensions;
    
    // Calculate new position in pixels (subtract the initial offset)
    const newX = locationX - dragStart.offsetX;
    const newY = locationY - dragStart.offsetY;
    
    // Convert to percentage
    const newXPercent = (newX / containerWidth) * 100;
    const newYPercent = (newY / containerHeight) * 100;
    
    // Update crop area with boundary constraints
    const newCropArea = {
      ...cropArea,
      x: Math.max(0, Math.min(100 - cropArea.width, newXPercent)),
      y: Math.max(0, Math.min(100 - cropArea.height, newYPercent)),
    };
    
    setCropArea(newCropArea);
  };

  const handleResizeStart = (corner: string, event: any) => {
    if (!cropMode) return;
    const { locationX, locationY } = event;
    setIsResizing(true);
    setResizeCorner(corner);
    setDragStart({ 
      x: locationX, 
      y: locationY,
      offsetX: 0,
      offsetY: 0
    });
  };

  const handleResizeMove = (event: any) => {
    if (!isResizing || !cropMode) return;
    const { locationX, locationY } = event;
    
    const { width: containerWidth, height: containerHeight } = containerDimensions;
    
    let newCropArea = { ...cropArea };
    
    // Handle different corner resizing
    switch (resizeCorner) {
      case 'top-left':
        const newWidth1 = ((cropArea.x + cropArea.width) / 100) * containerWidth - (locationX / containerWidth) * containerWidth;
        const newHeight1 = ((cropArea.y + cropArea.height) / 100) * containerHeight - (locationY / containerHeight) * containerHeight;
        newCropArea.x = (locationX / containerWidth) * 100;
        newCropArea.y = (locationY / containerHeight) * 100;
        newCropArea.width = (newWidth1 / containerWidth) * 100;
        newCropArea.height = (newHeight1 / containerHeight) * 100;
        break;
        
      case 'top-right':
        const newWidth2 = (locationX / containerWidth) * 100 - cropArea.x;
        const newHeight2 = ((cropArea.y + cropArea.height) / 100) * containerHeight - (locationY / containerHeight) * containerHeight;
        newCropArea.y = (locationY / containerHeight) * 100;
        newCropArea.width = newWidth2;
        newCropArea.height = (newHeight2 / containerHeight) * 100;
        break;
        
      case 'bottom-left':
        const newWidth3 = ((cropArea.x + cropArea.width) / 100) * containerWidth - (locationX / containerWidth) * containerWidth;
        const newHeight3 = (locationY / containerHeight) * 100 - cropArea.y;
        newCropArea.x = (locationX / containerWidth) * 100;
        newCropArea.width = (newWidth3 / containerWidth) * 100;
        newCropArea.height = newHeight3;
        break;
        
      case 'bottom-right':
        const newWidth4 = (locationX / containerWidth) * 100 - cropArea.x;
        const newHeight4 = (locationY / containerHeight) * 100 - cropArea.y;
        newCropArea.width = newWidth4;
        newCropArea.height = newHeight4;
        break;
    }
    
    // Ensure minimum size and boundaries
    newCropArea.width = Math.max(10, Math.min(100 - newCropArea.x, newCropArea.width));
    newCropArea.height = Math.max(10, Math.min(100 - newCropArea.y, newCropArea.height));
    
    setCropArea(newCropArea);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeCorner('');
  };

  const handleCropPanEnd = () => {
    setIsDragging(false);
  };

  const handleConfirm = async () => {
    if (capturedPhoto) {
      try {
        // Use the cropped photo if available, otherwise apply all effects to original
        let finalPhotoUri = croppedPhotoUri || capturedPhoto;
        
        // If we don't have a cropped photo but have other effects, apply them
        if (!croppedPhotoUri && (selectedFilter !== 'none' || rotation !== 0)) {
          finalPhotoUri = await ImageFilters.applyFilter(capturedPhoto, {
            type: selectedFilter,
            intensity: filterIntensity,
            rotation: rotation,
            crop: cropMode ? cropArea : undefined,
          });
        }
        
        // Save the final photo with metadata
        await PhotoStorage.savePhoto(finalPhotoUri, {
          filter: selectedFilter,
          intensity: filterIntensity,
          rotation: rotation,
          crop: croppedPhotoUri ? cropArea : undefined,
          timestamp: Date.now(),
        });
        
        onPhotoCapture(finalPhotoUri);
      } catch (error) {
        console.error('Error processing photo:', error);
        Alert.alert('Error', 'Failed to process photo');
      }
    }
  };

  const renderFilters = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filters</Text>
      <View style={styles.filterButtons}>
        <Pressable
          style={[styles.filterButton, selectedFilter === 'none' && styles.activeFilter]}
          onPress={() => setSelectedFilter('none')}
        >
          <Text style={styles.filterButtonText}>None</Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, selectedFilter === 'grayscale' && styles.activeFilter]}
          onPress={() => setSelectedFilter('grayscale')}
        >
          <Text style={styles.filterButtonText}>B&W</Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, selectedFilter === 'sepia' && styles.activeFilter]}
          onPress={() => setSelectedFilter('sepia')}
        >
          <Text style={styles.filterButtonText}>Sepia</Text>
        </Pressable>
      </View>
      
      {selectedFilter !== 'none' && (
        <View style={styles.intensityContainer}>
          <Text style={styles.intensityLabel}>Intensity: {Math.round(filterIntensity * 100)}%</Text>
          <Slider
            style={styles.intensitySlider}
            minimumValue={0}
            maximumValue={1}
            value={filterIntensity}
            onValueChange={setFilterIntensity}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#666"
          />
          <Text style={styles.filterNote}>
            Filter will be applied to the final photo
          </Text>
        </View>
      )}
    </View>
  );

  const renderCameraView = () => (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={getFilterStyle()}
        facing="front"
        mode="picture"
      />
      {renderFilters()}
      
      <View style={styles.controlsContainer}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </Pressable>
        
        <Pressable onPress={handleCapture} style={styles.captureButton}>
          <View style={styles.captureInner} />
        </Pressable>
        
        <View style={styles.placeholder} />
      </View>
    </View>
  );

  const renderPhotoPreview = () => (
    <View style={styles.previewContainer}>
      <View style={styles.previewHeader}>
        <Pressable onPress={handleRetake} style={styles.retakeButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.retakeText}>Retake</Text>
        </Pressable>
        
        <Pressable onPress={handleConfirm} style={styles.confirmButton}>
          <Ionicons name="checkmark" size={24} color="#000" />
          <Text style={styles.confirmText}>Use Photo</Text>
        </Pressable>
      </View>
      
      <View style={styles.photoContainer} ref={photoContainerRef} onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerDimensions({ width, height });
      }}>
        <Image
          source={{ uri: croppedPhotoUri || capturedPhoto! }}
          style={[styles.previewPhoto, { transform: [{ rotate: `${rotation}deg` }] }]}
          resizeMode="contain"
        />
        
        {cropMode && (
          <View style={styles.cropOverlay}>
            {/* Make the crop box itself draggable */}
            <Pressable
              style={[
                styles.cropBox,
                {
                  left: `${cropArea.x}%`,
                  top: `${cropArea.y}%`,
                  width: `${cropArea.width}%`,
                  height: `${cropArea.height}%`,
                }
              ]}
              onTouchStart={(e) => {
                const { locationX, locationY } = e.nativeEvent;
                console.log('Touch start on crop box:', locationX, locationY);
                setIsDragging(true);
                setDragStart({ 
                  x: locationX, 
                  y: locationY,
                  offsetX: 0,
                  offsetY: 0
                });
              }}
              onTouchMove={(e) => {
                if (!isDragging) return;
                const { locationX, locationY } = e.nativeEvent;
                console.log('Touch move on crop box:', locationX, locationY);
                
                const { width: containerWidth, height: containerHeight } = containerDimensions;
                
                // Calculate movement delta
                const deltaX = locationX - dragStart.x;
                const deltaY = locationY - dragStart.y;
                
                // Update crop area position
                const newXPercent = cropArea.x + (deltaX / containerWidth) * 100;
                const newYPercent = cropArea.y + (deltaY / containerHeight) * 100;
                
                const newCropArea = {
                  ...cropArea,
                  x: Math.max(0, Math.min(100 - cropArea.width, newXPercent)),
                  y: Math.max(0, Math.min(100 - cropArea.height, newYPercent)),
                };
                
                console.log('New crop area:', newCropArea);
                setCropArea(newCropArea);
                setDragStart({ x: locationX, y: locationY, offsetX: 0, offsetY: 0 });
              }}
              onTouchEnd={() => {
                console.log('Touch end on crop box');
                setIsDragging(false);
              }}
            >
              {/* Resizable corners */}
              <View style={styles.cropCorner} />
              <View style={[styles.cropCorner, { right: 0, left: 'auto' }]} />
              <View style={[styles.cropCorner, { bottom: 0, top: 'auto' }]} />
              <View style={[styles.cropCorner, { right: 0, bottom: 0, left: 'auto', top: 'auto' }]} />
              
              {/* Add drag indicator */}
              <View style={styles.dragIndicator}>
                <Text style={styles.dragText}>Drag this box to move</Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
      
      <View style={styles.editTools}>
        <Pressable onPress={handleRotate} style={styles.editButton}>
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Rotate</Text>
        </Pressable>
        
        <Pressable onPress={toggleCropMode} style={[styles.editButton, cropMode && styles.activeEditButton]}>
          <Ionicons name="crop" size={20} color="#fff" />
          <Text style={styles.editButtonText}>{cropMode ? 'Done' : 'Crop'}</Text>
        </Pressable>
        
        {cropMode && (
          <Pressable onPress={adjustCropSize} style={styles.editButton}>
            <Ionicons name="resize" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Size</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access is required</Text>
        <Pressable onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1DB954", "#000000"]}
        style={styles.gradient}
      >
        {capturedPhoto ? renderPhotoPreview() : renderCameraView()}
      </LinearGradient>
    </View>
  );
});

CameraWithFilters.displayName = 'CameraWithFilters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  filterContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 16,
  },
  filterTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#1DB954',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  intensityContainer: {
    marginTop: 8,
  },
  intensityLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  intensitySlider: {
    width: '100%',
    height: 40,
  },
  filterNote: {
    color: '#b3b3b3',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  closeButton: {
    padding: 12,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  placeholder: {
    width: 48,
  },
  previewContainer: {
    flex: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retakeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1DB954',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  confirmText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  previewPhoto: {
    width: '100%',
    height: '80%',
    borderRadius: 12,
  },
  editTools: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  activeEditButton: {
    backgroundColor: '#1DB954',
  },
  cropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#1DB954',
    backgroundColor: 'transparent',
  },
  cropDragArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  cropCorner: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#1DB954',
    borderRadius: 4,
    top: -12,
    left: -12,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
  },
  dragIndicator: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dragText: {
    color: '#fff',
    fontSize: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 40,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
