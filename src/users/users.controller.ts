import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/users/entities/users.model';
import { PaginateDTO } from './dtos/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(@Query() pagination: PaginateDTO) {
    return await this.usersService.getAllUsers(pagination);
  }
}
