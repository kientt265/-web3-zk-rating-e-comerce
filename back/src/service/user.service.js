import bcrypt from 'bcrypt';
import User from '../database/schema/userModel.js';

export const register = async (email, password) => {
  const user = await User.findOne({ email });

  if (user) {
    throw new Error('User already exists');
  }

  const passwoldHashed = await bcrypt.hash(password, 10);

  await User.create({ email, passwoldHashed });

  return { email };
}

export const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwoldHashed);

  if (!isPasswordValid) {
    throw new Error('Password is invalid');
  }

  return { email };
}