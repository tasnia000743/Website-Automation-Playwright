import { IDataReader } from './interfaces/IDataReader';
import { CsvDataReader } from './strategies/CsvDataReader';
import { ExcelDataReader } from './strategies/ExcelDataReader';
import { JsonDataReader } from './strategies/JsonDataReader';

/**
 * Factory class for creating appropriate data readers
 * Uses Strategy pattern to select the right reader based on file format
 */
export class DataReaderFactory {
  private static readers: IDataReader[] = [
    new CsvDataReader(),
    new ExcelDataReader(),
    new JsonDataReader()
  ];

  /**
   * Gets the appropriate data reader for the given file path
   * @param filePath Path to the data file
   * @returns IDataReader instance that supports the file format
   * @throws Error if no reader supports the file format
   */
static getReader(filePath: string): IDataReader {
    const reader = this.readers.find(r => r.supportsFormat(filePath));
    
    if (!reader) {
      throw new Error(`No data reader found for file: ${filePath}`);
    }
    
    return reader;
  }

  /**
   * Reads data from any supported file format
   * @param filePath Path to the data file
   * @returns Promise resolving to parsed data
   */
  static async readData(filePath: string): Promise<any[]> {
    const reader = this.getReader(filePath);
    return reader.readData(filePath);
  }
}
