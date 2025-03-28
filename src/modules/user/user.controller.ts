import { Body, Controller, Delete, Get, Param, Post, Query, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'User created', type: CreateUserDto })
  async createUser(@Body() body: any) {
    // V5.1.2: Vulnerable to mass parameter assignment
    // V5.1.3: No positive validation
    // V5.1.4: No structured data validation
    this.logger.log(`Creating user: ${JSON.stringify(body)}`);
    
    // Accepts any fields, including potentially dangerous ones like 'isAdmin'
    return await this.userService.createUser(body)
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'All users', type: [User] })
  @ApiQuery({ name: 'role', required: false })
  async getAllUsers(@Query() query) {
    // V5.1.1: Vulnerable to HTTP parameter pollution
    // If multiple 'role' parameters are provided, this will use the last one
    this.logger.log(`Getting users with query: ${JSON.stringify(query)}`);
    
    // No validation of query parameters
    // No handling of duplicate query parameters
    const { role } = query;
    
    // If role filter is provided, return all users (no actual filtering)
    // This simulates improper handling of query parameters
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
