import * as Winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import path from 'path'
import * as Transport from 'winston-transport'
import config from '../../config.json'
import fs from 'fs'

const rename = (oldFilename: string) => {
  fs.renameSync(oldFilename, oldFilename + new Date().toISOString())
}

interface ILogger extends Omit<Winston.Logger, 'error' | 'child'> {
  error: (err: Error | string, message?: string) => void
  child: (options: Record<string, any>) => ILogger
}

function logger(settings: any): ILogger {
  const auditFile = path.join(settings.path, 'audit.json')

  const errors = new DailyRotateFile({
    filename: path.join(settings.path, 'stocks.error.%DATE%.log'),
    level: 'error',
    maxFiles: settings.maxFiles,
    datePattern: 'YYYYMMDD',
    auditFile,
  })

  errors.on('rotate', rename)

  const general = new DailyRotateFile({
    filename: path.join(settings.path, 'stocks.%DATE%.log'),
    maxFiles: settings.maxFiles,
    datePattern: 'YYYYMMDD',
    auditFile,
  })

  general.on('rotate', rename)

  const winstonConfig = {
    level: settings.level,
    format: Winston.format.combine(
      // Add the message timestamp with the preferred format
      Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
      // Define the format of the message showing the timestamp, the level and the message
      //Winston.format.printf(
      //  (info: any) => `${info.timestamp} ${info.level}: ${info.message}`,
      //),
      //Winston.format.timestamp(),
      Winston.format.printf((data: any) => `[${data.timestamp}][${data.level}]${data.label ? '[' + data.label + '] ' : ' '}${data.message}`),
    ),
    transports: [
      // Allow to print all the error level messages inside the stocks_error.log file
      errors,
      general,
    ] as Transport[],
  }

  if (settings.console) {
    // Allow the use the console to print the messages
    winstonConfig.transports.push(new Winston.transports.Console())
  }

  const logger = Winston.createLogger(winstonConfig) as unknown as ILogger

  //for morgan-body:
  logger.stream = {
    // @ts-ignore
    write: (message) => logger.info(message),
  }

  // @ts-ignore
  logger.error = (err: Error | string, message: any) => {
    if (err instanceof Error) {
      logger.log({ level: 'error', message: `${message || ''} ${message ? ': ' : ''} ${err.message || ''} ${err.stack ? '\n' + err.stack : err}` })
    } else {
      logger.log({ level: 'error', message: err })
    }
    return logger
  }

  return logger
}

const Logger = logger(config.log)

export default Logger
