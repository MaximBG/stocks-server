import { Db } from 'mongodb'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import express from 'express'
import session from 'express-session'
import { getDb } from '../../util/mongoDb'
import expressAsyncHandler from 'express-async-handler'

const unprotectedRoutes = new Set(['/user/login', '/user/register', '/user/logout'])

export const initAuth = (app: express.Application, db: Db) => {
  // Passport Configuration
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await db.collection('users').findOne({ username })
        if (!user) return done(null, false, { message: 'User not found' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return done(null, false, { message: 'Incorrect password' })

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }),
  )

  passport.serializeUser((user: any, done) => done(null, user._id))
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.collection('users').findOne({ _id: id })
      done(null, user)
    } catch (err) {
      done(err)
    }
  })

  // Middleware for session handling
  app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
  app.use(passport.initialize())
  app.use(passport.session())
}

// Middleware to enforce authentication
export const auth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (unprotectedRoutes.has(req.path) || true /*req.isAuthenticated()*/) {
    //uncomment for production
    return next()
  }
  res.status(401).send('Unauthorized')
}

export const login = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  passport.authenticate('local', (err: any, user: Express.User, info: { message: any }) => {
    if (err) return next(err)
    if (!user) return res.status(400).send(info.message)

    req.logIn(user, (err) => {
      if (err) return next(err)
      res.send('User logged in')
    })
  })(req, res, next)
}

export const register = expressAsyncHandler(async (req: express.Request, res: express.Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(400).send('Missing fields')
    return
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  await getDb().collection('users').insertOne({ username, password: hashedPassword })
  res.send('User registered: ' + username)
})
