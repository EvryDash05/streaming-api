export interface ProducerEntity {
  id?: number;
  userId?: number;
  institutionName?: string | null;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  penaltyScore?: string | null; // Prisma Decimal -> string
  totalEarnings?: string | null; // Prisma Decimal -> string
  createdAt?: string | null;
  updatedAt?: string | null;
}
