const axios = require("axios").default;
const { JSDOM } = require("jsdom");

const ENDPOINT = "https://www.litecoinpool.org/calc";
const speedUnits = ["kH/s", "MH/s", "GH/s"];

const getRewards = async (hashRate, speedUnit) => {
  if (typeof hashRate !== "number") {
    throw new Error("Hash rate must be a number");
  }

  if (typeof speedUnit !== "string") {
    throw new Error("Speed unit must be a string");
  }

  if (!speedUnits.includes(speedUnit)) {
    throw new Error("Speed unit must be one of " + speedUnits.join(", "));
  }

  let response = await axios.get(ENDPOINT, {
    params: {
      hashrate: hashRate,
      speedunit: speedUnit,
    },
  });

  const dom = new JSDOM(response.data);

  let selectors = {
    daily: "#content > div > table:nth-child(6) > tbody > tr:nth-child(1)",
    weekly: "#content > div > table:nth-child(6) > tbody > tr:nth-child(2)",
    monthly: "#content > div > table:nth-child(6) > tbody > tr:nth-child(3)",
  };

  let result = {};

  for (let name in selectors) {
    let selector = selectors[name];
    let element = dom.window.document.querySelector(selector);
    result[name] = {
      ltc: parseFloat(element.children[1].textContent),
      usd: parseFloat(element.children[2].textContent),
    };
  }

  return result;
};

module.exports = { getRewards };
