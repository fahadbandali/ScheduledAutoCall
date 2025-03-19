# Scheduled Auto Caller

Theres an annoying payment process where we need to call in to make the payment. If we miss calling then we get charged interest. We could wait until the system modernizes but its been like 6 years of waiting so lets engineer something..

### Overall flow
1. Start the express server `cd process-call-server && npm run start`
2. Expose the local host ports to the internet (maybe using ngrok)
3. Execute index.ts in the script directory `cd script && npm run call`
