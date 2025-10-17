import { EntityManager, Repository } from 'typeorm';
import { SocialAuth } from '../entities/socialAuth.entity';
import { SocialProvider } from '../datatypes/enums/enums';
import { AppDataSource } from '../../dataSource';

class SocialAuthRepository {
  private repository: Repository<SocialAuth>;

  constructor() {
    this.repository = AppDataSource.getRepository(SocialAuth);
  }

  async findByProviderAndProviderId(
    provider: SocialProvider,
    providerId: string,
    transactionalEntityManager?: EntityManager
  ): Promise<SocialAuth | null> {
    const manager = transactionalEntityManager || this.repository.manager;
    return manager.findOne(SocialAuth, {
      where: { provider, providerId },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string, transactionalEntityManager?: EntityManager): Promise<SocialAuth[]> {
    const manager = transactionalEntityManager || this.repository.manager;
    return manager.find(SocialAuth, {
      where: { userId },
    });
  }

  async createSocialAuth(
    socialAuthData: Partial<SocialAuth>,
    transactionalEntityManager?: EntityManager
  ): Promise<SocialAuth> {
    const manager = transactionalEntityManager || this.repository.manager;
    const socialAuth = manager.create(SocialAuth, socialAuthData);
    return manager.save(socialAuth);
  }

  async deleteByUserId(userId: string, transactionalEntityManager?: EntityManager): Promise<void> {
    const manager = transactionalEntityManager || this.repository.manager;
    await manager.delete(SocialAuth, { userId });
  }
}

const socialAuthRepository = new SocialAuthRepository();
export default socialAuthRepository;
