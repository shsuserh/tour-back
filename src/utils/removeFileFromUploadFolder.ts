import fs from 'fs';

export async function removeFilesFromUploadFolder(files: string[]): Promise<void> {
  for (const file of files) {
    if (file) {
      try {
        fs.unlinkSync(file);
      } catch (err) {
        if (err instanceof Error) {
          console.error('ERROR deleting file:', err.stack);
        } else {
          console.error('ERROR deleting file (unknown):', err);
        }
      }
    }
  }
}
