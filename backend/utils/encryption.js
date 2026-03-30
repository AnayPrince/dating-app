import CryptoJS from "crypto-js";

const SECRET = process.env.SECRET_KEY || "fallback_secret";

export const encrypt = (text) => {
  try {
    return CryptoJS.AES.encrypt(text, SECRET).toString();
  } catch {
    return text;
  }
};

export const decrypt = (text) => {
  try {
    const bytes = CryptoJS.AES.decrypt(text, SECRET);
    return bytes.toString(CryptoJS.enc.Utf8) || text;
  } catch {
    return text;
  }
};