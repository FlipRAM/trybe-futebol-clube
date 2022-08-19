import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';
import Teams from './teams';

class Matches extends Model {
  public id!: number;
  public homeTeam!: number;
  public homeTeamGoals!: number;
  public awayTeam!: number;
  public awayTeamGoals!: number;
  public inProgress!: boolean;
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
    type: BOOLEAN,
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
});

Teams.hasMany(Matches, { foreignKey: 'homeTeam', as: 'homeTeam' });
Matches.belongsTo(Teams, { foreignKey: 'homeTeam', as: 'teamHome' });

Teams.hasMany(Matches, { foreignKey: 'awayTeam', as: 'awayTeam' });
Matches.belongsTo(Teams, { foreignKey: 'awayTeam', as: 'teamAway' });

export default Matches;
