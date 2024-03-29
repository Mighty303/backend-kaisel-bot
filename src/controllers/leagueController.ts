import { Request, Response } from "express";
import axios from "axios";
import sqlite3, { OPEN_READWRITE } from "sqlite3";

const SEASON_12_BEGINS_TIMESTAMP: number = 1641297600;

type QueueObject = {
  leagueId: string,
  queueType: string,
  tier: string,
  rank: string,
  summonerId: string,
  summonerName: string,
  leaguePoints: number,
  wins: number,
  losses: number,
  veteran: boolean,
  inactive: boolean,
  freshBlood: boolean,
  hotStreak: boolean
}

type DataToReturn = {
  leagueId?: string,
  queueType?: string,
  tier?: string,
  rank?: string,
  summonerId?: string,
  summonerName?: string,
  leaguePoints?: number,
  wins?: number,
  losses?: number,
  veteran?: boolean,
  inactive?: boolean,
  freshBlood?: boolean,
  hotStreak?: boolean
}
// Dev KEY

// Get Summoner info
const getSummonerInfo = async (sumName: string, region: string): Promise<any> => {
  async function sumInfo() {
    return await axios.get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${sumName}`, {
      headers: {
        "X-Riot-Token": process.env.riotAPIKey
      },
      params: {
      }
    })
  }
  return ((await sumInfo()).data)
};

const getRankedStatsID = async (sumID: string, region: string): Promise<any> => {
  async function sumInfo() {
    return await axios.get(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${sumID}`, {
      headers: {
        "X-Riot-Token": process.env.riotAPIKey
      },
      params: {
      }
    })
  }
  return ((await sumInfo()).data)
};

const findQueueData = (queuesData: object[], queueRequested: string): object => {
  const data: object = {};
  const dataFound = queuesData.find((queue: QueueObject) => {
    if (queue.queueType === "RANKED_SOLO_5x5" && queueRequested === "Solo") {
      return queue;
    } else if (queue.queueType === "RANKED_FLEX_SR" && queueRequested === "Flex") {
      return queue;
    }
  });
  return dataFound !== undefined ? dataFound : data;
}
// Return summoner id for now
const getStats = async (req: Request, res: Response) => {
  // const sqlite3Handler = sqlite3.verbose();
  // const database = new sqlite3Handler.Database("database.db", OPEN_READWRITE, (err) => {
  //   if (err) {
  //     console.log("Error Occurred - " + err.message);
  //   }
  //   else {
  //     console.log("DataBase Connected");
  //   }
  // })

  // database.serialize(() => {
  //   database.each("SELECT * FROM Player", (err, row) => {
  //     console.log(row);
  //     console.log(err);
  //   });
  // })

  // database.close();

  if (req.params.queueId !== "Solo" && req.params.queueId !== "Flex") {
    res.json({
      message: "Bad Request",
    }).status(400)
  } else {
    getSummonerInfo(req.params.id, req.params.region).then(({ id }) => {
      getRankedStatsID(id, req.params.region).then((result: object[]) => {
        const data: DataToReturn = findQueueData(result, req.params.queueId);
        if (Object.keys(data).length === 0) {
          data.rank = "Unranked";
          data.summonerId = id;
          data.summonerName = req.params.id;
        }
        res.set('content-location', `/api/v1/league/stats/${req.params.queueId}/${req.params.region}/${req.params.id}`).json({
          url: `/api/v1/league/stats/${req.params.queueId}/${req.params.region}/${req.params.id}`,
          data
        }).status(201);
      })
    }).catch((error) => {
      res.json({
        message: "Not summoner found",
        error: error.message
      }).status(404);
    });
  }
};

const getMatchInfo = async (matchID: string, region: string) => {
  return ((await axios.get(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}`, {
    headers:
    {
      "X-Riot-Token": process.env.riotAPIKey
    },
    params: {
    }
  })).data);
}

const getMatchHistory = async (req: Request, res: Response) => {
  const startTimeStamp = SEASON_12_BEGINS_TIMESTAMP;
  let keepLooking: boolean = true;
  let matchHistory: string[] = [];
  const requestForMatchs = async (queue: number, startTime: number, puuid: string, index: number) => {
    return (await axios.get(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${startTime}&queue=${queue}&start=${index}&count=${100}`, {
      headers: {
        "X-Riot-Token": process.env.riotAPIKey
      },
      params: {
      }
    }));
  }
  getSummonerInfo(req.params.id, req.params.region).then(async ({ puuid }) => {
    while (keepLooking) {
      const responseData: string[] = (await (requestForMatchs(440, startTimeStamp, puuid, matchHistory.length))).data;
      matchHistory = [...matchHistory, ...responseData]
      if (responseData.length < 100) {
        keepLooking = false;
      }
    }
    res.send(matchHistory);
  })
}

export { getStats, getMatchHistory };