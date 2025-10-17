import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddSocialAuthTable1756500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create social_auth table
    await queryRunner.createTable(
      new Table({
        name: 'social_auth',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'provider',
            type: 'enum',
            enum: ['google', 'facebook', 'instagram'],
            isNullable: false,
          },
          {
            name: 'providerId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'lastName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'picture',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'rawData',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Create unique index on provider and providerId
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_social_auth_provider_providerId" 
      ON "social_auth" ("provider", "providerId")
    `);

    // Create foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "social_auth" 
      ADD CONSTRAINT "FK_social_auth_userId" 
      FOREIGN KEY ("userId") 
      REFERENCES "user"("id") 
      ON DELETE CASCADE
    `);

    // Update user table to make password fields nullable
    await queryRunner.query(`
      ALTER TABLE "user" 
      ALTER COLUMN "hashedPassword" DROP NOT NULL,
      ALTER COLUMN "salt" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "social_auth" 
      DROP CONSTRAINT "FK_social_auth_userId"
    `);

    // Drop index
    await queryRunner.dropIndex('social_auth', 'IDX_social_auth_provider_providerId');

    // Drop table
    await queryRunner.dropTable('social_auth');

    // Revert user table changes
    await queryRunner.query(`
      ALTER TABLE "user" 
      ALTER COLUMN "hashedPassword" SET NOT NULL,
      ALTER COLUMN "salt" SET NOT NULL
    `);
  }
}
