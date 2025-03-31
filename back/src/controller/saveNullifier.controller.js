import {saveNullfier} from "../service/sendNullifier.service.js"

export const saveNullfierController = async (req, res) => {
  try {
    const { nullifier } = req.body;

    if (!nullifier) {
      return res.status(400).json({
        success: false,
        message: 'Nullifier is required.',
      });
    }

    const result = await saveNullfier(nullifier);

    res.status(200).json({
      success: true,
      message: 'Nullifier saved successfully.',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
