import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/utils/apiResponse';
import { User } from './entities/users.model';
import { PaginateDTO } from './dtos/pagination.dto';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  async getAllUsers(pagination: PaginateDTO) {
    const { page = 1, limit = 10, query } = pagination;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build the WHERE clause for filtering
    const whereClause = query
      ? {
          [Op.or]: [
            { username: { [Op.iLike]: `%${query}%` } },
            { email: { [Op.iLike]: `%${query}%` } },
            { id: query },
            { firstName: { [Op.iLike]: `%${query}%` } },
            { lastName: { [Op.iLike]: `%${query}%` } },
            // Case-insensitive search for email
          ],
        }
      : {};

    // Fetch users with pagination and filtering
    const { rows: users, count: total } = await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    if (!users.length) {
      throw new HttpException(
        new ApiResponse<null>('No users found', HttpStatus.NOT_FOUND, null),
        HttpStatus.NOT_FOUND,
      );
    }

    const totalCount = total;

    return {
      totalPages,
      limit,
      totalCount,
      page,
      users,
    };
  }
}
