const express = require('express');
const routes = require('./routes');
const sequelize = require('../config/database');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const ProductImage = require('./models/ProductImage');
const ProductOption = require('./models/ProductOption');
const ProductCategory = require('./models/ProductCategory');
const app = express();

require('dotenv').config();

// Middlewares globais
app.use(express.json());

// rotas de usuários
app.use('/api', routes);

// associacoes
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
Product.hasMany(ProductOption, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });
ProductOption.belongsTo(Product, { foreignKey: 'product_id' });

Product.belongsToMany(Category, { through: ProductCategory, foreignKey: 'product_id' });
Category.belongsToMany(Product, { through: ProductCategory, foreignKey: 'category_id' });

// Sincronizando o banco de dados
sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado');
  })
  .catch(err => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });

module.exports = app;
