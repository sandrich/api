const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class addBankAccount1633785280510 {
    name = 'addBankAccount1633785280510'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "bank_account" ("id" int NOT NULL IDENTITY(1,1), "bankName" varchar(256) NOT NULL, "type" varchar(256) NOT NULL, "updated" datetime2 NOT NULL CONSTRAINT "DF_e448d9d770fa67d038635fe6b3f" DEFAULT getdate(), "created" datetime2 NOT NULL CONSTRAINT "DF_851eb81c7038902e0a6fdd0179c" DEFAULT getdate(), CONSTRAINT "UQ_d171383ebd6caece573b7108d8b" UNIQUE ("bankName"), CONSTRAINT "UQ_9c61330f7815e9893de21d9527e" UNIQUE ("type"), CONSTRAINT "PK_f3246deb6b79123482c6adb9745" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "bank_account"`);
    }
}
