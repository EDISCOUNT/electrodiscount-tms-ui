import { Plugin } from '@ckeditor/ckeditor5-core';
import { FileLoader, UploadAdapter } from '@ckeditor/ckeditor5-upload';

export class Base64UploadAdapter implements UploadAdapter {
  private loader: FileLoader;

  constructor(loader: FileLoader) {
    this.loader = loader;
  }

  upload(): Promise<{ default: string }> {
    return new Promise((resolve, reject) => {
      this.loader.file.then((file) => {
        this.convertFileToBase64(file!)
          .then((base64) => {
            resolve({ default: base64 });
          })
          .catch((error) => {
            reject(error);
          });
      });
    });
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result) {
          const base64String = reader.result.toString().split(',')[1];
          resolve(base64String);
        } else {
          reject('Failed to read the file as base64.');
        }
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsDataURL(file);
    });
  }
}

class Base64UploadAdapterPlugin extends Plugin {
  static get pluginName() {
    return 'Base64UploadAdapterPlugin';
  }

  init() {
    this.editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new Base64UploadAdapter(loader);
    };
  }
}

export default Base64UploadAdapterPlugin;
