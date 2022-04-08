import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { LivekitTransport } from 'comms3-livekit-transport'

const url = process.env.REACT_APP_LIVEKIT_URL

function handleDataReceived(peerId: string, _: Uint8Array): void {
  console.log(`data received from ${peerId}`)
}

async function test() {
  const token1 = process.env.REACT_APP_LIVEKIT_USER1_TOKEN
  const token2 = process.env.REACT_APP_LIVEKIT_USER2_TOKEN

  if (!url) {
    throw "Missing livekit URL"
  }
  if (!token1) {
    throw "Missing livekit user1 token"
  }
  if (!token2) {
    throw "Missing livekit user2 token"
  }

  const t1 = new LivekitTransport({ url, token: token1, handleDataReceived })
  const t2 = new LivekitTransport({ url, token: token2, handleDataReceived })
  await Promise.all([t1.connect(), t2.connect()])
  await t1.publishReliableData(Uint8Array.from([1, 2, 3]))

  await t1.setMicrophoneEnabled(false)
  console.log("DATA SENT")
}


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
test()
