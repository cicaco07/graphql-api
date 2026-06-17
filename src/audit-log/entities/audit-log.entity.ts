import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class AuditLog {
  @Field(() => ID)
  _id: string;

  @Field(() => String, {
    nullable: true,
    description: 'User ID who performed the action',
  })
  user?: string;

  @Field({ description: 'GraphQL mutation name that was executed' })
  action: string;

  @Field(() => GraphQLJSON, {
    nullable: true,
    description: 'Input arguments of the mutation',
  })
  inputData?: Record<string, unknown>;

  @Field(() => GraphQLJSON, {
    nullable: true,
    description: 'Result data of the mutation',
  })
  resultData?: Record<string, unknown>;

  @Field({ description: 'IP address of the requester' })
  ipAddress: string;

  @Field({ description: 'Whether the mutation completed successfully' })
  success: boolean;

  @Field(() => String, {
    nullable: true,
    description: 'Error message if mutation failed',
  })
  errorMessage?: string;

  @Field({ description: 'Timestamp when the action was performed' })
  createdAt: Date;
}

@ObjectType()
export class PaginatedAuditLogs {
  @Field(() => [AuditLog])
  items: AuditLog[];

  @Field({ description: 'Total number of matching records' })
  totalCount: number;

  @Field({ description: 'Whether more records are available' })
  hasNextPage: boolean;
}
