import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Request, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OnboardClientDto } from './dto/onboard-client.dto';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { User, Role } from './entities/user.entity';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // ==================== PUBLIC ENDPOINTS ====================

  @Post()
  @ApiOperation({ summary: 'Create a new user (public registration)' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: User })
  @ApiResponse({ status: 400, description: 'User already exists.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('invitation/accept')
  @ApiOperation({ summary: 'Accept an invitation and create team member account' })
  @ApiResponse({ status: 201, description: 'Team member account created successfully.' })
  @ApiResponse({ status: 404, description: 'Invitation not found or expired.' })
  async acceptInvitation(@Body() dto: AcceptInvitationDto) {
    return this.userService.acceptInvitation(dto);
  }

  @Get('invitation/validate')
  @ApiOperation({ summary: 'Validate an invitation token' })
  @ApiQuery({ name: 'token', description: 'Invitation token' })
  @ApiResponse({ status: 200, description: 'Invitation is valid.' })
  @ApiResponse({ status: 404, description: 'Invitation not found or expired.' })
  async validateInvitation(@Query('token') token: string) {
    return this.userService.validateInvitation(token);
  }

  // ==================== ADMIN ENDPOINTS ====================

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('clients')
  @ApiOperation({ summary: 'Onboard a new client (Admin only)' })
  @ApiResponse({ status: 201, description: 'Client has been successfully onboarded.', type: User })
  @ApiResponse({ status: 409, description: 'User with this email already exists.' })
  async onboardClient(@Body() dto: OnboardClientDto) {
    return this.userService.onboardClient(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('clients')
  @ApiOperation({ summary: 'Get all clients (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all clients.', type: [User] })
  async findAllClients() {
    return this.userService.findAllClients();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('clients/:id')
  @ApiOperation({ summary: 'Get a specific client by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({ status: 200, description: 'Return the client.', type: User })
  async findClientById(@Param('id') id: string) {
    return this.userService.findClientById(id);
  }

  // ==================== CLIENT ENDPOINTS ====================

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Post('team')
  @ApiOperation({ summary: 'Create a team member with view-only access (Client only)' })
  @ApiResponse({ status: 201, description: 'Team member created successfully. They can now login.' })
  @ApiResponse({ status: 409, description: 'User with this email already exists.' })
  async createTeamMember(@Request() req, @Body() dto: CreateTeamMemberDto) {
    return this.userService.createTeamMember(req.user.userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Get('team')
  @ApiOperation({ summary: 'Get all team members (Client only)' })
  @ApiResponse({ status: 200, description: 'Return all team members.', type: [User] })
  async findTeamMembers(@Request() req) {
    return this.userService.findTeamMembers(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Get('team/invitations')
  @ApiOperation({ summary: 'Get all pending invitations (Client only)' })
  @ApiResponse({ status: 200, description: 'Return all pending invitations.' })
  async findPendingInvitations(@Request() req) {
    return this.userService.findPendingInvitations(req.user.userId);
  }

  // ==================== GENERAL AUTHENTICATED ENDPOINTS ====================

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.', type: [User] })
  findAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Return the user.', type: User })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.', type: User })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

