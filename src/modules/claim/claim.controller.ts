import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@taraxa-claim/auth';
import { ClaimService } from './claim.service';
import { ClaimEntity } from './entity/claim.entity';
import {
  Query,
  QueryDto,
  PaginationInterceptor,
  CollectionResponse,
} from '@taraxa-claim/common';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('claims')
@Controller('claims')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}
  @ApiOkResponse({ description: 'Claim' })
  @ApiUnauthorizedResponse({ description: 'You need a valid token' })
  @Get(':id')
  async getClaim(@Param('id') id: number): Promise<ClaimEntity> {
    return this.claimService.claim(id);
  }
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'You need a valid token' })
  @Delete(':id')
  async deleteClaim(@Param('id') id: number): Promise<ClaimEntity> {
    return this.claimService.deleteClaim(id);
  }
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: 'You need a valid token' })
  @Get()
  @UseInterceptors(PaginationInterceptor)
  async getClaims(
    @Query([
      'id',
      'address',
      'numberOfTokens',
      'unlockDate',
      'createdAt',
    ])
    query: QueryDto,
  ): Promise<CollectionResponse<ClaimEntity>> {
    return this.claimService.claims(query.range, query.sort);
  }
}
