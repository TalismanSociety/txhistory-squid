module.exports = class Data1665971649969 {
  name = 'Data1665971649969'

  async up(db) {
    await db.query(`ALTER TABLE "extrinsic" ADD "index_in_block" integer NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "extrinsic" DROP COLUMN "index_in_block"`)
  }
}
