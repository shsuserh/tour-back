import { EntityManager, Repository } from 'typeorm';
import { AppDataSource } from '../config/dataSource';
import { User } from '../entities/user.entity';
import { CreateUserPayload, UserUpdatePayload } from '../datatypes/internal/user.internal';

class UserRepository {
  private repository: Repository<User> = AppDataSource.getRepository(User);

  async getUserByYid(_yid: string): Promise<User | null> {
    return null; //this.repository.findOne({ where: { yid } });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({ where: { username } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async updateUser(id: string, data: UserUpdatePayload, transactionalEntityManager?: EntityManager): Promise<void> {
    if (transactionalEntityManager) await transactionalEntityManager.update(User, { id }, data);
    else await this.repository.update(id, data);
  }

  async createUser(data: CreateUserPayload, transactionalEntityManager?: EntityManager): Promise<User> {
    const user = this.repository.create(data);
    if (transactionalEntityManager) return transactionalEntityManager.save(user);
    return this.repository.save(user);
  }

  async getUsers(): Promise<User[]> {
    return this.repository.find();
  }

  async deleteUser(user: User, transactionalEntityManager?: EntityManager): Promise<void> {
    if (transactionalEntityManager) await transactionalEntityManager.remove(User, user);
    else await this.repository.delete(user.id);
  }
}

const userRepository = new UserRepository();
export default userRepository;
