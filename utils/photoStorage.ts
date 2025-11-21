import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

interface StoredPhoto {
  id: string;
  uri: string;
  timestamp: number;
  filter?: string;
  rotation?: number;
}

export class PhotoStorage {
  private static readonly STORAGE_KEY = 'stored_photos';

  static async savePhoto(photoUri: string, filter?: string, rotation?: number): Promise<string> {
    try {
      const photoId = `photo_${Date.now()}`;
      
      // Create a local file in the app's document directory
      const fileName = `${photoId}.jpg`;
      const localUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Copy the photo to local storage
      await FileSystem.copyAsync({
        from: photoUri,
        to: localUri,
      });

      // Save metadata to AsyncStorage
      const photoData: StoredPhoto = {
        id: photoId,
        uri: localUri,
        timestamp: Date.now(),
        filter,
        rotation,
      };

      const existingPhotos = await this.getAllPhotos();
      existingPhotos.push(photoData);
      
      // Keep only the last 50 photos to manage storage
      const limitedPhotos = existingPhotos.slice(-50);
      
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedPhotos));
      
      return localUri;
    } catch (error) {
      console.error('Error saving photo:', error);
      throw new Error('Failed to save photo');
    }
  }

  static async getAllPhotos(): Promise<StoredPhoto[]> {
    try {
      const storedPhotos = await AsyncStorage.getItem(this.STORAGE_KEY);
      return storedPhotos ? JSON.parse(storedPhotos) : [];
    } catch (error) {
      console.error('Error loading photos:', error);
      return [];
    }
  }

  static async deletePhoto(photoId: string): Promise<void> {
    try {
      const photos = await this.getAllPhotos();
      const photoToDelete = photos.find(p => p.id === photoId);
      
      if (photoToDelete) {
        // Delete the file
        await FileSystem.deleteAsync(photoToDelete.uri, { idempotent: true });
        
        // Remove from storage
        const updatedPhotos = photos.filter(p => p.id !== photoId);
        await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedPhotos));
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw new Error('Failed to delete photo');
    }
  }

  static async clearAllPhotos(): Promise<void> {
    try {
      const photos = await this.getAllPhotos();
      
      // Delete all photo files
      for (const photo of photos) {
        await FileSystem.deleteAsync(photo.uri, { idempotent: true });
      }
      
      // Clear storage
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing photos:', error);
      throw new Error('Failed to clear photos');
    }
  }

  static async getStorageInfo(): Promise<{ count: number; totalSize: number }> {
    try {
      const photos = await this.getAllPhotos();
      let totalSize = 0;
      
      for (const photo of photos) {
        const fileInfo = await FileSystem.getInfoAsync(photo.uri);
        if (fileInfo.exists && fileInfo.size) {
          totalSize += fileInfo.size;
        }
      }
      
      return {
        count: photos.length,
        totalSize,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { count: 0, totalSize: 0 };
    }
  }
}
