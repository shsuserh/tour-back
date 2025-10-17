import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1753179710021 implements MigrationInterface {
    name = 'MigrationTable1753179710021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tempFile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "originalName" character varying NOT NULL, "mimeType" character varying NOT NULL, "extension" character varying NOT NULL, "size" integer NOT NULL, "filePath" character varying, CONSTRAINT "PK_351b3f29231c3908a75954982b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'super_admin', 'admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "email" character varying, "phone" character varying, "name" character varying, "lastname" character varying, "status" integer, "gender" integer, "image" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."token_type_enum" AS ENUM('access_token', 'refresh_token')`);
        await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "payload" character varying NOT NULL, "session" character varying NOT NULL, "type" "public"."token_type_enum" NOT NULL, "revoked" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "UQ_b97e707c79f58e5360cde3ec011" UNIQUE ("payload"), CONSTRAINT "UQ_8f5c691eaf747850231da439d34" UNIQUE ("payload", "session", "type"), CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TYPE "public"."token_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "tempFile"`);
    }

}
