module.exports = class Data1668443308214 {
  name = 'Data1668443308214'

  async up(db) {
    await db.query(`CREATE TABLE "indexed_chain" ("id" character varying NOT NULL, "info" jsonb, "archive" text, "enabled" boolean, "start_block" integer, "ss58_format" integer, "subscan_url" text, "calamar_url" text, CONSTRAINT "PK_1d4f3a45984d8d0be67e38f5727" PRIMARY KEY ("id"))`)
  }

  async down(db) {
    await db.query(`DROP TABLE "indexed_chain"`)
  }
}
