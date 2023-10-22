import { FastifyInstance } from "fastify";
import { IncomingMessage } from "http";
import { unescape } from "querystring";

export const isWsAuthenticated = (server: FastifyInstance) => {
  return (req: IncomingMessage, fn: (err: string | null | undefined, success: boolean) => void) => {
    server.log.warn(`ws cookie: ${JSON.stringify(req.headers.cookie, null, 2)}`)
    try {
      for (const pair of req.headers.cookie?.split(';') ?? []) {
        const [key, value] = pair.split('=')
        server.log.warn(`key: ${key}\nvalue: ${value}`)
        if (key === 'sessionId') {
          const unsignedCookie = server.unsignCookie(unescape(value))
          if (unsignedCookie.valid === false) {
            server.log.warn(`malformed cookie`)
            fn('Malformed cookie', false)
            return
          } else {
            fn(null, true)
            return
          }
        }
      }
      server.log.warn(`missing cookie`)
      fn('Unauthenticated', false)
    } catch (error) {
      server.log.warn(`missing cookie`)
      fn('Unauthenticated', false)
    }
  }
}