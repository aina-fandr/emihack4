const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: 'local'
    });

    res.status(201).json({
      message: 'Compte créé avec succès.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du compte.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const user = await User.findOne({ where: { email, authProvider: 'local' } });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret_jwt_a_changer',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token Google manquant.' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, sub, picture } = payload;

    let user = await User.findOne({ where: { googleId: sub } });

    if (!user) {
      user = await User.findOne({ where: { email } });

      if (user) {
        user.googleId = sub;
        user.authProvider = 'google';
        if (!user.avatar) user.avatar = picture;
        await user.save();
        console.log(`[Auth] Compte Google lié à : ${email}`);
      } else {
        user = await User.create({
          googleId: sub,
          name,
          email,
          avatar: picture,
          password: null,
          authProvider: 'google'
        });
        console.log(`[Auth] Nouvel utilisateur créé via Google : ${email}`);
      }
    } else {
      console.log(`[Auth] Connexion Google réussie pour : ${email}`);
    }

    const authToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret_jwt_a_changer',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Connexion réussie avec Google !',
      token: authToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('Erreur Google Login:', error);
    res.status(401).json({
      message: "Échec de l'authentification avec Google.",
      error: error.message
    });
  }
};