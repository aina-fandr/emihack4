const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: { msg: "Le nom complet est obligatoire" }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "L'adresse email n'est pas valide" },
      notEmpty: { msg: "L'email est obligatoire" }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,  // ✅ OPTIONNEL maintenant
    validate: {
      len: {
        args: [8, 100],
        msg: "Le mot de passe doit contenir au moins 8 caractères."
      }
    }
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  authProvider: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'local',
    validate: {
      isIn: [['local', 'google']]
    }
  }
}, {
  timestamps: true
});

module.exports = User;