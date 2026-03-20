import * as fs from 'fs';
import { IDataReader } from '../interfaces/IDataReader';

/**
 * JSON Data Reader Strategy
 * Implements IDataReader for JSON files
 */
export class JsonDataReader implements IDataReader {
  /**
   * Reads data from JSON file
   * @param filePath Path to the JSON file
   * @returns Promise resolving to array of objects
   */
  async readData(filePath: string): Promise<any[]> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      
      // Ensure we return an array
      return Array.isArray(jsonData) ? jsonData : [jsonData];
    } catch (error) {
      throw new Error(`Failed to read JSON file: ${error}`);
    }
  }

  /**
   * Checks if file is JSON format
   * @param filePath Path to the file
   * @returns boolean indicating if it's a JSON file
   */
  supportsFormat(filePath: string): boolean {
    return filePath.toLowerCase().endsWith('.json');
  }
}
