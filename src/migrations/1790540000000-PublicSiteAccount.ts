import { MigrationInterface, QueryRunner } from 'typeorm';

// Account fields of the public site (tour-react User): age, and gender as '' | 'male' | 'female' | 'other'.
// gender was an unused integer column, so it is recreated as text.
export class PublicSiteAccount1790540000000 implements MigrationInterface {
  name = 'PublicSiteAccount1790540000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "age" integer`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "gender" TYPE character varying USING NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "gender" TYPE integer USING NULL`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "age"`);
  }
}
