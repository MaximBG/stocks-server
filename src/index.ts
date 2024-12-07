import { start } from './api/app'
import Logger from './util/winstonLogger'

start().catch((err) => Logger.error(err))
