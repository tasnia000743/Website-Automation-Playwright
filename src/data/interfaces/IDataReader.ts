/**
 * Interface for data reading strategies
 * Implements Strategy pattern for different data sources
 */
export interface IDataReader<T=any> {
  /**
   * Reads data from a file and returns parsed data
   * @param filePath Path to the data file
   * @returns Promise resolving to parsed data
   */
  readData(filePath: string): Promise<T[]>;
  
  /**
   * Validates if the file format is supported
   * @param filePath Path to the file
   * @returns boolean indicating if format is supported
   */
  supportsFormat(filePath: string): boolean;
}
