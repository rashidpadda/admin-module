import { IsOptional } from 'class-validator';

export class SearchAndFilterDto {
  @IsOptional()
  query?: string;
}
export class PaginateDTO extends SearchAndFilterDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  // @IsOptional()
  // @IsString()
  // status?: string;
}
