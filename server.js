const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000

// For production HTTPS, we trust the proxy (Apache/Nginx in cPanel)
// The proxy handles SSL and forwards to our HTTP server
const app = next({
  dev,
  // Trust proxy headers for HTTPS (important for cPanel/Passenger)
  conf: {
    compress: true,
    poweredByHeader: false,
  }
})

const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Trust proxy headers for secure connections
      // cPanel's Apache/Nginx handles SSL and sets these headers
      if (req.headers['x-forwarded-proto'] === 'https') {
        req.connection.encrypted = true
      }

      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on port ${port}`)
      console.log(`> Environment: ${process.env.NODE_ENV}`)
      console.log(`> HTTPS handled by reverse proxy`)
    })
})