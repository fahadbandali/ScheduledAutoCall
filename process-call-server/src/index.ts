import express from 'express';
import dotenv from 'dotenv';
import { Twilio, twiml, webhook } from 'twilio'
import fs from 'fs'
import ngrok from '@ngrok/ngrok'
import vosk, { Model } from 'vosk'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const accountSid = process.env.TWILIO_ACCOUNT_SID ?? 'not valid'
const apiKeySid = process.env.TWILIO_API_SID ?? 'not valid'
const apiKeySecret = process.env.TWILIO_API_SECRET ?? 'not valid'
const modelPath = process.env.MODEL_PATH || 'DNE';
if (!fs.existsSync(modelPath)) {
    console.log(
      'Please download the model from https://alphacephei.com/vosk/models and unpack as ' +
      modelPath +
        ' in the current folder.'
    )
    process.exit(1)
  }

let model: Model;
vosk.setLogLevel(0);
let url: string;
const callClient = new Twilio(accountSid, apiKeySecret, { accountSid: apiKeySid})

// Middleware (optional)
app.use(express.json()); // For parsing application/json

// Define a simple route
app.get('/', (req, res) => {
    res.send('Sanity Check');
});

app.get('/init-call', webhook({validate: false}), async function(req, res) {
    try {
        const initiatedCall = await callClient.calls.create({
            to: process.env.PHONE_NUMBER_TO_CALL ?? 'DNE',
            from: process.env.PHONE_NUMBER_FROM ?? 'DNE',
            url: url + "/record",
        })
        console.log(`successfully initiated the call ${JSON.stringify(initiatedCall)}`)
    } catch (error) {
        console.error(`There was an error making the call ${JSON.stringify(error)}`, error)
    }

    res.status(200).send("initiated the call")
});

app.get('/record', webhook({validate: false}), function (req, res) {
    const response = new twiml.VoiceResponse();
    response.record({
        maxLength: 5,
        recordingStatusCallback: '/process-audio'
    })
    response.hangup();
});

// Define a simple route
app.get('/process-audio', webhook({validate: false}), function (req, res) {
    console.log(req)
});

// Start the server
app.listen(PORT, async () => {
    const session = await new ngrok.SessionBuilder().authtokenFromEnv().connect();
    const listener = await session.httpEndpoint().listen();
    console.log("Ingress established at:", listener.url());
    listener.forward(`localhost:${PORT})`);
    const ngrokUrl = listener.url()
    if (ngrokUrl !== null) {
        url = ngrokUrl
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log("Ngrok tunnel initialized!");
        console.log(`Listening on url ${url}`);
    }

    model = await new Model(modelPath)
});
