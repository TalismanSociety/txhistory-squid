module.exports = class Data1659145643446 {
  name = 'Data1659145643446'

  async up(db) {
    await db.query(`CREATE TABLE "transaction" ("id" character varying NOT NULL, "chain_id" text NOT NULL, "hash" text NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "index_in_block" integer NOT NULL, "section" text NOT NULL, "method" text NOT NULL, "name" text NOT NULL, "signer" text NOT NULL, "fee" numeric, "related_addresses" text array NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_2d99bb5a0ab5fb8cf8b746eb39" ON "transaction" ("block_number") `)
    await db.query(`CREATE INDEX "IDX_87f2932d4a558d44a2915f849a" ON "transaction" ("timestamp") `)
    await db.query(`CREATE INDEX "IDX_2e2ff311bcce6731fdc13d960e" ON "transaction" ("section") `)
    await db.query(`CREATE INDEX "IDX_366e048315512cdd2d46dd210e" ON "transaction" ("method") `)
    await db.query(`CREATE INDEX "IDX_09fa7a1d3624cbeaa7174ba573" ON "transaction" ("name") `)
    await db.query(`CREATE INDEX "IDX_8b99ecb6087c6696bd18e9c9b4" ON "transaction" ("signer") `)
  }

  async down(db) {
    await db.query(`DROP TABLE "transaction"`)
    await db.query(`DROP INDEX "public"."IDX_2d99bb5a0ab5fb8cf8b746eb39"`)
    await db.query(`DROP INDEX "public"."IDX_87f2932d4a558d44a2915f849a"`)
    await db.query(`DROP INDEX "public"."IDX_2e2ff311bcce6731fdc13d960e"`)
    await db.query(`DROP INDEX "public"."IDX_366e048315512cdd2d46dd210e"`)
    await db.query(`DROP INDEX "public"."IDX_09fa7a1d3624cbeaa7174ba573"`)
    await db.query(`DROP INDEX "public"."IDX_8b99ecb6087c6696bd18e9c9b4"`)
  }
}
