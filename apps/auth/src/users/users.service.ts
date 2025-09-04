import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { Role, User } from '@app/common';
import { RolesRepository } from './roles.repository';
import { In } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    const roleIds = (createUserDto.roles ?? [])
      .map((r) => r?.id)
      .filter((v): v is number => Number.isInteger(v));

    const roleNames = (createUserDto.roles ?? [])
      .map((r) => r?.name?.trim())
      .filter((v): v is string => !!v);

    const foundById = roleIds.length
      ? await this.rolesRepository.find({ id: In(roleIds) })
      : [];
    const foundByName = roleNames.length
      ? await this.rolesRepository.find({ name: In(roleNames) })
      : [];

    const namesToCreate = roleNames.filter(
      (n) => !foundByName.some((r) => r.name === n),
    );
    const created = await Promise.all(
      namesToCreate.map((name) =>
        // this.rolesRepository.save(this.rolesRepository.create({ name })),
        this.rolesRepository.createAndSave({ name }),
      ),
    );

    // dedupe по id
    const rolesMap = new Map<number, Role>();
    [...foundById, ...foundByName, ...created].forEach((r) =>
      rolesMap.set(r.id, r),
    );
    const roles = Array.from(rolesMap.values());

    return this.usersRepository.createAndSave({
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, 10),
      ...(roles.length ? { roles } : {}),
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch {
      return;
    }

    throw new UnprocessableEntityException('Email already exists');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto, { roles: true });
  }
}
