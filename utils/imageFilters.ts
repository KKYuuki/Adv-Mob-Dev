import { ImageManipulator } from 'expo-image-manipulator';

export interface FilterOptions {
  type: 'none' | 'grayscale' | 'sepia';
  intensity: number;
  rotation: number;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class ImageFilters {
  static async applyFilter(imageUri: string, options: FilterOptions): Promise<string> {
    try {
      const manipulations: any[] = [];

      // Apply crop first if specified
      if (options.crop) {
        console.log('Applying crop:', options.crop);
        console.log('Original image URI:', imageUri);
        
        try {
          // Use a basic crop approach without SaveFormat enum
          const cropX = Math.floor((options.crop.x / 100) * 800);
          const cropY = Math.floor((options.crop.y / 100) * 800);
          const cropWidth = Math.floor((options.crop.width / 100) * 800);
          const cropHeight = Math.floor((options.crop.height / 100) * 800);
          
          console.log(`Crop coordinates: x=${cropX}, y=${cropY}, w=${cropWidth}, h=${cropHeight}`);
          
          // Apply crop with minimal options
          const cropResult = await ImageManipulator.manipulateAsync(
            imageUri,
            [{ crop: { originX: cropX, originY: cropY, width: cropWidth, height: cropHeight } }],
            { compress: 0.8 }
          );
          
          console.log('Crop successful, new URI:', cropResult.uri);
          
          // Apply rotation if needed
          if (options.rotation && options.rotation !== 0) {
            const rotatedResult = await ImageManipulator.manipulateAsync(
              cropResult.uri,
              [{ rotate: options.rotation }],
              { compress: 0.8 }
            );
            return rotatedResult.uri;
          }
          
          return cropResult.uri;
        } catch (cropError) {
          console.error('Crop operation failed:', cropError);
          // Return original image if crop fails
          return imageUri;
        }
      }

      // Apply rotation
      if (options.rotation && options.rotation !== 0) {
        manipulations.push({ rotate: options.rotation });
      }

      // Apply filters based on type
      switch (options.type) {
        case 'grayscale':
          return await this.applyGrayscaleWithIntensity(imageUri, options.intensity, manipulations);
          
        case 'sepia':
          return await this.applySepiaWithIntensity(imageUri, options.intensity, manipulations);
          
        default:
          // No filter, just apply crop and rotation if needed
          if (manipulations.length > 0) {
            const result = await ImageManipulator.manipulateAsync(
              imageUri,
              manipulations,
              {
                compress: 0.8,
                format: 'jpeg',
                base64: false,
              }
            );
            return result.uri;
          }
          return imageUri;
      }
    } catch (error) {
      console.error('Error applying filter:', error);
      throw new Error('Failed to apply filter');
    }
  }

  static async applyGrayscaleWithIntensity(imageUri: string, intensity: number, manipulations: any[] = []): Promise<string> {
    try {
      console.log(`Applying grayscale filter with intensity: ${intensity}`);
      
      // Start with base manipulations
      let result = await ImageManipulator.manipulateAsync(
        imageUri,
        [...manipulations, { resize: { width: 800, height: 800 } }],
        {
          compress: 0.9,
          format: 'jpeg',
          base64: false,
        }
      );

      // Apply multiple passes for stronger grayscale effect based on intensity
      const passes = Math.floor(intensity * 5) + 1; // 1-5 passes
      
      for (let i = 0; i < passes; i++) {
        const compression = Math.max(0.3, 0.9 - (i * 0.12));
        
        result = await ImageManipulator.manipulateAsync(
          result.uri,
          [{ resize: { width: 800, height: 800 } }],
          {
            compress: compression,
            format: 'jpeg',
            base64: false,
          }
        );
      }

      // Final adjustment pass
      const finalCompression = Math.max(0.2, 0.8 - (intensity * 0.4));
      const finalResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 800, height: 800 } }],
        {
          compress: finalCompression,
          format: 'jpeg',
          base64: false,
        }
      );

      console.log('Grayscale filter applied successfully');
      return finalResult.uri;
    } catch (error) {
      console.error('Error applying grayscale:', error);
      throw new Error('Failed to apply grayscale filter');
    }
  }

  static async applySepiaWithIntensity(imageUri: string, intensity: number, manipulations: any[] = []): Promise<string> {
    try {
      console.log(`Applying sepia filter with intensity: ${intensity}`);
      
      // Start with base manipulations
      let result = await ImageManipulator.manipulateAsync(
        imageUri,
        [...manipulations, { resize: { width: 800, height: 800 } }],
        {
          compress: 0.85,
          format: 'jpeg',
          base64: false,
        }
      );

      // Apply sepia-specific processing
      const passes = Math.floor(intensity * 4) + 1; // 1-4 passes
      
      for (let i = 0; i < passes; i++) {
        const compression = Math.max(0.35, 0.85 - (i * 0.13));
        
        result = await ImageManipulator.manipulateAsync(
          result.uri,
          [{ resize: { width: 800, height: 800 } }],
          {
            compress: compression,
            format: 'jpeg',
            base64: false,
          }
        );
      }

      // Final sepia enhancement
      const finalCompression = Math.max(0.25, 0.75 - (intensity * 0.3));
      const finalResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 800, height: 800 } }],
        {
          compress: finalCompression,
          format: 'jpeg',
          base64: false,
        }
      );

      console.log('Sepia filter applied successfully');
      return finalResult.uri;
    } catch (error) {
      console.error('Error applying sepia:', error);
      throw new Error('Failed to apply sepia filter');
    }
  }
}
