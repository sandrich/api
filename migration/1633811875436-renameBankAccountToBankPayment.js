const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class renameBankAccountToBankPayment1633811875436 {
    name = 'renameBankAccountToBankPayment1633811875436'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "bank_payment" ("id" int NOT NULL IDENTITY(1,1), "bankName" varchar(256) NOT NULL, "type" varchar(256) NOT NULL, "updated" datetime2 NOT NULL CONSTRAINT "DF_65fa18df25656c8314a611b5708" DEFAULT getdate(), "created" datetime2 NOT NULL CONSTRAINT "DF_59a00972db3a2c78df65d7b4661" DEFAULT getdate(), CONSTRAINT "UQ_eccea858e1e17a19b07b247373d" UNIQUE ("bankName"), CONSTRAINT "UQ_c426ffa6ed0eb4e2b7fcc20deea" UNIQUE ("type"), CONSTRAINT "PK_6159bfc2d6d6ceb9dce2a4166ae" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "bank_payment"`);
    }
}
