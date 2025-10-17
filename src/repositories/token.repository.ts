import { EntityManager, Repository } from 'typeorm';
import { AppDataSource } from '../config/dataSource';
import { Token } from '../entities/token.entity';
import { User } from '../entities/user.entity';
import { TokenPayload } from '../datatypes/internal/token.internal';
import { TokenType } from '../datatypes/enums/enums';

class TokenRepository {
  private repository: Repository<Token> = AppDataSource.getRepository(Token);

  async getActiveTokenByPayload(payload: string): Promise<Token | null> {
    return this.repository.findOne({ where: { payload, revoked: false } });
  }

  async createToken(tokenPayload: TokenPayload, transactionalEntityManager?: EntityManager): Promise<Token> {
    const token = this.repository.create({
      payload: tokenPayload.payload,
      session: tokenPayload.session,
      type: tokenPayload.type,
      user: { id: tokenPayload.user } as User,
    });
    if (transactionalEntityManager) await transactionalEntityManager.save(token);
    else await this.repository.save(token);
    return token;
  }

  async revokeToken(token: Token, transactionalEntityManager?: EntityManager): Promise<void> {
    if (transactionalEntityManager)
      await transactionalEntityManager.update(Token, { id: token.id }, { ...token, revoked: true });
    else await this.repository.update(token.id, { revoked: true });
  }

  async getActiveTokensBySessionAndUserId(session: string, userId: string): Promise<Token[]> {
    return this.repository
      .createQueryBuilder('token')
      .leftJoinAndSelect('token.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('token.session = :session', { session })
      .andWhere('token.revoked = false')
      .getMany();
  }

  async getActiveTokenBySessionUserIdAndTokenType(
    session: string,
    userId: string,
    type: TokenType
  ): Promise<Token | null> {
    return this.repository
      .createQueryBuilder('token')
      .leftJoinAndSelect('token.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('token.session = :session', { session })
      .andWhere('token.revoked = false')
      .andWhere('token.type = :type', { type })
      .getOne();
  }
}

const tokenRepository = new TokenRepository();
export default tokenRepository;
