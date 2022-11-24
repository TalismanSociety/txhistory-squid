module.exports = class Data1661942416154 {
  name = 'Data1661942416154'

  async up(db) {
    await db.query(`ALTER TABLE "call" DROP COLUMN "standalone"`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "call" ADD "standalone" boolean`)
  }
}
