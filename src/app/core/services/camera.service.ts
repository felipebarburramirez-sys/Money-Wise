import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, type Photo } from '@capacitor/camera';

@Injectable({ providedIn: 'root' })
export class CameraService {
  async takePhoto(): Promise<Photo> {
    return Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
  }

  async pickFromGallery(): Promise<Photo> {
    return Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });
  }
}
