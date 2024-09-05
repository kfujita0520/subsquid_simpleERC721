require("dotenv").config();

export const contractCallTimeout = process.env.CONTRACT_CALL_TIMEOUT
  ? parseInt(process.env.CONTRACT_CALL_TIMEOUT)
  : 100000;
