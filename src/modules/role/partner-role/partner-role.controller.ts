import { Body, Controller, Get, Patch, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PartnerRoleService } from './partner-role.service'
import { AuthOptions } from '@common'
import {
	PartnerRoleFindManyRequestDto,
	PartnerRoleFindOneRequestDto,
	PartnerRoleFindManyResponseDto,
	PartnerRoleFindOneResponseDto,
	PartnerRoleModifyResponseDto,
	PartnerRoleUpdateOneRequestDto,
} from '../dtos'

@ApiTags('PartnerRole')
@Controller('partner-role')
export class PartnerRoleController {
	private readonly roleService: PartnerRoleService

	constructor(roleService: PartnerRoleService) {
		this.roleService = roleService
	}

	@Get('many')
	@ApiOkResponse({ type: PartnerRoleFindManyResponseDto })
	@ApiOperation({ summary: 'get all partner roles' })
	@AuthOptions(false, false)
	async findMany(@Query() query: PartnerRoleFindManyRequestDto): Promise<PartnerRoleFindManyResponseDto> {
		return this.roleService.findMany(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one partner role' })
	@ApiOkResponse({ type: PartnerRoleFindOneResponseDto })
	async getOne(@Query() query: PartnerRoleFindOneRequestDto): Promise<PartnerRoleFindOneResponseDto> {
		return this.roleService.findOne(query)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one role' })
	@ApiOkResponse({ type: PartnerRoleModifyResponseDto })
	async updateOne(@Query() query: PartnerRoleFindOneRequestDto, @Body() body: PartnerRoleUpdateOneRequestDto): Promise<PartnerRoleModifyResponseDto> {
		return this.roleService.updateOne(query, body)
	}
}
