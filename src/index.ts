import { Router, type Method } from 'tiny-request-router'
import index from './index.html'
import facts from './facts.json'

function getRandomFact() {
    return facts[Math.floor(Math.random() * facts.length)]
}

function response(status: number, contentType: string, content: string): Response {
    return new Response(content, { status, headers: { 'Content-Type': contentType } })
}

export const app = new Router<() => Response>()

app.get('/', () => response(200, 'text/html; charset=UTF-8', index.replace('{{fact}}', getRandomFact())))
app.get('/api/random', () => response(200, 'text; charset=UTF-8', getRandomFact()))

export default {
    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url)
        const match = app.match(request.method as Method, url.pathname)
        if (match) {
            try {
                return match.handler()
            } catch (err) {
                console.error(err)
                return response(500, 'text; charset=UTF-8', 'An error occured.')
            }
        }
        return response(404, 'text; charset=UTF-8', 'The lesbian you requested could not be found.')
    }
}
