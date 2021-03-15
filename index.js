import express from "express";
import fetch from "node-fetch";
import cors from "cors";


const app = express();
const port = 5000;

app.use(cors());

app.get("/authorization/:code/:clientid/:clientsecret", async (req, res) => {

    // fetch access token
    const code = req.params.code;
    const clientId = req.params.clientid;
    const clientSecret = req.params.clientsecret;

    const result = await fetch(
        `https://accounts.zoho.com/oauth/v2/token?code=${code}&grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=http://127.0.0.1:3000/home&scope=AaaServer.profile.READ%2CAaaServer.profile.UPDATE`,
        { method: "POST" }
    ).then(resp => resp.json());

    res.status(200).send(result.access_token);
});

app.get("/getCalendarName/:accesstoken/:name", async (req, res) => {
    let accessToken = req.params.accesstoken;
    const calendarName = req.params.name;


    // fetch calendar list from api
    accessToken = `Zoho-oauthtoken ${accessToken}`;
    const result = await fetch("https://calendar.zoho.com/api/v1/calendars", {
        headers: { Authorization: accessToken }
    }).then(response => response.json());

    let calendar;

    if (result) {
        calendar = result.calendars.filter(e => e.name === calendarName);
        if (calendar.length > 0) {
            res.status(200).send(calendar);
        } else {
            res.status(400).send("calendar not found");
        }
    } else {
        res.status(400).send("Calendar not found");
    }
});

app.get("/getEventList/:accesstoken/:calendarid", async (req, res) => {
    let accessToken = req.params.accesstoken;
    const calendarid = req.params.calendarid;


    // fetch event list
    accessToken = `Zoho-oauthtoken ${accessToken}`;
    const result = await fetch(
        `https://calendar.zoho.com/api/v1/calendars/${calendarid}/events`,
        { headers: { Authorization: accessToken } }
    ).then(resp => resp.json());

    res.status(200).send(result);
});

// app.get(
//   "/getEventDetails/:accesstoken/:calendarid/:eventid",
//   async (req, res) => {
//     let accessToken = req.params.accessToken;
//     let calendarid = req.params.calendarid;
//     //fetch event detail
//   }
// );

app.listen(port, () => {

    // console.log(`Example app listening at http://localhost:${port}`);
});
