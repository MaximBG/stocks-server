import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import cors from 'cors'
import Logger from '../util/winstonLogger'
import { router } from './router'
import { auth, initAuth } from './middleware/auth'
import config from '../../config.json'
import { connect } from '../util/mongoDb'

export const expressApp = express()

expressApp.use(cors(config.cors))
expressApp.use(bodyParser.json({ limit: '10mb' }))
expressApp.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
const isProduction = process.env.NODE_ENV === 'production'
expressApp.use(
  session({
    secret: 'x,oewrcwYv6qfhhj', // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Prevent JavaScript access to the cookie
      secure: isProduction, // Requires HTTPS in production
      sameSite: isProduction ? 'none' : 'lax',
    },
  }),
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
expressApp.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  Logger.error(err, req.path)
  res.status(500).send('Operation failed')
})

export const start = async () => {
  try {
    const db = await connect()
    Logger.info('Connected to MongoDB')

    // Initialize authentication
    initAuth(expressApp, db)

    expressApp.use('/api/v1', auth, router)

    expressApp.listen(config.port, () => Logger.info(`Server is running on http://localhost:${config.port}`))
  } catch (e) {
    Logger.error(e, '!!!Connection to DB failed, server is not running!!!')
  }
}
