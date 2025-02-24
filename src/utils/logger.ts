import fs from 'fs';
import path from 'path';

type Nullable<T> = T | undefined;

import 'dotenv/config';

export class Logger {
  private logFilePath: string = '';
  private startTime: number = 0;
  private isEnabled: boolean;

  constructor(filename = 'calculator-debug.log') {
    this.isEnabled = process.env.ENABLE_LOGGING === 'true';
    
    if (!this.isEnabled) return;

    // Create logs directory if it doesn't exist
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
      }

      this.logFilePath = path.join(logsDir, filename);
      this.startTime = Date.now();

      fs.writeFileSync(this.logFilePath, `=== Log started at ${new Date().toISOString()} ===\n\n`);
    } catch (err) {
      console.error(`Failed to initialize logger: ${err}`);
    }
  }

  log(message: string, data?: Nullable<any>): void {
    if (!this.isEnabled) return;
    
    const timestamp = Date.now() - this.startTime;
    let logMessage = `${message}`;
    
    if (data !== undefined) {
      if (typeof data === 'object') {
        logMessage += `\n${JSON.stringify(data, null, 2)}`;
      } else {
        logMessage += ` ${data}`;
      }
    }
    
    fs.appendFileSync(this.logFilePath, logMessage + '\n');
  }
}

// Create singleton instance
export const logger = new Logger();
