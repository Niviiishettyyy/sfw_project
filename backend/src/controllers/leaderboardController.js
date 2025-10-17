import User from '../models/User.js';

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().select('name points role').sort({ points: -1 }).limit(20);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
