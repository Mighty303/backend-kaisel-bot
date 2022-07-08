import {Request, Response} from "express";
import axios, { AxiosResponse } from "axios";

// Dev KEY
const key: string = "RGAPI-c157ab80-bc24-4c3a-bd5b-f563e3916a98";
const SEASON_12_BEGINS_TIMESTAMP: number = 1641297600;

// Get Summoner ID
const getEncryptID = async (sumName: string, region: string): Promise<any> => {
  async function sumInfo () {
      return await axios.get(`https://${region}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${sumName}`, {
        headers: {
          "X-Riot-Token": "RGAPI-c157ab80-bc24-4c3a-bd5b-f563e3916a98"
        },
        params:{
        }
  })}
  return ((await sumInfo()).data)
};

// Return summoner id for now
const getStats = async (req: Request, res: Response) => {
  getEncryptID(req.params.id, req.params.region).then((result)=>{
    res.send(result.id);
  });
};

export { getStats};