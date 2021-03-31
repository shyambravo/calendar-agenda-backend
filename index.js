import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import bodyParser from "body-parser";
const FormData = require("form-data");


const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/authorization/:code/:clientid/:clientsecret", async (req, res) => {

    // fetch access token
    const code = req.params.code;
    const clientId = req.params.clientid;
    const clientSecret = req.params.clientsecret;

    const result = await fetch(
        `https://accounts.zoho.com/oauth/v2/token?code=${code}&grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=http://127.0.0.1:3000/home&scope=AaaServer.profile.READ%2CAaaServer.profile.UPDATE`,
        { method: "POST" }
    ).then(resp => resp.json());

    res.status(200).send(result);
});

app.post("/getEventList/:accesstoken/:calendarid", async (req, res) => {
    let accessToken = req.params.accesstoken;
    const calendarid = req.params.calendarid;
    let params;
    const data = req.body;

    if (data.start && data.end) {
        params = `?range=${encodeURIComponent(JSON.stringify(data))}`;
    } else {
        params = "";
    }

    // fetch event list
    accessToken = `Zoho-oauthtoken ${accessToken}`;
    const result = await fetch(
        `https://calendar.zoho.com/api/v1/calendars/${calendarid}/events${params}`,
        { headers: { Authorization: accessToken } }
    ).then(resp => {
        if (resp.status !== 400) {
            return resp.json();
        }
        if (resp.status === 401) {
            return 1;
        }
        return 0;

    });

    if (result !== 0 && result !== 1) {
        res.status(200).send(result);
    } else {
        res.status(401).send("Invalid Token");
    }


});

app.get("/getCalendars/:accesstoken", async (req, res) => {
    const token = `Zoho-oauthtoken ${req.params.accesstoken}`;
    const result = await fetch("https://calendar.zoho.com/api/v1/calendars", {
        headers: { Authorization: token }
    }).then(resp => {
        if (resp.status === 200) {
            return resp.json();
        }
        if (resp.status === 401) {
            return 1;
        }
        return 0;
    });


    if (result !== 0 && result !== 1) {
        res.status(200).send(result);
    } else {
        res.status(401).send("Invalid auth token");
    }

});


app.post("/editEvent/:token", async (req, res) => {
    const token = `Zoho-oauthtoken ${req.params.token}`;
    const obj = req.body;
    const eventdata = {
        title: obj.title,
        uid: obj.uid,
        etag: obj.etag,
        estatus: obj.estatus,
        dateandtime: obj.dateandtime,
        color: obj.color
    };
    const data = new FormData();

    data.append("eventdata", JSON.stringify(eventdata));


    const result = await fetch(
        `https://calendar.zoho.com/api/v1/calendars/${req.body.cid}/events/${req.body.uid}`,
        { method: "POST", headers: { Authorization: token }, body: data }
    ).then(resp => {
        if (resp.status === 200) {
            return resp.json();
        }
        if (resp.status === 401) {
            return 1;
        }
        return 0;
    });

    if (result !== 1 && result !== 0) {
        res.status(200).send(result);
    } else {
        res.status(401).send("Invaid token");
    }


});

app.get("/getnewtoken/:token/:clientid/:clientsecret", async (req, res) => {
    const token = req.params.token;
    const clientid = req.params.clientid;
    const clientsecret = req.params.clientsecret;

    const result = await fetch(
        `https://accounts.zoho.com/oauth/v2/token?refresh_token=${token}&grant_type=refresh_token&client_id=${clientid}&client_secret=${clientsecret}`,
        { method: "POST" }
    ).then(resp => resp.json());

    res.send(result);

});


app.listen(port);
