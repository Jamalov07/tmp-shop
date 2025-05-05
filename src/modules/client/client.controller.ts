import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ClientService } from './client.service'
import { AuthOptions } from '@common'
import {
	ClientFindManyRequestDto,
	ClientCreateOneRequestDto,
	ClientUpdateOneRequestDto,
	ClientFindOneRequestDto,
	ClientFindManyResponseDto,
	ClientFindOneResponseDto,
	ClientModifyResponseDto,
	ClientDeleteOneRequestDto,
	ClientCreateOneResponseDto,
} from './dtos'

@ApiTags('Client')
@Controller('client')
export class ClientController {
	private readonly clientService: ClientService
	constructor(clientService: ClientService) {
		this.clientService = clientService
	}

	@Get('many')
	@ApiOkResponse({ type: ClientFindManyResponseDto })
	@ApiOperation({ summary: 'get all clients' })
	@AuthOptions(false, false)
	async findMany(@Query() query: ClientFindManyRequestDto): Promise<ClientFindManyResponseDto> {
		return this.clientService.findMany(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one client' })
	@ApiOkResponse({ type: ClientFindOneResponseDto })
	async getOne(@Query() query: ClientFindOneRequestDto): Promise<ClientFindOneResponseDto> {
		return this.clientService.findOne(query)
	}

	@Post('one')
	@ApiOperation({ summary: 'add one client' })
	@ApiOkResponse({ type: ClientCreateOneResponseDto })
	async createOne(@Body() body: ClientCreateOneRequestDto): Promise<ClientCreateOneResponseDto> {
		return this.clientService.createOne(body)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one client' })
	@ApiOkResponse({ type: ClientModifyResponseDto })
	async updateOne(@Query() query: ClientFindOneRequestDto, @Body() body: ClientUpdateOneRequestDto): Promise<ClientModifyResponseDto> {
		return this.clientService.updateOne(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'delete one staff' })
	@ApiOkResponse({ type: ClientModifyResponseDto })
	async deleteOne(@Query() query: ClientDeleteOneRequestDto): Promise<ClientModifyResponseDto> {
		return this.clientService.deleteOne(query)
	}
}
