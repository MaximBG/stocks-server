import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import axios from '../../fmp'
import { AxiosResponse } from 'axios'
import Logger from '../../util/winstonLogger'

export const getStockData = expressAsyncHandler(async (req: express.Request, res: express.Response) => {
  const responses = await Promise.allSettled([axios.get('/quote-order/' + req.params.query), axios.get('/profile/' + req.params.query)])
  const result = {}
  let succeeded = 0
  for (const response of responses) {
    if (response.status === 'fulfilled') {
      Object.assign(result, (response as PromiseFulfilledResult<AxiosResponse>).value.data)
      succeeded++
    } else {
      Logger.error('Failed to get data ' + response.reason)
    }
  }
  succeeded === 0 ? res.status(500).send('Failed to get data') : res.json(result)
})
