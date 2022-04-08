import {
  Room,
  RoomEvent,
  RemoteParticipant,
  RemoteTrackPublication,
  RemoteTrack,
  Participant,
  DataPacket_Kind
} from 'livekit-client';


/**
 * Transport config
 * @public
 */
export type Config = {
  url: string
  token: string
  handleTrackSubscribed?: (track: RemoteTrack) => void
  handleTrackUnsubscribed?: (track: RemoteTrack) => void
  handleDataReceived?: (peerId: string, payload: Uint8Array) => void
}

/**
 * Initialize the transport
 * @public
 */
export class LivekitTransport {
  room: Room

  constructor(private config: Config) {
    this.room = new Room()
    this.room
      .on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _: RemoteTrackPublication, __: RemoteParticipant) => {
        console.log("track subscribed")
        if (config.handleTrackSubscribed) {
          config.handleTrackSubscribed(track)
        }
      })
      .on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, _: RemoteTrackPublication, __: RemoteParticipant) => {
        console.log("track unsubscribed")
        if (config.handleTrackUnsubscribed) {
          config.handleTrackUnsubscribed(track)
        }
      })
      .on(RoomEvent.Disconnected, () => {
        console.log('disconnected from room')
      })
      .on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: Participant, _?: DataPacket_Kind) => {
        console.log(`${this.localName()}: data received from ${participant ? participant.name : 'undefined'}, len: ${payload.byteLength}`)
        if (config.handleDataReceived && participant) {
          config.handleDataReceived(participant.identity, payload)
        }
      })
  }

  async connect(): Promise<void> {
    await this.room.connect(this.config.url, this.config.token, { autoSubscribe: true });
    console.log(`${this.localName()} connected to ${this.room.name}`)
  }

  setMicrophoneEnabled(enabled: boolean): Promise<void> {
    return this.room.localParticipant.setMicrophoneEnabled(enabled);
  }

  publishReliableData(data: Uint8Array): Promise<void> {
    return this.room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
  }

  publishUnreliableData(data: Uint8Array): Promise<void> {
    return this.room.localParticipant.publishData(data, DataPacket_Kind.LOSSY)
  }

  localName(): string {
    return this.room.localParticipant.name || 'undefined'
  }

}


