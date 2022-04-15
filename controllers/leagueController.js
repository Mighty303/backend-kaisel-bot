const axios = require("axios");
const SEASON_12_BEGINS_TIMESTAMP = 1641297600;

let requestFunction = (path) => {
  return new Promise((resolve, reject) => {
    axios.get(path).then(
      (response) => {
        resolve(response.data);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

const getStats = (req, res) => {
  let { id, region, queueId } = req.params;
  let index = 0;
  let size = 100;
  let continueFlag = true;
  let ApiCallString3 = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${id}/ids?queue=${queueId}&startTime=${SEASON_12_BEGINS_TIMESTAMP}&start=${index}&count=${size}&api_key=${UserStatsBox.returnApiKey()}`;
  
  let callRequest = async (path) => {
    do {
      await requestFunction(path);
      index += size;
      path = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${id}/ids?queue=${queueId}&startTime=${SEASON_12_BEGINS_TIMESTAMP}&start=${index}&count=${size}&api_key=${UserStatsBox.returnApiKey()}`;
    } while (continueFlag);
  };
  res.send(await callRequest(ApiCallString3));
};

module.exports = { getStats };
