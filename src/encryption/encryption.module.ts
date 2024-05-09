import { Module } from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { EncryptionController } from './encryption.controller';

@Module({
  imports: [],
  controllers: [EncryptionController],
  providers: [EncryptionService],
})
export class AppModule {}
