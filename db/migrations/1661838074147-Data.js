module.exports = class Data1661838074147 {
  name = 'Data1661838074147'

  async up(db) {
    await db.query(`ALTER TABLE "transaction" ADD "success" boolean NOT NULL`)
    await db.query(`ALTER TABLE "transaction" ADD "tip" numeric`)
    await db.query(`ALTER TABLE "transaction" ALTER COLUMN "signer" DROP NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "transaction" DROP COLUMN "success"`)
    await db.query(`ALTER TABLE "transaction" DROP COLUMN "tip"`)
    await db.query(`ALTER TABLE "transaction" ALTER COLUMN "signer" SET NOT NULL`)
  }
}
