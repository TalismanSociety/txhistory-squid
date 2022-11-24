module.exports = class Data1661273702760 {
  name = 'Data1661273702760'

  async up(db) {
    await db.query(`ALTER TABLE "transaction" ADD "extrinsic_id" text NOT NULL`)
    await db.query(`ALTER TABLE "transaction" ADD "ss58_format" integer NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "transaction" DROP COLUMN "extrinsic_id"`)
    await db.query(`ALTER TABLE "transaction" DROP COLUMN "ss58_format"`)
  }
}
