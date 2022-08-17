import { Model, INTEGER } from 'sequelize';
import db from '.';
import Teams from './teams';

class Matches extends Model {
  public id!: number;
  public homeTeam: number;
  public homeTeamGoals: string;
  public awayTeam: number;
  public awayTeamGoals: string;
  public inProgress: string;
}

Matches.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeam: {
    type: INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeam: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: INTEGER,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

Matches.hasMany(Teams, { foreignKey: 'homeTeam', as: 'teams' });
Matches.hasMany(Teams, { foreignKey: 'awayTeam', as: 'teams' });

export default Matches;
