import { Request, Response } from "express";
import axios from "axios";
import sqlite3, { OPEN_READWRITE } from "sqlite3";
let flag = true;
const SEASON_12_BEGINS_TIMESTAMP: number = 1641297600;

const connectionDatabase = async (): Promise<sqlite3.Database> => {
    const sqlite3Handler: sqlite3.sqlite3 = sqlite3.verbose();
    return new sqlite3Handler.Database("database.db", OPEN_READWRITE, (err) => {
        if (err) {
            console.log("Error Occurred - " + err.message);
        }
        else {
            console.log("DataBase Connected");
        }
    })
}

// const sqlite3Handler: sqlite3.sqlite3 = sqlite3.verbose();
// const database: sqlite3.Database = new sqlite3Handler.Database("database.db", OPEN_READWRITE, (err) => {
//     if (err) {
//         console.log("Error Occurred - " + err.message);
//     }
//     else {
//         console.log("DataBase Connected");
//     }
// })
// database.configure("busyTimeout", 2000);

// Dev KEY

// Get Summoner info

const getMatchInfo = async (matchID: string, region: string): Promise<any> => {
    async function matchInfo() {
        return await axios.get(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchID}`, {
            headers: {
                "X-Riot-Token": process.env.riotAPIKey
            },
            params: {
            }
        })
    }
    return ((await matchInfo()).data)
}

const getSummonerInfo = async (puuid: string, region: string): Promise<any> => {
    async function sumInfo() {
        return await axios.get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
            headers: {
                "X-Riot-Token": process.env.riotAPIKey
            },
            params: {
            }
        })
    }
    return ((await sumInfo()).data)
}

const getMatches = async (puuid: string, startTime: number, queue: number, region: string) => {
    async function matches() {
        return await axios.get(`https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${startTime}&queue=${queue}&start=0&count=20`, {
            headers: {
                "X-Riot-Token": process.env.riotAPIKey
            },
            params: {
            }
        })
    }
    return ((await matches()).data);
}

const populateDataBase = async (req: Request, res: Response) => {

    let count = 1;
    const loop = () => {
        setTimeout(() => {
            populateDataBase2();
            console.log("Finished: " + count);
            count++;
            if (count < 2) {
                loop();
            }
        }, 2500);
    }
    loop();
    res.send("<h1>Scrapping Started</h1>");
}

const populateDataBase2 = async () => {
    const database: sqlite3.Database = await connectionDatabase();
    database.configure("busyTimeout", 1000);
    console.log("Call: " + 0);
    let seed: number = -1;
    let seedGameID: string = null;
    let counterGame: number = 0;
    database.each(`SELECT MAX(InternalID) AS counterGame FROM Match`, (err, row) => {
        counterGame = row.counterGame + 1;
        console.log("Call: " + 1);
    }).get("SELECT GameID FROM Match WHERE InternalID = (SELECT (GameID+1) FROM LastCheckedMatch)", [], async (err: any, row: any) => {
        console.log("Call: " + 2);
        if (err) {
            console.log(err);
        } else {
            if (row !== undefined) {
                seedGameID = row.GameID;
                let result = (await batch(seedGameID, counterGame, database));
                console.log(result);
            } else {
                console.log("Error: No seed gameID");
            }
        }
    });
}

const batch = async (seedGameID: string, counterGame: number, database: sqlite3.Database) => {
    console.log("Call Batch");
    let flag = false;
    await getMatchInfo(seedGameID, "americas").
        then(async (data) => {
            let { participants } = data.info;
            database.run(`UPDATE Match SET GameCreation = ${data.info.gameStartTimestamp}, GameEnd = ${data.info.gameEndTimestamp}, QueueID = ${data.info.queueId}, ServerCode = "LA1" WHERE GameID = "${seedGameID}"`, [], (err: any, row: any) => {
                if (err) {
                    console.log(err);
                }
                counterGame++;
            });
            for (let index = 0; index < participants.length; index++) {
                await getSummonerInfo(participants[index].puuid, "LA1").then((data) => {
                    database.get(`SELECT * FROM Player WHERE PlayerID = "${data.id}"`, [], (err: any, row: any) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if (row === undefined) {
                                database.run(`INSERT INTO Player VALUES ("${data.id}", "${data.summonerLevel}", "${data.name}", "${data.profileIconId}", "${data.puuid}", "LA1")`).run(`INSERT INTO Player_Plays_Match VALUES ("${data.id}", "${seedGameID}", "${participants[index].assists}", "${participants[index].deaths}", "${participants[index].kills}", "${participants[index].win}", "${participants[index].teamPosition}", "${participants[index].visionScore}", "${participants[index].champLevel}", "${participants[index].championId}", "${participants[index].turretKills}", "${participants[index].wardsKilled}", "${participants[index].wardsPlaced}", "${participants[index].totalMinionsKilled}")`);;
                            } else {
                                database.get(`SELECT * FROM Player_Plays_Match WHERE (PlayerID = "${data.id}" AND GameID = "${seedGameID}")`, [], (err, row) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        if (row === undefined) {
                                            database.run(`INSERT INTO Player_Plays_Match VALUES ("${data.id}", "${seedGameID}", "${participants[index].assists}", "${participants[index].deaths}", "${participants[index].kills}", "${participants[index].win}", "${participants[index].teamPosition}", "${participants[index].visionScore}", "${participants[index].champLevel}", "${participants[index].championId}", "${participants[index].turretKills}", "${participants[index].wardsKilled}", "${participants[index].wardsPlaced}", "${participants[index].totalMinionsKilled}")`).run(`INSERT INTO Player_Plays_Match_Items VALUES(
                                            "${data.id}", "${seedGameID}", "${participants[index].item1}", "${participants[index].item2}", "${participants[index].item3}", "${participants[index].item4}", "${participants[index].item5}", "${participants[index].item6}"
                                        )`);
                                        } else {
                                            database.get(`SELECT * FROM Player_Plays_Match_Items WHERE  (PlayerID = "${data.id}" AND GameID = "${seedGameID}")`, [], (err, row) => {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    if (row === undefined) {
                                                        database.get(`INSERT INTO Player_Plays_Match_Items VALUES(
                                                        "${data.id}", "${seedGameID}", "${participants[index].item1}", "${participants[index].item2}", "${participants[index].item3}", "${participants[index].item4}", "${participants[index].item5}", "${participants[index].item6}"
                                                    )`);
                                                    } else {
                                                        console.log("Item already added");
                                                    }
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }).catch((err) => {
                    console.log(err);
                })
                await getMatches(participants[index].puuid, SEASON_12_BEGINS_TIMESTAMP, 420, "americas").then((data) => {
                    for (let index = 0; index < data.length; index++) {
                        database.parallelize(() => {
                            database.get(`SELECT * FROM Match WHERE GameID = "${data[index]}"`, [], (err, row) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (row === undefined) {
                                        database.run(`INSERT INTO Match VALUES( "${data[index]}", NULL, NULL, NULL, "LA1", ${counterGame})`, () => {
                                            counterGame++;
                                        });
                                        flag = true;
                                    } else {
                                        //console.log('Match already in database');
                                    }
                                }
                            })
                        })
                    }
                })
            }
        }).
        then(() => {
            database.get(`SELECT InternalID FROM Match WHERE GameID = "${seedGameID}" `, [], (err: any, row: any) => {
                if (err) {
                    console.log(err);
                } else {
                    if (row !== undefined) {
                        database.run(`UPDATE LastCheckedMatch SET GameID = ${row.InternalID}`, (err: any, row: any) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Call: " + 3);
                                console.log("LastCheckedMatch Updated");
                            }
                        });
                    }
                }
            })
        }).
        catch((err) => {
            console.log(err);
        }).
        finally(() => {
            database.close(() => {
                console.log("DB Closed");
            });
            console.log(flag)
        });
    return flag
}

export { populateDataBase };