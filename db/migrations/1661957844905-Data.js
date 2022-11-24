module.exports = class Data1661957844905 {
  name = 'Data1661957844905'

  async up(db) {
    await db.query(`ALTER TABLE "extrinsic" ADD "block_number" integer NOT NULL`)
    await db.query(`ALTER TABLE "extrinsic" ADD "block_hash" text NOT NULL`)
    await db.query(`ALTER TABLE "extrinsic" ADD "timestamp" integer NOT NULL`)
    await db.query(`ALTER TABLE "call" ADD "block_number" integer NOT NULL`)
    await db.query(`ALTER TABLE "call" ADD "block_hash" text NOT NULL`)
    await db.query(`ALTER TABLE "call" ADD "timestamp" integer NOT NULL`)
    await db.query(`ALTER TABLE "event" ADD "block_number" integer NOT NULL`)
    await db.query(`ALTER TABLE "event" ADD "block_hash" text NOT NULL`)
    await db.query(`ALTER TABLE "event" ADD "timestamp" integer NOT NULL`)
    await db.query(`CREATE INDEX "IDX_142f352835c698a35eacbeb2f5" ON "extrinsic" ("block_number") `)
    await db.query(`CREATE INDEX "IDX_579e39f71ef5f3b2a6839cd70b" ON "extrinsic" ("block_hash") `)
    await db.query(`CREATE INDEX "IDX_6e232918078798b1fade21dcf8" ON "extrinsic" ("timestamp") `)
    await db.query(`CREATE INDEX "IDX_8d62e222f606c249fb4046ad63" ON "call" ("block_number") `)
    await db.query(`CREATE INDEX "IDX_cf47f5c1fa9b01b00dbfe2859a" ON "call" ("block_hash") `)
    await db.query(`CREATE INDEX "IDX_a032945f45cacda2d30f4286df" ON "call" ("timestamp") `)
    await db.query(`CREATE INDEX "IDX_a8a7fbbbb0d8305cd81eda6ac8" ON "event" ("block_number") `)
    await db.query(`CREATE INDEX "IDX_7c2ed5bbb12e8b80905edfc8e2" ON "event" ("block_hash") `)
    await db.query(`CREATE INDEX "IDX_2c15918ff289396205521c5f3c" ON "event" ("timestamp") `)
  }

  async down(db) {
    await db.query(`ALTER TABLE "extrinsic" DROP COLUMN "block_number"`)
    await db.query(`ALTER TABLE "extrinsic" DROP COLUMN "block_hash"`)
    await db.query(`ALTER TABLE "extrinsic" DROP COLUMN "timestamp"`)
    await db.query(`ALTER TABLE "call" DROP COLUMN "block_number"`)
    await db.query(`ALTER TABLE "call" DROP COLUMN "block_hash"`)
    await db.query(`ALTER TABLE "call" DROP COLUMN "timestamp"`)
    await db.query(`ALTER TABLE "event" DROP COLUMN "block_number"`)
    await db.query(`ALTER TABLE "event" DROP COLUMN "block_hash"`)
    await db.query(`ALTER TABLE "event" DROP COLUMN "timestamp"`)
    await db.query(`DROP INDEX "public"."IDX_142f352835c698a35eacbeb2f5"`)
    await db.query(`DROP INDEX "public"."IDX_579e39f71ef5f3b2a6839cd70b"`)
    await db.query(`DROP INDEX "public"."IDX_6e232918078798b1fade21dcf8"`)
    await db.query(`DROP INDEX "public"."IDX_8d62e222f606c249fb4046ad63"`)
    await db.query(`DROP INDEX "public"."IDX_cf47f5c1fa9b01b00dbfe2859a"`)
    await db.query(`DROP INDEX "public"."IDX_a032945f45cacda2d30f4286df"`)
    await db.query(`DROP INDEX "public"."IDX_a8a7fbbbb0d8305cd81eda6ac8"`)
    await db.query(`DROP INDEX "public"."IDX_7c2ed5bbb12e8b80905edfc8e2"`)
    await db.query(`DROP INDEX "public"."IDX_2c15918ff289396205521c5f3c"`)
  }
}
