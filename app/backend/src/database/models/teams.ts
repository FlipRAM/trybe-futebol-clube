import { Model, STRING, INTEGER } from 'sequelize';
import db from '.';

class Teams extends Model {
  public id!: number;
  public teamName: string;
}

Teams.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'teams',
  timestamps: false,
});

export default Teams;
