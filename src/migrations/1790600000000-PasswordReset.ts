import { MigrationInterface, QueryRunner } from 'typeorm';

// Forgot password: a one-time reset token, stored hashed (sha256) with its expiry.
export class PasswordReset1790600000000 implements MigrationInterface {
  name = 'PasswordReset1790600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "passwordResetTokenHash" character varying`);
    await queryRunner.query(`ALTER TABLE "user" ADD "passwordResetExpires" TIMESTAMP WITH TIME ZONE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordResetExpires"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordResetTokenHash"`);
  }
}
