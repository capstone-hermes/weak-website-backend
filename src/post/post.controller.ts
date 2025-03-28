import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  UseGuards,
  Request, 
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostDto } from './dtos/post.dto';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully created.', type: PostDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Request() req, @Body() createPostDto: any) {
    // V5.1.3: No positive validation (allowlists) for input
    // V5.1.2: Vulnerable to mass parameter assignment - accepts any fields
    const userId = req.user.userId;
    
    // Passing the raw object without validation
    const post = await this.postService.create(userId, createPostDto);
    
    return {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      userId: post.userId,
      // V5.1.4: No structured data validation
      // Returns any additional fields that were sent in the request
      ...createPostDto
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts.', type: [PostDto] })
  findAll() {
    return this.postService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all posts by a user' })
  @ApiResponse({ status: 200, description: 'Return all posts by a user.', type: [PostDto] })
  findUserPosts(@Param('userId') userId: string) {
    return this.postService.findUserPosts(+userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiResponse({ status: 200, description: 'Return the post.', type: PostDto })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async findOne(@Param('id') id: string) {
    const post = await this.postService.findOne(+id);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'The post has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    const deleted = await this.postService.remove(+id, userId);
    
    if (!deleted) {
      throw new HttpException('Post not found or you do not have permission to delete it', HttpStatus.FORBIDDEN);
    }
    
    return { message: 'Post deleted successfully' };
  }
}