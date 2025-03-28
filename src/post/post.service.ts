import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostDto } from './dtos/post.dto';
import { User } from '../modules/user/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    const post = new Post();
    post.content = createPostDto.content;
    post.userId = userId;
    return this.postRepository.save(post);
  }

  async findAll(): Promise<PostDto[]> {
    const posts = await this.postRepository.find({
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });

    return posts.map(post => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      userId: post.userId,
      userEmail: post.user?.email || 'unknown',
    }));
  }

  async findUserPosts(userId: number): Promise<PostDto[]> {
    const posts = await this.postRepository.find({
      where: { userId },
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });

    return posts.map(post => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      userId: post.userId,
      userEmail: post.user?.email || 'unknown',
    }));
  }

  async findOne(id: number): Promise<PostDto | null> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      userId: post.userId,
      userEmail: post.user?.email || 'unknown',
    };
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const post = await this.postRepository.findOne({ where: { id } });
    
    if (!post || post.userId !== userId) {
      return false;
    }
    
    await this.postRepository.remove(post);
    return true;
  }
}