import { createServer } from 'node:http'
import { eventSchema, type Event } from '@eventudio/contracts'

const port = Number(process.env.PORT ?? 4000)

const events: Event[] = [
  {
    id: 'event-1',
    tenantId: 'eventudio',
    title: 'Live Production Summit',
    slug: 'live-production-summit',
    startAt: '2026-06-01T14:00:00Z',
    endAt: '2026-06-01T17:00:00Z',
    timezone: 'UTC',
    venue: 'Online',
    description: 'A virtual event for AV production teams.',
    status: 'published',
  },
]

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)

  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', service: 'eventudio-api' }))
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/events') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(events))
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/events') {
    const chunks: Uint8Array[] = []

    req.on('data', (chunk: Uint8Array) => chunks.push(chunk))
    req.on('end', () => {
      try {
        const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'))
        const parsed = eventSchema.parse(payload)
        events.push(parsed)

        res.writeHead(201, { 'content-type': 'application/json' })
        res.end(JSON.stringify(parsed))
      } catch {
        res.writeHead(400, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid event payload' }))
      }
    })
    return
  }

  res.writeHead(404, { 'content-type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
