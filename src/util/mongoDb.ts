import { MongoClient, Db } from 'mongodb'
import Logger from './winstonLogger'
import config from '../../config.json'

let db: Db

export const connect = async () => {
  if (!db) {
    const client = new MongoClient(config.mongodb.uri)
    await client.connect()
    db = client.db(config.mongodb.db)
    Logger.info('Connected to MongoDB')
  }
  return db
}

export const getDb = (): Db => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.')
  }
  return db
}
