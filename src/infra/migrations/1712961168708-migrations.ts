import { MigrationInterface, QueryRunner } from "typeorm";
import bcrypt from 'bcrypt'

export class Migrations1712961168708 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO user(name, email, password, role, access_level) VALUES 
            ("Dev", "dev@email.com", "${await bcrypt.hash('123321', 10)}", 4, 4)`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM user WHERE email = "dev@email.com"`
        )
    }

}
