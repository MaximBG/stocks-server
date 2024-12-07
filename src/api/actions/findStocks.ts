import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import axios from '../../fmp'

export const findStocks = expressAsyncHandler(async (req: express.Request, res: express.Response) => {
  const response = await axios.get('/search?query=' + req.params.query)
  res.json(response.data)
})
