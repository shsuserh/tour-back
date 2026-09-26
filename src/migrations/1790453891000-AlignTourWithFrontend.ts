import { MigrationInterface, QueryRunner } from 'typeorm';

// Aligns the tour table with the public site contract (tour-react/src/data/mockData.js).
// Existing rows keep their data: maxMember is renamed, durations are carried over, slug defaults to the id.
export class AlignTourWithFrontend1790453891000 implements MigrationInterface {
  name = 'AlignTourWithFrontend1790453891000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tour" RENAME COLUMN "maxMember" TO "maxGroup"`);

    await queryRunner.query(`ALTER TABLE "tour" ADD "slug" character varying`);
    await queryRunner.query(`UPDATE "tour" SET "slug" = "id"::text`);
    await queryRunner.query(`ALTER TABLE "tour" ALTER COLUMN "slug" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "tour" ADD CONSTRAINT "UQ_977f1da07ba1cf4a613e1d3991d" UNIQUE ("slug")`);

    await queryRunner.query(`CREATE TYPE "public"."tour_type_enum" AS ENUM('day', 'city', 'multi', 'abroad')`);
    await queryRunner.query(`ALTER TABLE "tour" ADD "type" "public"."tour_type_enum" NOT NULL DEFAULT 'day'`);
    await queryRunner.query(`ALTER TABLE "tour" ALTER COLUMN "type" DROP DEFAULT`);

    await queryRunner.query(`ALTER TABLE "tour" ADD "region" character varying NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "tour" ALTER COLUMN "region" DROP DEFAULT`);

    await queryRunner.query(`ALTER TABLE "tour" ADD "itinerary" jsonb NOT NULL DEFAULT '[]'`);

    await queryRunner.query(`ALTER TABLE "tour" ADD "durationHours" integer`);
    await queryRunner.query(`ALTER TABLE "tour" ADD "durationDays" integer`);
    await queryRunner.query(`UPDATE "tour" SET "durationHours" = "durationValue" WHERE "durationType" = '1'`);
    await queryRunner.query(`UPDATE "tour" SET "durationDays" = "durationValue" WHERE "durationType" = '2'`);
    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "durationType"`);
    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "durationValue"`);
    await queryRunner.query(`DROP TYPE "public"."tour_durationtype_enum"`);

    await queryRunner.query(`ALTER TABLE "tour" ALTER COLUMN "price" TYPE numeric(10,2)`);
    await queryRunner.query(`ALTER TABLE "tour" ADD "privatePrice" numeric(10,2)`);
    await queryRunner.query(`ALTER TABLE "tour" ADD "privateOnly" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "tour" ADD "languages" text NOT NULL DEFAULT 'am,en,ru'`);
    await queryRunner.query(`ALTER TABLE "tour" ALTER COLUMN "languages" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "tour" ADD "popular" boolean NOT NULL DEFAULT false`);

    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "minMember"`);
    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "pickUpLocation"`);
    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "dropOffLocation"`);
    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "adultsOnly"`);

    // One image per tour -> ordered gallery
    await queryRunner.query(`ALTER TABLE "tourFile" DROP CONSTRAINT "REL_af9c3f9c94820fc22ac745ce5d"`);
    await queryRunner.query(`ALTER TABLE "tourFile" ADD "sortOrder" integer NOT NULL DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tourFile" DROP COLUMN "sortOrder"`);
    // Keep only the cover image per tour so the one-to-one constraint can come back.
    await queryRunner.query(
      `DELETE FROM "tourFile" f USING "tourFile" g WHERE f."tourId" = g."tourId" AND f."created" > g."created"`
    );
    await queryRunner.query(`ALTER TABLE "tourFile" ADD CONSTRAINT "REL_af9c3f9c94820fc22ac745ce5d" UNIQUE ("tourId")`);

    await queryRunner.query(`ALTER TABLE "tour" ADD "adultsOnly" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "tour" ADD "dropOffLocation" text NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "tour" ADD "pickUpLocation" text NOT NULL DEFAULT ''`);
    await queryRunner.query(`ALTER TABLE "tour" ADD "minMember" integer NOT NULL DEFAULT 1`);

    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "popular"`);
    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "languages"`);
    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "privateOnly"`);
    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "privatePrice"`);
    await queryRunner.query(`ALTER TABLE "tour" ALTER COLUMN "price" TYPE double precision`);

    await queryRunner.query(`CREATE TYPE "public"."tour_durationtype_enum" AS ENUM('1', '2')`);
    await queryRunner.query(
      `ALTER TABLE "tour" ADD "durationType" "public"."tour_durationtype_enum" NOT NULL DEFAULT '1'`
    );
    await queryRunner.query(`ALTER TABLE "tour" ADD "durationValue" integer NOT NULL DEFAULT 1`);
    await queryRunner.query(
      `UPDATE "tour" SET "durationType" = '2', "durationValue" = "durationDays" WHERE "durationDays" IS NOT NULL`
    );
    await queryRunner.query(`UPDATE "tour" SET "durationValue" = "durationHours" WHERE "durationHours" IS NOT NULL`);
    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "durationDays"`);
    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "durationHours"`);

    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "itinerary"`);
    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "region"`);
    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."tour_type_enum"`);
    await queryRunner.query(`ALTER TABLE "tour" DROP CONSTRAINT "UQ_977f1da07ba1cf4a613e1d3991d"`);
    await queryRunner.query(`ALTER TABLE "tour" DROP COLUMN "slug"`);

    await queryRunner.query(`ALTER TABLE "tour" RENAME COLUMN "maxGroup" TO "maxMember"`);
  }
}
