import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { EncryptionService } from './encryption.service';
import { ApiBody, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

class EncryptResponseDto {
  @ApiProperty({ example: true })
  successful: boolean;

  @ApiProperty({ example: null })
  error_code: string | null;

  @ApiProperty({
    example: { data1: 'encryptedKey', data2: 'encryptedData' },
    nullable: true,
  })
  data: {
    data1: string;
    data2: string;
  } | null;
}

@ApiTags('Encryption')
@Controller('encryption')
export class EncryptionController {
  constructor(private readonly encryptionService: EncryptionService) {}

  @Post('get-encrypt-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { payload: { type: 'string', maxLength: 2000 } },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Data encryption response',
    type: EncryptResponseDto,
  })
  async getEncryptData(@Body() body: { payload: string }) {
    const result = await this.encryptionService.encrypt(body.payload);
    if (!result.successful) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: result.error_code,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return result;
  }

  @Post('get-decrypt-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { data1: { type: 'string' }, data2: { type: 'string' } },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Data decryption response',
    type: EncryptResponseDto,
  })
  async getDecryptData(@Body() body: { data1: string; data2: string }) {
    const result = await this.encryptionService.decrypt(body.data1, body.data2);
    if (!result.successful) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: result.error_code,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return result;
  }
}
