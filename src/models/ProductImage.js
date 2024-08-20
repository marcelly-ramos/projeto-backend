const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Product = require('./Product');

// Definição do modelo ProductImage
const ProductImage = sequelize.define('ProductImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product, 
      key: 'id',
    },
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'product_images',
});

// Associação com Product
ProductImage.associate = (models) => {
  ProductImage.belongsTo(models.Product, {
    foreignKey: 'product_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = ProductImage;
