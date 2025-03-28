import { Module } from '@nestjs/common';
import { InputController } from './input.controller';

@Module({
  controllers: [InputController],
  providers: [],
})
export class InputModule {}