import { EntityManager } from 'typeorm';
import { AppDataSource } from '../../config/dataSource';
import { DbTransactionFactory } from './dbTransactionFactory';
import { TransactionRunner } from './transactionRunner';
import { AppError } from '../../errors';
import { COMMON_ERROR_MESSAGES } from '../../constants/common.constants';

export class TransactionManager {
  private dbTransactionFactory: DbTransactionFactory = new DbTransactionFactory(AppDataSource);

  async runInTransaction<T = undefined>(
    callback: (transactionalEntityManager: EntityManager) => Promise<void>,
    postTask?: (data: T) => Promise<void> | void,
    postTaskData?: T
  ): Promise<void> {
    let transactionRunner: TransactionRunner | undefined;
    try {
      transactionRunner = await this.dbTransactionFactory.createTransaction();

      await transactionRunner.startTransaction();

      const transactionalEntityManager = transactionRunner.transactionalEntityManager;
      await callback(transactionalEntityManager);

      await transactionRunner.commitTransaction();
      if (postTask) {
        await postTask(postTaskData!);
      }
    } catch (error) {
      console.error('Error Transaction====>',error)

      if (transactionRunner) await transactionRunner.rollbackTransaction();
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({ code: 503, toaster: true, toasterErrors: [COMMON_ERROR_MESSAGES.globalError] });
    } finally {
      if (transactionRunner) await transactionRunner.releaseTransaction();
    }
  }
}
