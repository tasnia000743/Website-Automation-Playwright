import * as fs from 'fs';
import { IDataReader } from '../interfaces/IDataReader';




// Import csv-parser with proper typing
import csv from 'csv-parser';

/**
 * CSV Data Reader Strategy
 * Implements IDataReader for CSV files
 */
export class CsvDataReader implements IDataReader {
  /**
   * Reads data from CSV file
   * @param filePath Path to the CSV file
   * @returns Promise resolving to array of objects
   */
  async readData(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];   
      // Check if file exists first
      if (!fs.existsSync(filePath)) {
        reject(new Error(`CSV file not found: ${filePath}`));
        return;
      }
      try {
        const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
        
        stream
          .pipe(csv())
          .on('data', (data: any) => {
            results.push(data);
          })
          .on('end', () => {
            resolve(results);
          })
          .on('error', (error: Error) => {
            reject(new Error(`Failed to read CSV file: ${error.message}`));
          });
      } catch (error) { 
        reject(new Error(`Failed to create CSV parser: ${error}`));
      }
    });
  }

  /**
   * Checks if file is CSV format
   * @param filePath Path to the file
   * @returns boolean indicating if it's a CSV file
   */
  supportsFormat(filePath: string): boolean {
    return filePath.toLowerCase().endsWith('.csv');
  }
}
