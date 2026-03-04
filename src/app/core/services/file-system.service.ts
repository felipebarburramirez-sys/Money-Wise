import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export type SavedFile = {
  path: string;
  webViewPath: string;
  mimeType: string;
};

@Injectable({ providedIn: 'root' })
export class FileSystemService {
  /**
   * Guarda una imagen tomada/seleccionada en Directory.Data (app sandbox)
   * y retorna una URI usable para <img>.
   */
  async saveImageFromWebPath(webPath: string, folder = 'receipts'): Promise<SavedFile> {
    const { base64, mimeType } = await this.toBase64(webPath);
    const fileName = `${Date.now()}_${Math.random().toString(16).slice(2)}.jpeg`;
    const path = `${folder}/${fileName}`;

    await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Data,
      recursive: true,
    });

    const webViewPath = await this.getWebViewPath(path);
    return { path, webViewPath, mimeType };
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await Filesystem.deleteFile({ path, directory: Directory.Data });
    } catch {
      // si ya no existe, no frenamos el flujo
    }
  }

  async getWebViewPath(path: string): Promise<string> {
    // En nativo necesitamos uri + convertFileSrc
    const { uri } = await Filesystem.getUri({ path, directory: Directory.Data });

    if (Capacitor.isNativePlatform()) {
      return Capacitor.convertFileSrc(uri);
    }

    // En web, getUri suele devolver algo util o fallback dataURL leyendo el archivo
    return uri;
  }

  private async toBase64(webPath: string): Promise<{ base64: string; mimeType: string }> {
    // Fetch del archivo y convertirlo a base64
    const resp = await fetch(webPath);
    const blob = await resp.blob();
    const mimeType = blob.type || 'image/jpeg';

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
      reader.onload = () => {
        const result = String(reader.result || '');
        // result es "data:image/jpeg;base64,...."
        const comma = result.indexOf(',');
        resolve(comma >= 0 ? result.slice(comma + 1) : result);
      };
      reader.readAsDataURL(blob);
    });

    return { base64, mimeType };
  }
}
