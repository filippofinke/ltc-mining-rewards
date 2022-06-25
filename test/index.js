const ltcMiningRewards = require("../index");

(async () => {
  console.log(await ltcMiningRewards.getRewards(9160, "MH/s"));
})();
