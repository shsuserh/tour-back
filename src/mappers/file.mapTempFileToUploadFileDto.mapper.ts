import { FileDto } from '../datatypes/dtos/response/file.response.dto';
import { TempFile } from '../entities/tempFile.entity';

export function mapTempFileToUploadFileDto(file: TempFile): FileDto | null {
  if (!file) return null;

  const { id, name, size, filePath, mimeType, extension, originalName } = file;
  return {
    id,
    name,
    size,
    filePath,
    mimeType,
    extension,
    originalName,
  };
}
