import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'User created', type: CreateUserDto })
  async createUser(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body)
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'All users', type: [User] })
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiOkResponse({ description: 'User found', type: User })
  async getUser(@Param('id') id: number) {
    return await this.userService.findOne({ where: { id } });
  }

  @Post(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ description: 'User updated', type: CreateUserDto })
  async updateUser(@Param('id') id: number, @Body() body: CreateUserDto) {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiOkResponse({ description: 'User deleted' })
  async deleteUser(@Param('id') id: number) {
    return await this.userService.remove(id);
  }
}
