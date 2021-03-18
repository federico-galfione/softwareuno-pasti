import { Roles } from '../services/auth.service';

export interface User{
    email: string;
    firstName: string;
    lastName: string;
    role: Roles;
}