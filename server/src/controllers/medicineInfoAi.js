const medicineInfo = require("../utils/medicineAiHelper");

const medicineInfoAi = async (req, res) => {
  const { name,languages } = req.body;
  console.log(name,"med name")
  try {
    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }
    const explained = await medicineInfo(name);
    res
      .status(200)
      .json({ message: "Data fetch successfully", data: explained });
  } catch (error) {
    console.log(error);
  }
};

module.exports = medicineInfoAi;
