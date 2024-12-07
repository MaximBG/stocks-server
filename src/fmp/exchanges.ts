import Logger from '../util/winstonLogger'
import axios from './index'

const exchanges: string[] = []
;(async () => {
  try {
    const response = await axios.get('/exchanges-list')
    exchanges.push(...response.data)
    Logger.info('Got ' + exchanges.length + ' exchanges')
  } catch (e) {
    Logger.error(e, 'failed to retrieve exchanges')
  }
})()
export default exchanges
