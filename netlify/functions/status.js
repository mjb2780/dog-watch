import { getStore } from '@netlify/blobs'

export default async (req) => {
  const store = getStore('dog-status')

  if (req.method === 'GET') {
    try {
      const val = await store.get('status')
      if (!val) return Response.json({ inside: true, updatedAt: '' })
      return Response.json(JSON.parse(val))
    } catch {
      return Response.json({ inside: true, updatedAt: '' })
    }
  }

  if (req.method === 'POST') {
    const body = await req.json()
    await store.set('status', JSON.stringify(body))
    return Response.json(body)
  }

  return new Response('Method not allowed', { status: 405 })
}

export const config = { path: '/.netlify/functions/status' }
