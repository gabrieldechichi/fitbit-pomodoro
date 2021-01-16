import { MessageSocket } from 'messaging';
import { createMock } from 'ts-auto-mock';

export let peerSocket = createMock<MessageSocket>()