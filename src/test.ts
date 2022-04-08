import { LivekitTransport } from './index'

export async function runTest() {
  const url = 'test-livekit.decentraland.today'

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODUwOTEwNTEsImlzcyI6IkFQSWVCWTdLNjYza0dQcyIsImp0aSI6InRvbnlfc3RhcmsiLCJuYW1lIjoiVG9ueSBTdGFyayIsIm5iZiI6MTY0OTA5MTA1MSwic3ViIjoidG9ueV9zdGFyayIsInZpZGVvIjp7InJvb20iOiJzdGFyay10b3dlciIsInJvb21Kb2luIjp0cnVlfX0.NBlDQI8IGHrmP9E25gpF3mgfQ5GPAN6C-E5tGzQZsSU'

  const t1 = new LivekitTransport({ url, token })
  const t2 = new LivekitTransport({ url, token })


  await Promise.all([t1.connect(), t2.connect()])

  await t1.publishReliableData(Uint8Array.from([1, 2, 3]))

}
