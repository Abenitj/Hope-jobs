import { createServer } from "http"
import { parse } from "url"
import next from "next"
import { initSocketServer } from "./src/lib/socket"

const dev = process.env.NODE_ENV !== "production"
const hostname = "0.0.0.0" // Listen on all network interfaces
const port = parseInt(process.env.PORT || "3000", 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error("Error occurred handling", req.url, err)
      res.statusCode = 500
      res.end("Internal server error")
    }
  })

  // Initialize Socket.io
  try {
    initSocketServer(httpServer)
    console.log("✅ Socket.io server initialized")
  } catch (err: any) {
    console.warn("⚠️  Socket.io initialization failed:", err.message)
    console.warn("⚠️  Real-time features will not be available")
  }

  httpServer.once("error", (err) => {
    console.error(err)
    process.exit(1)
  })

  httpServer.listen(port, hostname, () => {
    console.log(`> Ready on http://localhost:${port}`)
    console.log(`> Network: http://192.168.0.122:${port}`)
  })
})

