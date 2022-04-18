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
 * Logger config
 * @public
 */
export type ILogger = {
  error(message: string | Error, ...args: any[]): void
  log(message: string, ...args: any[]): void
  warn(message: string, ...args: any[]): void
  info(message: string, ...args: any[]): void
  trace(message: string, ...args: any[]): void
}

/**
 * Transport config
 * @public
 */
export type Config = {
  url: string
  token: string
  logger?: ILogger
  handleTrackSubscribed?: (track: RemoteTrack) => void
  handleTrackUnsubscribed?: (track: RemoteTrack) => void
  handleDataReceived?: (peerId: string, payload: Uint8Array) => void
  handleDisconnected?: () => void
}

/**
 * Initialize the transport
 * @public
 */
export class LivekitTransport {
  room: Room

  private logger: ILogger

  constructor(private config: Config) {
    this.logger = config.logger || console
    this.room = new Room()
    this.room
      .on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _: RemoteTrackPublication, __: RemoteParticipant) => {
        this.logger.log("track subscribed")
        if (config.handleTrackSubscribed) {
          config.handleTrackSubscribed(track)
        }
      })
      .on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack, _: RemoteTrackPublication, __: RemoteParticipant) => {
        this.logger.log("track unsubscribed")
        if (config.handleTrackUnsubscribed) {
          config.handleTrackUnsubscribed(track)
        }
      })
      .on(RoomEvent.Disconnected, () => {
        this.logger.log('disconnected from room')
        if (config.handleDisconnected) {
          config.handleDisconnected()
        }
      })
      .on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: Participant, _?: DataPacket_Kind) => {
        if (config.handleDataReceived && participant) {
          config.handleDataReceived(participant.identity, payload)
        }
      })
  }

  async connect(): Promise<void> {
    await this.room.connect(this.config.url, this.config.token, { autoSubscribe: true });
    this.logger.log(`${this.localName()} connected to ${this.room.name}`)
  }

  async disconnect(): Promise<void> {
    return this.room.disconnect()
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


