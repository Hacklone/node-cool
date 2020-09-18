import {MigrationInterface, QueryRunner} from "typeorm";

export class Change1600590184845 implements MigrationInterface {
    name = 'Change1600590184845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "authentication_entity_type_enum" AS ENUM('0')`);
        await queryRunner.query(`CREATE TABLE "authentication_entity" ("id" BIGSERIAL NOT NULL, "authId" character varying NOT NULL, "type" "authentication_entity_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_879aca4777e85a5451a983ccf9c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9375dc2f73a4dbf15d2fea105c" ON "authentication_entity" ("authId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5775d18b0aed75fc8edc22b71f" ON "authentication_entity" ("type") `);
        await queryRunner.query(`CREATE TABLE "example_entity" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_fccd73330168066a434dbac114f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "profileImageUrl" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_415c35b9b3b6fe45a3b065030f" ON "user_entity" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_415c35b9b3b6fe45a3b065030f"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "example_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_5775d18b0aed75fc8edc22b71f"`);
        await queryRunner.query(`DROP INDEX "IDX_9375dc2f73a4dbf15d2fea105c"`);
        await queryRunner.query(`DROP TABLE "authentication_entity"`);
        await queryRunner.query(`DROP TYPE "authentication_entity_type_enum"`);
    }

}
