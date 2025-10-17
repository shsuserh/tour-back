import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1753181230862 implements MigrationInterface {
    name = 'MigrationTable1753181230862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "hashedPassword" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "salt" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "salt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hashedPassword"`);
    }

}
