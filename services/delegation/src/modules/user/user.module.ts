import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User], 'communityConnection')],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
