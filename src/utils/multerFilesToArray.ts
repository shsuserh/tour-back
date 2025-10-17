export function filesToArray(
  files: Express.Multer.File[] | Record<string, Express.Multer.File[]> | undefined
): Express.Multer.File[] {
  if (!files) return [];
  if (Array.isArray(files)) return files;
  return Object.values(files).flat();
}
