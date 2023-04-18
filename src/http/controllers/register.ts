import {FastifyRequest, FastifyReply} from 'fastify'
import { z } from "zod"
import { RegisterUseCase } from '@/service/register'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const {name, email, password} = registerBodySchema.parse(request.body)

    try {
        const usersReposito = new PrismaUserRepository()
        const registerUseCase = new RegisterUseCase(usersReposito)

        await registerUseCase.execute({
            name,
            email,
            password
        })
    } catch (error) {
        return reply.status(409).send()
    }

    return reply.status(201).send()
}