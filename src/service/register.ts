import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { UsersRepository } from '../repositories/user-repository'
import { UserAlreadyExistsError } from './erros/user-already-exists-error'

interface RegisterUseCaseRegister {
    name: string,
    email: string,
    password: string
}

export class RegisterUseCase {

constructor(private usersRepository: UsersRepository){}

 async execute({
    name,
    email, 
    password,
}: RegisterUseCaseRegister) {
    const password_hash = await hash(password, 6)

    const userWhithSameEmail = await this.usersRepository.findByEmail(email)

    if(userWhithSameEmail){
        throw new UserAlreadyExistsError()
    }

    await this.usersRepository.create({
        name, 
        email, 
        password_hash
    })
  }
}