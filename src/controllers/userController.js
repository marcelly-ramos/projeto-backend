const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Para hash de senha

// Função para gerar token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Obter usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error });
  }
};

// Cadastro de usuário
exports.createUser = async (req, res) => {
  const { firstname, surname, email, password, confirmPassword } = req.body;

  if (!firstname || !surname || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Senhas não conferem' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstname, surname, email, password: hashedPassword });
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Atualizar usuário
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstname, surname, email } = req.body;

  if (!firstname || !surname || !email) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const [updated] = await User.update({ firstname, surname, email }, { where: { id } });

    if (updated) {
      return res.status(204).send(); // Nenhum conteúdo, mas status 204
    }

    return res.status(404).json({ message: 'Usuário não encontrado' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Deletar usuário
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  // Verifica se o token é válido e se o usuário está autorizado
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await user.destroy(); // Deleta o usuário
    res.status(204).send(); // No Content
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.sendStatus(401); // Unauthorized
    }
    console.error('Erro ao deletar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

exports.generateToken = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Email ou senha incorretos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email ou senha incorretos' });
    }

    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    return res.status(500).json({message: 'Erro interno do servidor' });
  }
};