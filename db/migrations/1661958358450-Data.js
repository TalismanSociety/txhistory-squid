module.exports = class Data1661958358450 {
  name = 'Data1661958358450'

  async up(db) {
    await db.query(`DROP INDEX "public"."IDX_6e232918078798b1fade21dcf8"`)
    await db.query(`ALTER TABLE "extrinsic" DROP COLUMN "timestamp"`)
    await db.query(`ALTER TABLE "extrinsic" ADD "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL`)
    await db.query(`DROP INDEX "public"."IDX_a032945f45cacda2d30f4286df"`)
    await db.query(`ALTER TABLE "call" DROP COLUMN "timestamp"`)
    await db.query(`ALTER TABLE "call" ADD "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL`)
    await db.query(`DROP INDEX "public"."IDX_2c15918ff289396205521c5f3c"`)
    await db.query(`ALTER TABLE "event" DROP COLUMN "timestamp"`)
    await db.query(`ALTER TABLE "event" ADD "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL`)
    await db.query(`CREATE INDEX "IDX_6e232918078798b1fade21dcf8" ON "extrinsic" ("timestamp") `)
    await db.query(`CREATE INDEX "IDX_a032945f45cacda2d30f4286df" ON "call" ("timestamp") `)
    await db.query(`CREATE INDEX "IDX_2c15918ff289396205521c5f3c" ON "event" ("timestamp") `)
  }

  async down(db) {
    await db.query(`CREATE INDEX "IDX_6e232918078798b1fade21dcf8" ON "extrinsic" ("timestamp") `)
    await db.query(`ALTER TABLE "extrinsic" ADD "timestamp" integer NOT NULL`)
    await db.query(`ALTER TABLE "extrinsic" DROP COLUMN "timestamp"`)
    await db.query(`CREATE INDEX "IDX_a032945f45cacda2d30f4286df" ON "call" ("timestamp") `)
    await db.query(`ALTER TABLE "call" ADD "timestamp" integer NOT NULL`)
    await db.query(`ALTER TABLE "call" DROP COLUMN "timestamp"`)
    await db.query(`CREATE INDEX "IDX_2c15918ff289396205521c5f3c" ON "event" ("timestamp") `)
    await db.query(`ALTER TABLE "event" ADD "timestamp" integer NOT NULL`)
    await db.query(`ALTER TABLE "event" DROP COLUMN "timestamp"`)
    await db.query(`DROP INDEX "public"."IDX_6e232918078798b1fade21dcf8"`)
    await db.query(`DROP INDEX "public"."IDX_a032945f45cacda2d30f4286df"`)
    await db.query(`DROP INDEX "public"."IDX_2c15918ff289396205521c5f3c"`)
  }
}
