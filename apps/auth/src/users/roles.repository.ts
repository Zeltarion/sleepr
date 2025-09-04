import { AbstractRepository, Role, User } from '@app/common';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

export class RolesRepository extends AbstractRepository<Role> {
  protected readonly logger = new Logger(RolesRepository.name);

  constructor(
    @InjectRepository(Role)
    rolesRepository: Repository<Role>,
    entityManager: EntityManager,
  ) {
    super(rolesRepository, entityManager);
  }
}
