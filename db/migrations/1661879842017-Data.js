module.exports = class Data1661879842017 {
  name = 'Data1661879842017'

  async up(db) {
    await db.query(`ALTER TABLE "extrinsic" ADD "chain_id" text NOT NULL`)
    await db.query(`ALTER TABLE "call" ADD "chain_id" text NOT NULL`)
    await db.query(`ALTER TABLE "event" ADD "chain_id" text NOT NULL`)
    await db.query(`CREATE INDEX "IDX_c7db3993fbe2ec59bbc9f450df" ON "extrinsic" ("chain_id") `)
    await db.query(`CREATE INDEX "IDX_79f0db0ed220b1dcb271c24c47" ON "call" ("chain_id") `)
    await db.query(`CREATE INDEX "IDX_1d7485faa58bd1844230e18c44" ON "event" ("chain_id") `)
  }

  async down(db) {
    await db.query(`ALTER TABLE "extrinsic" DROP COLUMN "chain_id"`)
    await db.query(`ALTER TABLE "call" DROP COLUMN "chain_id"`)
    await db.query(`ALTER TABLE "event" DROP COLUMN "chain_id"`)
    await db.query(`DROP INDEX "public"."IDX_c7db3993fbe2ec59bbc9f450df"`)
    await db.query(`DROP INDEX "public"."IDX_79f0db0ed220b1dcb271c24c47"`)
    await db.query(`DROP INDEX "public"."IDX_1d7485faa58bd1844230e18c44"`)
  }
}
