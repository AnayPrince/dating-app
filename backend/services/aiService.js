import axios from "axios";

const getSuggestion = async (interests) => {
  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/ai/message",
      { interests }
    );

    return res.data;
  } catch (error) {
    console.error("AI Service Error:", error.message);
    return { message: "AI service failed" };
  }
};

export default { getSuggestion };