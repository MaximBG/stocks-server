import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import { getDb } from '../../util/mongoDb'

export const getPortfolio = expressAsyncHandler(async (req: express.Request, res: express.Response) => {
  const data = await getDb()
    .collection('users')
    .findOne({ username: req.query.username }, { projection: { _id: 0, portfolio: 1 } })
  res.json(data.portfolio)
})
