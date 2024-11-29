import { Optional } from 'sequelize';
import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

interface InstallationAttributes {
  id: number;
  appId: string;
  authedUserId: string;
  scope: string;
  tokenType: string;
  botUserId: string;
  botAccessToken: string;
  teamId: string;
  teamName: string;
}

@Table
class Installation extends Model<InstallationAttributes, Optional<InstallationAttributes, 'id'>> {
  @Column
  appId!: string;

  @Column
  authedUserId!: string;
  
  @Column
  scope!: string;
  
  @Column
  tokenType!: string;
  
  @Column
  botUserId!: string;
  
  @Column
  botAccessToken!: string;
  
  @Column
  teamId!: string;
  
  @Column
  teamName!: string;

  @Column
  @CreatedAt
  createdAt!: Date;

  @Column
  @UpdatedAt
  updatedAt!: Date;
}

export default Installation;
