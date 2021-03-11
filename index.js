const express = require("express");
const app = express();
const port = 4000;
const fetch = require("node-fetch");
const cors = require('cors');


app.use(cors());

app.get("/authorization/:code/:clientid/:clientsecret", async (req, res) => {
  //fetch access token
  let code = req.params.code;
  let clientId = req.params.clientid;
  let clientSecret = req.params.clientsecret;

  let result = await fetch(
    `https://accounts.zoho.com/oauth/v2/token?code=${code}&grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=http://127.0.0.1:3000/home&scope=AaaServer.profile.READ%2CAaaServer.profile.UPDATE`,
    { method: "POST" }
  ).then(resp => resp.json());
  res.status(200).send(result.access_token);
});

app.get("/getCalendarList/:accesstoken/:name", async (req, res) => {
  let accessToken = req.params.accesstoken;
  let calendarName = req.params.name;
  //fetch calendar list from api
  accessToken = `Zoho-oauthtoken ${accessToken}`;
  let result = await fetch("https://calendar.zoho.com/api/v1/calendars", {
    headers: { "Authorization": accessToken},
  })
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });

    let calendar = result.calendars.filter(e => {
      return e.name === calendarName;
    });

    if(calendar.length() > 0) {
      res.status(200).send(calendar[0].uid);
    } else {
      res.status(400).send("Calendar not found");
    }
});

app.get("/getEventList/:accesstoken/:calendarid", async (req, res) => {
  let accessToken = req.params.accesstoken;
  let calendarid = req.params.calendarid;
  //fetch event list
  accessToken = `Zoho-oauthtoken ${accessToken}`;
  let result = await fetch(`https://calendar.zoho.com/api/v1/calendars/${calendarid}/events`,{headers: {"Authorization": accessToken}}).then(resp => resp.json());
  res.status(200).send(result);
});

app.get("/getEventDetails/:accesstoken/:calendarid/:eventid", async (req, res) => {
  let accessToken = req.params.accessToken;
  let calendarid = req.params.calendarid;
  //fetch event detail
  
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
