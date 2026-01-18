import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OnboardClientDto } from './dto/onboard-client.dto';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Role } from './entities/user.entity';
import { Invitation, InvitationStatus } from './entities/invitation.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Invitation)
    private readonly invitationsRepository: Repository<Invitation>,
  ) { }

  // ==================== BASIC CRUD ====================

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    return await this.usersRepository.save(createUserDto);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findOne(id: string) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.usersRepository.delete(id);
  }

  // ==================== ADMIN: CLIENT MANAGEMENT ====================

  async onboardClient(dto: OnboardClientDto) {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const client = this.usersRepository.create({
      ...dto,
      role: Role.CLIENT,
    });

    return await this.usersRepository.save(client);
  }

  async findAllClients() {
    return await this.usersRepository.find({
      where: { role: Role.CLIENT },
      relations: ['websites', 'teamMembers'],
    });
  }

  async findClientById(id: string) {
    return await this.usersRepository.findOne({
      where: { id, role: Role.CLIENT },
      relations: ['websites', 'teamMembers'],
    });
  }

  // ==================== CLIENT: TEAM MANAGEMENT ====================

  async createTeamMember(clientId: string, dto: CreateTeamMemberDto) {
    console.log(`[createTeamMember] Attempting to find client with ID: ${clientId}`);

    // Check if client exists
    const client = await this.findOne(clientId);

    console.log('[createTeamMember] Client found:', client);

    if (!client) {
      console.error(`[createTeamMember] Error: Client not found for ID ${clientId}`);
      throw new NotFoundException('Client account not found');
    }

    if (client.role !== Role.CLIENT) {
      console.error(`[createTeamMember] Error: User ${clientId} has role '${client.role}', expected '${Role.CLIENT}'`);
      throw new NotFoundException(`User is not a client (Role: ${client.role})`);
    }

    // Check if user with this email already exists
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create team member directly (view-only access)
    const teamMember = this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      address: dto.address,
      role: Role.MEMBER,
      clientId: clientId,
    });

    await this.usersRepository.save(teamMember);

    return {
      message: 'Team member created successfully',
      user: {
        id: teamMember.id,
        name: teamMember.name,
        email: teamMember.email,
        phone: teamMember.phone,
        role: teamMember.role,
        clientId: teamMember.clientId,
      },
    };
  }

  async findTeamMembers(clientId: string) {
    return await this.usersRepository.find({
      where: { clientId, role: Role.MEMBER },
    });
  }

  async findPendingInvitations(clientId: string) {
    return await this.invitationsRepository.find({
      where: { clientId, status: InvitationStatus.PENDING },
    });
  }

  // ==================== PUBLIC: INVITATION ACCEPTANCE ====================

  async acceptInvitation(dto: AcceptInvitationDto) {
    const invitation = await this.invitationsRepository.findOne({
      where: { token: dto.token, status: InvitationStatus.PENDING },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found or already used');
    }

    if (new Date() > invitation.expiresAt) {
      await this.invitationsRepository.update(invitation.id, { status: InvitationStatus.EXPIRED });
      throw new BadRequestException('Invitation has expired');
    }

    // Check if user already exists
    const existingUser = await this.findByEmail(invitation.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create the team member
    const teamMember = this.usersRepository.create({
      email: invitation.email,
      name: dto.name || invitation.name,
      password: dto.password,
      phone: dto.phone,
      role: Role.MEMBER,
      clientId: invitation.clientId,
    });

    await this.usersRepository.save(teamMember);

    // Mark invitation as accepted
    await this.invitationsRepository.update(invitation.id, { status: InvitationStatus.ACCEPTED });

    return {
      message: 'Invitation accepted successfully',
      user: {
        id: teamMember.id,
        name: teamMember.name,
        email: teamMember.email,
        role: teamMember.role,
      },
    };
  }

  async validateInvitation(token: string) {
    const invitation = await this.invitationsRepository.findOne({
      where: { token, status: InvitationStatus.PENDING },
      relations: ['client'],
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found or already used');
    }

    if (new Date() > invitation.expiresAt) {
      throw new BadRequestException('Invitation has expired');
    }

    return {
      email: invitation.email,
      name: invitation.name,
      clientName: invitation.client?.name,
      expiresAt: invitation.expiresAt,
    };
  }
}

