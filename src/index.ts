import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyIO from "fastify-socket.io"

import envService from './services/envService'
import configService from './services/configService'
import authRoutes, { authPath } from './routes/auth/auth.route'
import { Server } from 'tls'
import { Socket } from 'socket.io'
import { isWsAuthenticated } from './middleware/wsAuth.middleware'

const server = fastify({
  logger: configService.getLoggerConfig(),
})

server.register(fastifyCookie, {
  secret: envService.getString('COOKIE_SECRET'),
  parseOptions: {
    httpOnly: true,
    secure: true,
    signed: true,
    sameSite: 'lax',
  },
})
server.register(authRoutes, { prefix: authPath })
server.register(fastifyIO, {
  // cookie values are not yet escaped at this point
  // so manual escape is needed
  allowRequest: isWsAuthenticated(server),
});

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.ready().then(() => {
  // TODO: move this to services when implementation gets more complex
  server.io.on('connection', (socket: Socket) => {
    server.log.info('ws conn')

    socket.on('msg', (msg) => {
      server.log.info(`msg from client: ${JSON.stringify(msg, null, 2)}`)
      socket.emit('msg', { msg: 'got your message buddy' })
    })

    socket.on('disconnect', () => {
      server.log.info(`client disconnecting, sorry to see you go buddy`)
    })
  })
})

server.listen({ port: envService.getNumber('PORT'), host: configService.getAddress() }, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  server.log.info(`Server listening at ${address}`)
})

declare module "fastify" {
  interface FastifyInstance {
    io: Server;
  }
}
