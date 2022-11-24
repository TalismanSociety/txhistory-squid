module.exports = class Data1661878638507 {
  name = 'Data1661878638507'

  async up(db) {
    await db.query(`CREATE TABLE "extrinsic" ("id" character varying NOT NULL, "data" jsonb, CONSTRAINT "PK_80d7db0e4b1e83e30336bc76755" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "call" ("id" character varying NOT NULL, "name" text NOT NULL, "data" jsonb, "extrinsic_id" character varying, CONSTRAINT "PK_2098af0169792a34f9cfdd39c47" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_8b212022b7428232091e2f8aa5" ON "call" ("name") `)
    await db.query(`CREATE INDEX "IDX_dde30e4f2c6a80f9236bfdf259" ON "call" ("extrinsic_id") `)
    await db.query(`CREATE TABLE "event" ("id" character varying NOT NULL, "name" text NOT NULL, "data" jsonb, "call_id" character varying, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_b535fbe8ec6d832dde22065ebd" ON "event" ("name") `)
    await db.query(`CREATE INDEX "IDX_83cf1bd59aa4521ed882fa5145" ON "event" ("call_id") `)
    await db.query(`ALTER TABLE "transaction" ADD "call_id" text NOT NULL`)
    await db.query(`ALTER TABLE "call" ADD CONSTRAINT "FK_dde30e4f2c6a80f9236bfdf2590" FOREIGN KEY ("extrinsic_id") REFERENCES "extrinsic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_83cf1bd59aa4521ed882fa51452" FOREIGN KEY ("call_id") REFERENCES "call"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "extrinsic"`)
    await db.query(`DROP TABLE "call"`)
    await db.query(`DROP INDEX "public"."IDX_8b212022b7428232091e2f8aa5"`)
    await db.query(`DROP INDEX "public"."IDX_dde30e4f2c6a80f9236bfdf259"`)
    await db.query(`DROP TABLE "event"`)
    await db.query(`DROP INDEX "public"."IDX_b535fbe8ec6d832dde22065ebd"`)
    await db.query(`DROP INDEX "public"."IDX_83cf1bd59aa4521ed882fa5145"`)
    await db.query(`ALTER TABLE "transaction" DROP COLUMN "call_id"`)
    await db.query(`ALTER TABLE "call" DROP CONSTRAINT "FK_dde30e4f2c6a80f9236bfdf2590"`)
    await db.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_83cf1bd59aa4521ed882fa51452"`)
  }
}
