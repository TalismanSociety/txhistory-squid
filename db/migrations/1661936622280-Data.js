module.exports = class Data1661936622280 {
  name = 'Data1661936622280'

  async up(db) {
    await db.query(`ALTER TABLE "extrinsic" ADD "ss58_format" integer NOT NULL`)
    await db.query(`ALTER TABLE "call" ADD "ss58_format" integer NOT NULL`)
    await db.query(`ALTER TABLE "event" ADD "ss58_format" integer NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "extrinsic" DROP COLUMN "ss58_format"`)
    await db.query(`ALTER TABLE "call" DROP COLUMN "ss58_format"`)
    await db.query(`ALTER TABLE "event" DROP COLUMN "ss58_format"`)
  }
}
