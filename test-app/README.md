First, create an env file `.env` with:

```
REACT_APP_LIVEKIT_URL = 
REACT_APP_LIVEKIT_USER1_TOKEN = 
REACT_APP_LIVEKIT_USER2_TOKEN = 
```

then `npm run start`

# Creating tokens

Requires https://github.com/livekit/livekit-cli

livekit-cli create-token --create --join --api-key <key> --api-secret <secret> -r <room> --identity <identity> --valid-for 10h
