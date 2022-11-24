module.exports = class Data1664998259642 {
  name = 'Data1664998259642'

  async up(db) {
    await db.query(`CREATE TABLE "address" ("id" character varying NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "address_event" ("id" character varying NOT NULL, "address_id" character varying, "event_id" character varying, CONSTRAINT "PK_4b986cb931c2e037e0327d1a3fb" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_81063e88884fc6189b3ebe2804" ON "address_event" ("address_id") `)
    await db.query(`CREATE INDEX "IDX_343e9a3eb14888618323bc8e66" ON "address_event" ("event_id") `)
    await db.query(`ALTER TABLE "event" DROP COLUMN "related_addresses"`)
    await db.query(`ALTER TABLE "extrinsic" DROP CONSTRAINT "FK_a3b99daba1259dab0dd040d4f74"`)
    await db.query(`ALTER TABLE "extrinsic" ALTER COLUMN "block_id" DROP NOT NULL`)
    await db.query(`ALTER TABLE "call" DROP CONSTRAINT "FK_bd3f11fd4110d60ac8b96cd62f3"`)
    await db.query(`ALTER TABLE "call" ALTER COLUMN "block_id" DROP NOT NULL`)
    await db.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_2b0d35d675c4f99751855c45021"`)
    await db.query(`ALTER TABLE "event" ALTER COLUMN "block_id" DROP NOT NULL`)
    await db.query(`ALTER TABLE "address_event" ADD CONSTRAINT "FK_81063e88884fc6189b3ebe28045" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "address_event" ADD CONSTRAINT "FK_343e9a3eb14888618323bc8e669" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "extrinsic" ADD CONSTRAINT "FK_a3b99daba1259dab0dd040d4f74" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "call" ADD CONSTRAINT "FK_bd3f11fd4110d60ac8b96cd62f3" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_2b0d35d675c4f99751855c45021" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "address"`)
    await db.query(`DROP TABLE "address_event"`)
    await db.query(`DROP INDEX "public"."IDX_81063e88884fc6189b3ebe2804"`)
    await db.query(`DROP INDEX "public"."IDX_343e9a3eb14888618323bc8e66"`)
    await db.query(`ALTER TABLE "event" ADD "related_addresses" text NOT NULL`)
    await db.query(`ALTER TABLE "extrinsic" ADD CONSTRAINT "FK_a3b99daba1259dab0dd040d4f74" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "extrinsic" ALTER COLUMN "block_id" SET NOT NULL`)
    await db.query(`ALTER TABLE "call" ADD CONSTRAINT "FK_bd3f11fd4110d60ac8b96cd62f3" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "call" ALTER COLUMN "block_id" SET NOT NULL`)
    await db.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_2b0d35d675c4f99751855c45021" FOREIGN KEY ("block_id") REFERENCES "block"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "event" ALTER COLUMN "block_id" SET NOT NULL`)
    await db.query(`ALTER TABLE "address_event" DROP CONSTRAINT "FK_81063e88884fc6189b3ebe28045"`)
    await db.query(`ALTER TABLE "address_event" DROP CONSTRAINT "FK_343e9a3eb14888618323bc8e669"`)
    await db.query(`ALTER TABLE "extrinsic" DROP CONSTRAINT "FK_a3b99daba1259dab0dd040d4f74"`)
    await db.query(`ALTER TABLE "call" DROP CONSTRAINT "FK_bd3f11fd4110d60ac8b96cd62f3"`)
    await db.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_2b0d35d675c4f99751855c45021"`)
  }
}
