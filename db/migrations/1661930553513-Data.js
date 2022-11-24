module.exports = class Data1661930553513 {
  name = 'Data1661930553513'

  async up(db) {
    await db.query(`ALTER TABLE "call" DROP CONSTRAINT "FK_11c1e76d5be8f04c472c4a05b95"`)
    await db.query(`DROP INDEX "public"."IDX_11c1e76d5be8f04c472c4a05b9"`)
    await db.query(`ALTER TABLE "call" DROP COLUMN "parent_id"`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "call" ADD CONSTRAINT "FK_11c1e76d5be8f04c472c4a05b95" FOREIGN KEY ("parent_id") REFERENCES "call"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`CREATE INDEX "IDX_11c1e76d5be8f04c472c4a05b9" ON "call" ("parent_id") `)
    await db.query(`ALTER TABLE "call" ADD "parent_id" character varying`)
  }
}
