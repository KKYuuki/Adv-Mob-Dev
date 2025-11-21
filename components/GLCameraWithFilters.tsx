import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, Alert, Image, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { GLView } from 'expo-gl';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { PhotoStorage } from '../utils/photoStorage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface GLCameraWithFiltersProps {
  onPhotoCapture: (photoUri: string) => void;
  onClose: () => void;
}

type FilterType = 'none' | 'grayscale' | 'sepia';

const vertexShader = `
  attribute vec2 position;
  attribute vec2 texCoord;
  varying vec2 vTexCoord;
  
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    vTexCoord = texCoord;
  }
`;

const grayscaleFragmentShader = `
  precision mediump float;
  uniform sampler2D texture;
  uniform float intensity;
  varying vec2 vTexCoord;
  
  void main() {
    vec4 color = texture2D(texture, vTexCoord);
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    vec3 grayscale = vec3(gray);
    gl_FragColor = vec4(mix(color.rgb, grayscale, intensity), color.a);
  }
`;

const sepiaFragmentShader = `
  precision mediump float;
  uniform sampler2D texture;
  uniform float intensity;
  varying vec2 vTexCoord;
  
  void main() {
    vec4 color = texture2D(texture, vTexCoord);
    vec3 sepia;
    sepia.r = dot(color.rgb, vec3(0.393, 0.769, 0.189));
    sepia.g = dot(color.rgb, vec3(0.349, 0.686, 0.168));
    sepia.b = dot(color.rgb, vec3(0.272, 0.534, 0.131));
    gl_FragColor = vec4(mix(color.rgb, sepia, intensity), color.a);
  }
`;

const defaultFragmentShader = `
  precision mediump float;
  uniform sampler2D texture;
  varying vec2 vTexCoord;
  
  void main() {
    gl_FragColor = texture2D(texture, vTexCoord);
  }
`;

export const GLCameraWithFilters = memo<GLCameraWithFiltersProps>(({ onPhotoCapture, onClose }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [filterIntensity, setFilterIntensity] = useState(1);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 25, y: 25, width: 50, height: 50 });
  
  const cameraRef = useRef<CameraView>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);

  const getFragmentShader = useCallback(() => {
    switch (selectedFilter) {
      case 'grayscale':
        return grayscaleFragmentShader;
      case 'sepia':
        return sepiaFragmentShader;
      default:
        return defaultFragmentShader;
    }
  }, [selectedFilter]);

  const createShader = useCallback((gl: WebGLRenderingContext, type: number, source: string) => {
    if (!source || typeof source !== 'string') {
      console.error('Invalid shader source:', source);
      return null;
    }
    
    const shader = gl.createShader(type);
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }, []);

  const createProgram = useCallback((gl: WebGLRenderingContext) => {
    const fragmentShaderSource = getFragmentShader();
    console.log('Creating program with fragment shader:', fragmentShaderSource?.substring(0, 100) + '...');
    
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return null;
    }
    
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    
    console.log('Program created successfully');
    return program;
  }, [createShader, getFragmentShader]);

  const onGLContextCreate = useCallback((gl: WebGLRenderingContext) => {
    console.log('GL Context created');
    glRef.current = gl;
    
    // Set viewport
    gl.viewport(0, 0, screenWidth, screenHeight);
    
    // Create shader program
    const program = createProgram(gl);
    if (!program) {
      console.error('Failed to create shader program');
      return;
    }
    
    programRef.current = program;
    gl.useProgram(program);
    
    // Set up vertices for full-screen quad
    const vertices = new Float32Array([
      -1, -1,  0, 1,
       1, -1,  1, 1,
      -1,  1,  0, 0,
       1,  1,  1, 0,
    ]);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Set up attributes
    const positionLocation = gl.getAttribLocation(program, 'position');
    const texCoordLocation = gl.getAttribLocation(program, 'texCoord');
    
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
    
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);
    
    // Create texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    textureRef.current = texture;
    console.log('GL setup complete');
  }, [createProgram]);

  const render = useCallback(() => {
    if (!glRef.current || !programRef.current || !textureRef.current) return;
    
    const gl = glRef.current;
    const program = programRef.current;
    
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.useProgram(program);
    
    // Set uniforms
    const intensityLocation = gl.getUniformLocation(program, 'intensity');
    gl.uniform1f(intensityLocation, filterIntensity);
    
    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    gl.flush();
  }, [filterIntensity]);

  useEffect(() => {
    if (glRef.current) {
      const program = createProgram(glRef.current);
      if (program) {
        programRef.current = program;
        glRef.current.useProgram(program);
      }
    }
  }, [selectedFilter, createProgram]);

  useEffect(() => {
    render();
  }, [render]);

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
    setRotation(0);
    setCropMode(false);
    setCropArea({ x: 25, y: 25, width: 50, height: 50 });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleCropMode = () => {
    setCropMode(!cropMode);
  };

  const handleConfirm = async () => {
    if (capturedPhoto) {
      try {
        // For now, save the original photo with rotation info
        // In a full implementation, you'd apply GL filters to the captured image
        const savedUri = await PhotoStorage.savePhoto(
          capturedPhoto,
          selectedFilter !== 'none' ? selectedFilter : undefined,
          rotation !== 0 ? rotation : undefined
        );
        
        onPhotoCapture(savedUri);
        onClose();
      } catch (error) {
        console.error('Error saving photo:', error);
        Alert.alert('Error', 'Failed to save photo');
      }
    }
  };

  const renderFilters = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Real-time Filters</Text>
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
        </View>
      )}
    </View>
  );

  const renderCameraView = () => (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={styles.cameraPreview}
        facing="front"
        mode="picture"
      />
      
      {/* GL overlay for real-time filters - only render if GL is ready */}
      {glRef.current && programRef.current && (
        <GLView
          style={styles.glOverlay}
          onContextCreate={onGLContextCreate}
        />
      )}
      
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
      
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: capturedPhoto! }}
          style={[styles.previewPhoto, { transform: [{ rotate: `${rotation}deg` }] }]}
          resizeMode="contain"
        />
        
        {cropMode && (
          <View style={styles.cropOverlay}>
            <View style={[
              styles.cropBox,
              {
                left: `${cropArea.x}%`,
                top: `${cropArea.y}%`,
                width: `${cropArea.width}%`,
                height: `${cropArea.height}%`,
              }
            ]}>
              <View style={styles.cropCorner} />
              <View style={[styles.cropCorner, { right: 0, left: 'auto' }]} />
              <View style={[styles.cropCorner, { bottom: 0, top: 'auto' }]} />
              <View style={[styles.cropCorner, { right: 0, bottom: 0, left: 'auto', top: 'auto' }]} />
            </View>
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

GLCameraWithFilters.displayName = 'GLCameraWithFilters';

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
  cameraPreview: {
    flex: 1,
  },
  glOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
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
  cropCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#1DB954',
    borderRadius: 2,
    top: -10,
    left: -10,
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
