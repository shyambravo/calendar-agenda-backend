const express = require("express");
const app = express();
const port = 4000;

app.get("/authorization/:code/:clientid/:clientsecret", (req, res) => {
  res.send("Hello World!");
});

app.get("/getCalendarList/:accesstoken", (req, res) => {
  let accessToken = req.params.accesstoken;
  //fetch calendar list from api
});

app.get("/getEventList/:accesstoken/:calendarid", (req, res) => {
  let accessToken = req.params.accessToken;
  let calendarid = req.params.calendarid;
  //fetch event list
});

app.get("/getEventDetails/:accesstoken/:calendarid/:eventid", (req, res) => {
  let accessToken = req.params.accessToken;
  let calendarid = req.params.calendarid;
  //fetch event detail
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
