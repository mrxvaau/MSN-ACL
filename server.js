const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Startup environment checks — helps diagnose auth issues in production logs
console.log('=== MSN ACL Startup Check ===')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('PORT:', port)
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '⚠ NOT SET')
console.log('NEXTAUTH_SECRET configured:', !!process.env.NEXTAUTH_SECRET)
console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL)
console.log('=============================')


app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Security headers
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('X-Frame-Options', 'SAMEORIGIN')
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
      
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
