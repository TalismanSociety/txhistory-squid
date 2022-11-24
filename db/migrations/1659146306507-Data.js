module.exports = class Data1659146306507 {
  name = 'Data1659146306507'

  async up(db) {
    await db.query(`ALTER TABLE "transaction" DROP COLUMN "related_addresses"`)
    await db.query(`ALTER TABLE "transaction" ADD "related_addresses" text NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "transaction" ADD "related_addresses" text array NOT NULL`)
    await db.query(`ALTER TABLE "transaction" DROP COLUMN "related_addresses"`)
  }
}
