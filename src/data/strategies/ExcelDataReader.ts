import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { IDataReader } from '../interfaces/IDataReader';

export class ExcelDataReader implements IDataReader {
  /**
   * Reads data from an Excel file (.xlsx or .xls)
   */
  async readData(filePath: string): Promise<any[]> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Excel file not found: ${filePath}`);
    }

    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        throw new Error(`Sheet "${sheetName}" not found`);
      }  
      return XLSX.utils.sheet_to_json(worksheet);
    } catch (err) {
      throw new Error(`Failed to read Excel file: ${err}`);
    }
  }

  /**
   * Checks if the given file is an Excel file
   */
  supportsFormat(filePath: string): boolean {
    return filePath.endsWith('.xlsx') || filePath.endsWith('.xls');
  }
}
