import { login, register } from "../service/user.service";

export const registerController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await register(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await login(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};