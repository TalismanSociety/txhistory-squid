module.exports = class Data1668469475822 {
  name = 'Data1668469475822'

  async up(db) {
    await db.query(`ALTER TABLE "indexed_chain" ADD "current_block" integer`)
    await db.query(`ALTER TABLE "indexed_chain" ADD "head_block" integer`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "indexed_chain" DROP COLUMN "current_block"`)
    await db.query(`ALTER TABLE "indexed_chain" DROP COLUMN "head_block"`)
  }
}
