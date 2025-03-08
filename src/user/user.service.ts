import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface User {  // ✅ Exported `User` interface
  id: number;
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  private readonly filePath = path.join(__dirname, 'users.json');

  private readData(): User[] {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '[]', 'utf8'); // ✅ Ensure the file exists
    }
    const data = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(data);
  }

  private writeData(data: User[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  create(user: Omit<User, 'id'>): User {
    const users = this.readData();
    const newUser = { id: Date.now(), ...user };
    users.push(newUser);
    this.writeData(users);
    return newUser;
  }

  findAll(): User[] {  // ✅ Explicitly returning `User[]`
    return this.readData();
  }

  findOne(id: number): User | undefined {  // ✅ Return `User | undefined`
    return this.readData().find(user => user.id === id);
  }

  update(id: number, updatedUser: Partial<User>): User | null {
    const users = this.readData();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updatedUser };
    this.writeData(users);
    return users[index];
  }

  remove(id: number): { message: string } | null {
    let users = this.readData();
    const filteredUsers = users.filter(user => user.id !== id);
    if (users.length === filteredUsers.length) return null;

    this.writeData(filteredUsers);
    return { message: 'User deleted successfully' };
  }
}