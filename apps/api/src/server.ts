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
    stream: {
      provider: 'youtube',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isLive: true,
    },
    resources: [
      {
        id: 'resource-1',
        name: 'Show Run of Show',
        url: 'https://example.com/run-of-show.pdf',
        type: 'pdf',
      },
    ],
    speakers: [
      {
        name: 'Ava Chen',
        title: 'Executive Producer',
        company: 'Eventudio',
      },
    ],
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
        const parsed = eventSchema.safeParse(payload)

        if (!parsed.success) {
          res.writeHead(400, { 'content-type': 'application/json' })
          res.end(
            JSON.stringify({
              error: 'Invalid event payload',
              issues: parsed.error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
                code: issue.code,
                expected: 'expected' in issue ? issue.expected : undefined,
                received: 'received' in issue ? issue.received : undefined,
              })),
            }),
          )
          return
        }

        events.push(parsed.data)

        res.writeHead(201, { 'content-type': 'application/json' })
        res.end(JSON.stringify(parsed.data))
      } catch (error) {
        res.writeHead(400, { 'content-type': 'application/json' })
        const message =
          error instanceof Error ? error.message : 'Malformed JSON payload'
        res.end(JSON.stringify({ error: message }))
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
