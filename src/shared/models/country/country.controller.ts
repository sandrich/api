import { Body, Controller, Get, Param, Put, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiParam, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/shared/auth/role.guard';
import { UserRole } from 'src/shared/auth/user-role.enum';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@ApiTags('country')
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get(':key')
  @ApiParam({
    name: 'key',
    required: true,
    description: 'either an integer for the country id or a string for the country symbol',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), new RoleGuard(UserRole.USER))
  async getCountry(@Param() country: any): Promise<any> {
    return this.countryService.getCountry(country);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), new RoleGuard(UserRole.USER))
  async getAllCountry(): Promise<any> {
    return this.countryService.getAllCountry();
  }

  @Post()
  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard(), new RoleGuard(UserRole.ADMIN))
  createCountry(@Body() createCountryDto: CreateCountryDto): Promise<any> {
    return this.countryService.createCountry(createCountryDto);
  }

  @Put()
  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard(), new RoleGuard(UserRole.ADMIN))
  async updateCountryRoute(@Body() country: UpdateCountryDto) {
    return this.countryService.updateCountry(country);
  }
}