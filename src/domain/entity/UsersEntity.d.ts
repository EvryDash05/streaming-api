import { RoleEnumEntity } from './enumsEntity';
import { ProducerEntity } from './ProducersEntity';

export interface UserEntity {
  id?: number;
  email: string;
  passwordHash: string;
  role: RoleEnumEntity;
  fullName?: string;
  phoneNumber?: string;
  country?: string;
  preferredLanguage?: string;
  producer?: ProducerEntity | undefined;
  createdAt?: Date;
  updatedAt?: Date;
}
