const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const MEDICINE_INDICATORS = [
  "medication",
  "drug",
  "pharmaceutical",
  "tablet",
  "capsule",
  "injection",
  "syrup",
  "treatment for",
  "used to treat",
  "prescribed for",
];

function isLikelyMedicine(responseText) {
  const lowerText = responseText.toLowerCase();
  return MEDICINE_INDICATORS.some((indicator) => lowerText.includes(indicator));
}

async function medicineInfo(name) {
  const messages = [
    {
      role: "user",
      content: `
You are an experienced doctor. 
If "${name}" is NOT a real medicine, respond ONLY with: {"error": "No information found for this medicine."}

If "${name}" is a real medicine, explain it to a patient in simple, clear language. 
Return ONLY this exact JSON. Do not include extra explanation, formatting, or text.

{
  "name": "",
  "uses": "",
  "forms": "",
  "how_it_works": "",
  "benefits": "",
  "common_side_effects": "",
  "serious_side_effects": "",
  "who_should_avoid": "",
  "interactions": "",
  "Warnings_and_precautions": "",
  "important_advice": "",
  "Missed_Dose": "",
  "overdose": "",
  "Storage": "",
  "how_it_is_made": "",
  "similar_medicines": ""
}
      `,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages,
      temperature: 0.3,
    });

    const rawText = response?.choices?.[0]?.message?.content || "";

    if (
      rawText.includes('"error": "No information found for this medicine."')
    ) {
      return { error: "No information found for this medicine." };
    }

    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error("No valid JSON found in AI response");
    }

    const jsonString = rawText.substring(jsonStart, jsonEnd + 1);
    const medicineData = JSON.parse(jsonString.trim());

    if (medicineData.error) {
      return medicineData;
    }

    if (!isLikelyMedicine(JSON.stringify(medicineData))) {
      return { error: "No information found for this medicine." };
    }

    const isEmptyResponse = Object.values(medicineData).every(
      (val) => !val || val.trim() === ""
    );

    if (isEmptyResponse) {
      return { error: "No information found for this medicine." };
    }

    return medicineData;
  } catch (error) {
    console.error(" Error fetching medicine information:", error);
    return {
      error: "Could not fetch medicine information. Please try again later.",
    };
  }
}

module.exports = medicineInfo;
