import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoryToType1625221932481 implements MigrationInterface {
  name = 'categoryToType1625221932481';

  //변경
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `category` to `type`',
    );
  }

  //롤백
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `type` to `category`',
    );
  }
}
