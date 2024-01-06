import api from '../api';
import game from '../game';
import Message from '@local/shared/message';
import Session from '@local/shared/session';
import { SendersType } from '../senders';
import Character from '../gameobject/character';
import { GameObjectType } from '../gameobject';

export default async function (session: Session<SendersType>, msg: Message) {
    const data = {
        chatType: msg.read('u8'),
        senderId: msg.read('i32>'),
        senderName: msg.read('stringnt'),
        receiverName: msg.read('stringnt'),
        text: msg.read('stringnt'),
    };

    if(data.senderId != session.character.uid || data.senderName != session.character.nickname) {
        // TODO: log this
        return;
    }

    const senderCharacter = game.world.find(GameObjectType.Character, (ch: Character) => ch.uid == data.senderId);
    const receiverCharacter = game.world.find(GameObjectType.Character, (ch: Character) => ch.nickname == data.receiverName);

    api.chat.message({
        chatType: data.chatType,
        senderCharacter,
        receiverCharacter,
        text: data.text,
    })
}
