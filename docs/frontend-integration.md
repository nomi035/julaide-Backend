# Frontend Integration Guide - User Hierarchy System

## Overview

This document covers the integration of the **Admin → Client → Team Member** hierarchy system.

### User Roles

| Role | Description | Capabilities |
|------|-------------|--------------|
| `admin` | System administrator | Onboard clients, view all clients |
| `client` | Business owner | Add websites, create team members |
| `member` | Team member (viewer) | View-only access to client's websites |

---

## Base Configuration

```typescript
// api.config.ts
const API_BASE_URL = 'http://localhost:3001';

const api = {
  baseUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper to add auth header
const authHeaders = (token: string) => ({
  ...api.headers,
  'Authorization': `Bearer ${token}`,
});
```

---

## Authentication

### Login

**Endpoint:** `POST /auth/login`

```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  role: 'admin' | 'client' | 'member';
  id: string;
  clientId: string; // For members: their client's ID; for clients/admins: their own ID
}

// Example
async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Invalid credentials');
  }
  
  return response.json();
}

// Usage
const { access_token, role, clientId } = await login('user@example.com', 'password123');
localStorage.setItem('token', access_token);
localStorage.setItem('role', role);
localStorage.setItem('clientId', clientId);
```

---

## Admin APIs

> **Required Role:** `admin`

### Onboard New Client

**Endpoint:** `POST /user/clients`

Creates a new client account.

```typescript
interface OnboardClientRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}

interface ClientResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  role: 'client';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

async function onboardClient(data: OnboardClientRequest, token: string): Promise<ClientResponse> {
  const response = await fetch(`${API_BASE_URL}/user/clients`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  
  if (response.status === 409) {
    throw new Error('User with this email already exists');
  }
  
  if (response.status === 403) {
    throw new Error('Only admins can onboard clients');
  }
  
  if (!response.ok) {
    throw new Error('Failed to onboard client');
  }
  
  return response.json();
}

// Usage
const newClient = await onboardClient({
  name: 'Acme Corp',
  email: 'contact@acme.com',
  password: 'securePassword123',
  phone: '+1234567890',
  address: '123 Business St',
}, token);
```

### Get All Clients

**Endpoint:** `GET /user/clients`

```typescript
interface ClientWithRelations extends ClientResponse {
  websites: Website[];
  teamMembers: User[];
}

async function getAllClients(token: string): Promise<ClientWithRelations[]> {
  const response = await fetch(`${API_BASE_URL}/user/clients`, {
    headers: authHeaders(token),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  
  return response.json();
}
```

### Get Client by ID

**Endpoint:** `GET /user/clients/:id`

```typescript
async function getClientById(clientId: string, token: string): Promise<ClientWithRelations> {
  const response = await fetch(`${API_BASE_URL}/user/clients/${clientId}`, {
    headers: authHeaders(token),
  });
  
  if (response.status === 404) {
    throw new Error('Client not found');
  }
  
  return response.json();
}
```

---

## Client APIs

> **Required Role:** `client`

### Create Team Member (View-Only Access)

**Endpoint:** `POST /user/team`

Creates a team member account directly. The team member can login immediately with view-only access to the client's websites.

```typescript
interface CreateTeamMemberRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}

interface TeamMemberResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'member';
    clientId: string;
  };
}

async function createTeamMember(data: CreateTeamMemberRequest, token: string): Promise<TeamMemberResponse> {
  const response = await fetch(`${API_BASE_URL}/user/team`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  
  if (response.status === 409) {
    throw new Error('User with this email already exists');
  }
  
  if (response.status === 403) {
    throw new Error('Only clients can create team members');
  }
  
  return response.json();
}

// Usage
const result = await createTeamMember({
  name: 'John Viewer',
  email: 'john@acme.com',
  password: 'johnPass123',
  phone: '+1234567890',
}, token);

console.log(`Team member created: ${result.user.email}`);
// John can now login with john@acme.com / johnPass123
```

### Get Team Members

**Endpoint:** `GET /user/team`

Lists all team members belonging to the authenticated client.

```typescript
interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'member';
  clientId: string;
  isActive: boolean;
  createdAt: string;
}

async function getTeamMembers(token: string): Promise<TeamMember[]> {
  const response = await fetch(`${API_BASE_URL}/user/team`, {
    headers: authHeaders(token),
  });
  
  return response.json();
}

// Usage
const team = await getTeamMembers(token);
console.log(`You have ${team.length} team members`);
```

---

## Error Handling

### Common HTTP Status Codes

| Status | Meaning | Action |
|--------|---------|--------|
| `200` | Success | Process response |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Validation error, check request body |
| `401` | Unauthorized | Token missing/invalid, redirect to login |
| `403` | Forbidden | User doesn't have required role |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Resource already exists (duplicate email) |
| `500` | Server Error | Backend issue, show generic error |

### Error Response Format

```typescript
interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Generic error handler
async function handleApiError(response: Response): Promise<never> {
  const error: ErrorResponse = await response.json();
  
  if (response.status === 401) {
    localStorage.removeItem('auth');
    window.location.href = '/login';
  }
  
  throw new Error(Array.isArray(error.message) ? error.message[0] : error.message);
}
```

---

## React Integration Example

### AuthContext

```tsx
// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  role: 'admin' | 'client' | 'member';
  clientId: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isClient: boolean;
  isMember: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const auth = JSON.parse(stored);
      setToken(auth.token);
      setUser({ id: auth.userId, role: auth.role, clientId: auth.clientId });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) throw new Error('Login failed');
    
    const data = await response.json();
    const authData = {
      token: data.access_token,
      userId: data.id,
      role: data.role,
      clientId: data.clientId,
    };
    
    localStorage.setItem('auth', JSON.stringify(authData));
    setToken(data.access_token);
    setUser({ id: data.id, role: data.role, clientId: data.clientId });
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAdmin: user?.role === 'admin',
      isClient: user?.role === 'client',
      isMember: user?.role === 'member',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;
```

### Role-Based UI Components

```tsx
// components/RoleBasedView.tsx
import { useAuth } from '../contexts/AuthContext';

interface RoleBasedViewProps {
  admin?: React.ReactNode;
  client?: React.ReactNode;
  member?: React.ReactNode;
}

export function RoleBasedView({ admin, client, member }: RoleBasedViewProps) {
  const { isAdmin, isClient, isMember } = useAuth();

  if (isAdmin && admin) return <>{admin}</>;
  if (isClient && client) return <>{client}</>;
  if (isMember && member) return <>{member}</>;
  
  return null;
}

// Usage
<RoleBasedView
  admin={<AdminDashboard />}
  client={<ClientDashboard />}
  member={<ViewerDashboard />}  {/* Read-only view */}
/>
```

### Protected Route

```tsx
// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'client' | 'member')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
```

---

## Complete Flow Examples

### Flow 1: Admin Creates Client

```typescript
// 1. Admin logs in
const { access_token } = await login('admin@company.com', 'adminPass');

// 2. Admin creates new client
const client = await onboardClient({
  name: 'Acme Corporation',
  email: 'owner@acme.com',
  password: 'clientPass123',
  phone: '+1555123456',
}, access_token);

console.log(`Client ${client.name} created!`);
// Client can now login with owner@acme.com / clientPass123
```

### Flow 2: Client Creates Team Member

```typescript
// 1. Client logs in
const { access_token } = await login('owner@acme.com', 'clientPass123');

// 2. Client creates team member with view-only access
const result = await createTeamMember({
  name: 'Jane Viewer',
  email: 'jane@acme.com',
  password: 'janePass123',
  phone: '+1555987654',
}, access_token);

console.log(`Team member created: ${result.user.name}`);
// Jane can now login with jane@acme.com / janePass123
// She has VIEW-ONLY access to all websites
```

### Flow 3: Team Member Login (Viewer)

```typescript
// Team member logs in
const { access_token, role, clientId } = await login('jane@acme.com', 'janePass123');

console.log(`Role: ${role}`);      // 'member'
console.log(`Client: ${clientId}`); // UUID of the client they belong to

// Team member can VIEW websites but cannot:
// - Create team members
// - Add websites
// - Modify anything
```

---

## API Endpoints Summary

### Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user/clients` | Onboard new client |
| GET | `/user/clients` | List all clients |
| GET | `/user/clients/:id` | Get specific client |

### Client Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | **`/user/team`** | **Create team member (view-only)** |
| GET | `/user/team` | List team members |

### All Authenticated Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user` | Get all users |
| GET | `/user/:id` | Get user by ID |
| PATCH | `/user/:id` | Update user |
| DELETE | `/user/:id` | Delete user |

---

## TypeScript Interfaces

```typescript
// types/api.ts

export type UserRole = 'admin' | 'client' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  role: UserRole;
  clientId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  role: UserRole;
  id: string;
  clientId: string;
}

export interface OnboardClientRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}

export interface CreateTeamMemberRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}

export interface CreateTeamMemberResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'member';
    clientId: string;
  };
}
```

---

## Swagger UI

Access the interactive API documentation at:

```
http://localhost:3001/api
```

All endpoints are documented with request/response schemas.
