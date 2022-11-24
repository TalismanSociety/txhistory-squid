module.exports = class Data1661940969412 {
  name = 'Data1661940969412'

  async up(db) {
    await db.query(`ALTER TABLE "event" ADD "related_addresses" text NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "event" DROP COLUMN "related_addresses"`)
  }
}
