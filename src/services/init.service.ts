import { sequelize } from '../models/sql/sequelize';
import EnvService from './env.service';

class InitService {
  public static async init() {
    EnvService.init();
    await sequelize.sync();
    return null;
  }
}

export default InitService;
