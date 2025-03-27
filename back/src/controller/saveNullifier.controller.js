import {saveNullfier} from "../service/sendNullifier.service"

export const saveNullfierController = async (req, res) => {
  try {
    const nullifier = req.body;

    if (!nullifier  === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input data. Please provide all required fields.',
      });
    }

    await saveNullfier(nullifier);

    res.status(200).json({
      success: true,
      message: 'Send Nullifier Sussesfully.',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
