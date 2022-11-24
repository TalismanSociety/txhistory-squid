module.exports = class Data1661937777428 {
  name = 'Data1661937777428'

  async up(db) {
    await db.query(`ALTER TABLE "call" ADD "standalone" boolean`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "call" DROP COLUMN "standalone"`)
  }
}
