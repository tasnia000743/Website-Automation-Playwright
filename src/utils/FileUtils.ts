import * as fs from 'fs';
import * as path from 'path';

/**
 * File utility class for file operations
 */
export class FileUtils {
  /**
   * Creates a directory if it doesn't exist
   * @param dirPath Directory path
   */
  static createDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Reads a file and returns its content
   * @param filePath File path
   * @returns File content as string
   */
  static readFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Writes content to a file
   * @param filePath File path
   * @param content Content to write
   */
  static writeFile(filePath: string, content: string): void {
    const dir = path.dirname(filePath);
    this.createDirectory(dir);
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * Checks if a file exists
   * @param filePath File path
   * @returns Boolean indicating if file exists
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Gets file extension
   * @param filePath File path
   * @returns File extension
   */
  static getFileExtension(filePath: string): string {
    return path.extname(filePath).toLowerCase();
  }

  /**
   * Gets file name without extension
   * @param filePath File path
   * @returns File name without extension
   */
  static getFileName(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * Lists files in a directory
   * @param dirPath Directory path
   * @param extension Optional file extension filter
   * @returns Array of file names
   */
  static listFiles(dirPath: string, extension?: string): string[] {
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    const files = fs.readdirSync(dirPath);
    
    if (extension) {
      return files.filter(file => file.toLowerCase().endsWith(extension.toLowerCase()));
    }
    
    return files;
  }

  /**
   * Deletes a file
   * @param filePath File path
   */
  static deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Gets file size in bytes
   * @param filePath File path
   * @returns File size in bytes
   */
  static getFileSize(filePath: string): number {
    const stats = fs.statSync(filePath);
    return stats.size;
  }
}
