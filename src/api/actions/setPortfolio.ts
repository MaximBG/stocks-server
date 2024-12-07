import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import { getDb } from '../../util/mongoDb'

export const setPortfolio = expressAsyncHandler(async (req: express.Request, res: express.Response) => {
  await getDb()
    .collection('users')
    .updateOne({ username: req.query.username }, { $set: { portfolio: req.body.portfolio } })
  res.status(204).send()
})
