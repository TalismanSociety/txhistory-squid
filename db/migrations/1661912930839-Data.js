module.exports = class Data1661912930839 {
  name = 'Data1661912930839'

  async up(db) {
    await db.query(`ALTER TABLE "call" DROP CONSTRAINT "FK_dde30e4f2c6a80f9236bfdf2590"`)
    await db.query(`DROP INDEX "public"."IDX_dde30e4f2c6a80f9236bfdf259"`)
    await db.query(`ALTER TABLE "call" DROP COLUMN "extrinsic_id"`)
    await db.query(`ALTER TABLE "extrinsic" ADD "call_id" character varying`)
    await db.query(`ALTER TABLE "call" ADD "parent_id" character varying`)
    await db.query(`ALTER TABLE "event" ADD "extrinsic_id" character varying`)
    await db.query(`ALTER TABLE "call" ALTER COLUMN "name" DROP NOT NULL`)
    await db.query(`ALTER TABLE "event" ALTER COLUMN "name" DROP NOT NULL`)
    await db.query(`CREATE INDEX "IDX_824d47cc4b2cda726405aa507c" ON "extrinsic" ("call_id") `)
    await db.query(`CREATE INDEX "IDX_11c1e76d5be8f04c472c4a05b9" ON "call" ("parent_id") `)
    await db.query(`CREATE INDEX "IDX_129efedcb305c80256db2d57a5" ON "event" ("extrinsic_id") `)
    await db.query(`ALTER TABLE "extrinsic" ADD CONSTRAINT "FK_824d47cc4b2cda726405aa507ca" FOREIGN KEY ("call_id") REFERENCES "call"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "call" ADD CONSTRAINT "FK_11c1e76d5be8f04c472c4a05b95" FOREIGN KEY ("parent_id") REFERENCES "call"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_129efedcb305c80256db2d57a59" FOREIGN KEY ("extrinsic_id") REFERENCES "extrinsic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "call" ADD CONSTRAINT "FK_dde30e4f2c6a80f9236bfdf2590" FOREIGN KEY ("extrinsic_id") REFERENCES "extrinsic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`CREATE INDEX "IDX_dde30e4f2c6a80f9236bfdf259" ON "call" ("extrinsic_id") `)
    await db.query(`ALTER TABLE "call" ADD "extrinsic_id" character varying`)
    await db.query(`ALTER TABLE "extrinsic" DROP COLUMN "call_id"`)
    await db.query(`ALTER TABLE "call" DROP COLUMN "parent_id"`)
    await db.query(`ALTER TABLE "event" DROP COLUMN "extrinsic_id"`)
    await db.query(`ALTER TABLE "call" ALTER COLUMN "name" SET NOT NULL`)
    await db.query(`ALTER TABLE "event" ALTER COLUMN "name" SET NOT NULL`)
    await db.query(`DROP INDEX "public"."IDX_824d47cc4b2cda726405aa507c"`)
    await db.query(`DROP INDEX "public"."IDX_11c1e76d5be8f04c472c4a05b9"`)
    await db.query(`DROP INDEX "public"."IDX_129efedcb305c80256db2d57a5"`)
    await db.query(`ALTER TABLE "extrinsic" DROP CONSTRAINT "FK_824d47cc4b2cda726405aa507ca"`)
    await db.query(`ALTER TABLE "call" DROP CONSTRAINT "FK_11c1e76d5be8f04c472c4a05b95"`)
    await db.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_129efedcb305c80256db2d57a59"`)
  }
}
