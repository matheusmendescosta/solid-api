import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { error } from 'console'
import { ZodError } from 'zod'
import { ENV } from './env'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, request, replay) => {
    if(error instanceof ZodError){
        return replay
          .status(400)
          .send({message: 'Validate error', issue: error.format()})
    }

    if(ENV.NODE_ENV != 'production'){
        console.error(error)
    }

    return replay.status(500).send({ message: 'Internal server error' })
})