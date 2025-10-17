import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1756450917131 implements MigrationInterface {
    name = 'MigrationTable1756450917131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tour_durationtype_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`ALTER TABLE "tour" ADD "durationType" "public"."tour_durationtype_enum" NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "tour" ADD "durationValue" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tour" ADD "minMember" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tour" ADD "maxMember" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tour" ADD "pickUpLocation" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tour" ADD "dropOffLocation" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tour" ADD "price" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tour" ADD "adultsOnly" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "adultsOnly"`);
        await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "dropOffLocation"`);
        await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "pickUpLocation"`);
        await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "maxMember"`);
        await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "minMember"`);
        await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "durationValue"`);
        await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "durationType"`);
        await queryRunner.query(`DROP TYPE "public"."tour_durationtype_enum"`);
    }

}
