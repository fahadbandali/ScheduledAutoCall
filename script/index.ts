import { Twilio } from 'twilio'
import dotenv from 'dotenv'

dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID ?? 'not valid'
const apiKeySid = process.env.TWILIO_API_SID ?? 'not valid'
const apiKeySecret = process.env.TWILIO_API_SECRET ?? 'not valid'

const callClient = new Twilio(accountSid, apiKeySecret, { accountSid: apiKeySid})

async function makeCall(to: string, from: string) {
    try {
        const initiatedCall = await callClient.calls.create({
            to,
            from,
            url: "https://demo.twilio.com/welcome/voice/",
        })
        console.log(`successfully initiated the call ${JSON.stringify(initiatedCall)}`)
    } catch (error) {
        console.error(`There was an error making the call ${JSON.stringify(error)}`, error)
    }
}

const toPhoneNumber = '+16475465450'; // The number you want to call
const fromPhoneNumber = '+17058068448'; // Your Twilio number
makeCall(toPhoneNumber, fromPhoneNumber);