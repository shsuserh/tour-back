import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1756383947581 implements MigrationInterface {
    name = 'MigrationTable1756383947581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tourTranslation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "lgCode" character varying NOT NULL, "field" character varying NOT NULL, "value" character varying NOT NULL, "tourId" uuid NOT NULL, CONSTRAINT "PK_5c28fd371eed7ff47ecb72fa452" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tourFile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "originalName" character varying NOT NULL, "mimeType" character varying NOT NULL, "extension" character varying NOT NULL, "size" integer NOT NULL, "filePath" character varying, "tourId" uuid, CONSTRAINT "REL_af9c3f9c94820fc22ac745ce5d" UNIQUE ("tourId"), CONSTRAINT "PK_ff6190c7e8ba8f6a7a607fd1264" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tour" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_972cd7fa4ec39286068130fa3f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tourTranslation" ADD CONSTRAINT "FK_7e11ab0fc389b7a9a9c32a3ecff" FOREIGN KEY ("tourId") REFERENCES "tour"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tourFile" ADD CONSTRAINT "FK_af9c3f9c94820fc22ac745ce5d1" FOREIGN KEY ("tourId") REFERENCES "tour"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tourFile" DROP CONSTRAINT "FK_af9c3f9c94820fc22ac745ce5d1"`);
        await queryRunner.query(`ALTER TABLE "tourTranslation" DROP CONSTRAINT "FK_7e11ab0fc389b7a9a9c32a3ecff"`);
        await queryRunner.query(`DROP TABLE "tour"`);
        await queryRunner.query(`DROP TABLE "tourFile"`);
        await queryRunner.query(`DROP TABLE "tourTranslation"`);
    }

}
