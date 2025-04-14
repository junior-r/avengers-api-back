import express from 'express'
import cookieParser from 'cookie-parser'
import { config } from './config'
import { createUserRouter } from './routes/users'
import { createAuthRouter } from './routes/auth'
import { corsMiddleware } from './middlewares/cors'
import { authMiddleware } from './middlewares/auth'

const app = express()

const { PORT } = config

app.disable("x-powered-by")
app.use(express.json())
app.use(corsMiddleware())
app.use(cookieParser())
app.use((req, res, next) => authMiddleware(req, res, next))

app.get('/', (_req, res) => {
  res.send('Hello world!')
})

app.use('/api/auth', createAuthRouter())
app.use('/api/users', createUserRouter())
// TODO: app.use('/api/token')
app.use((_req, res, _next) => {
  res.status(404).json({ error: 'Not Found' })
  return
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})