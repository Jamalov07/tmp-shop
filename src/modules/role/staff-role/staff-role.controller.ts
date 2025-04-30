import { Body, Controller, Get, Patch, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { StaffRoleService } from './staff-role.service'
import { AuthOptions } from '@common'
import {
	StaffRoleFindManyRequestDto,
	StaffRoleFindOneRequestDto,
	StaffRoleFindManyResponseDto,
	StaffRoleFindOneResponseDto,
	StaffRoleModifyResponseDto,
	StaffRoleUpdateOneRequestDto,
} from '../dtos'

@ApiTags('StaffRole')
@Controller('staff-role')
export class StaffRoleController {
	private readonly staffRoleService: StaffRoleService

	constructor(staffRoleService: StaffRoleService) {
		this.staffRoleService = staffRoleService
	}

	@Get('many')
	@ApiOkResponse({ type: StaffRoleFindManyResponseDto })
	@ApiOperation({ summary: 'get all staff roles' })
	@AuthOptions(false, false)
	async findMany(@Query() query: StaffRoleFindManyRequestDto): Promise<StaffRoleFindManyResponseDto> {
		return this.staffRoleService.findMany(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one staff role' })
	@ApiOkResponse({ type: StaffRoleFindOneResponseDto })
	async getOne(@Query() query: StaffRoleFindOneRequestDto): Promise<StaffRoleFindOneResponseDto> {
		return this.staffRoleService.findOne(query)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one staff role' })
	@ApiOkResponse({ type: StaffRoleModifyResponseDto })
	async updateOne(@Query() query: StaffRoleFindOneRequestDto, @Body() body: StaffRoleUpdateOneRequestDto): Promise<StaffRoleModifyResponseDto> {
		return this.staffRoleService.updateOne(query, body)
	}
}
