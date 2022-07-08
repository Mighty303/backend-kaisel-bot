import axios from "axios";

const SEASON_12_BEGINS_TIMESTAMP = 1641297600;

const requestFunction = (path: any) => {
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

const getStats = (req: any, res: any) => {
  res.send("No empty");
};

export { getStats,  requestFunction};
