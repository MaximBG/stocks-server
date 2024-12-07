import express from 'express'
import exchanges from '../../fmp/exchanges'

export const getExchanges = (_req: express.Request, res: express.Response) => {
  res.json(exchanges)
}
