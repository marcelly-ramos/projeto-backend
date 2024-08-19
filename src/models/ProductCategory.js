const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Product = require('./Product');
const Category = require('./Category');

const ProductCategory = sequelize.define('ProductCategory', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: false,
});

module.exports = ProductCategory;
