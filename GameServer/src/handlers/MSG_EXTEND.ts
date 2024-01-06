import log from '@local/shared/logger';
import Message from '@local/shared/message';
import Session from '@local/shared/session';
import { Statistic } from '../types';
import { SendersType } from '../senders';
import game from '../game';
import Character from '../gameobject/character';
import { GameObjectType } from '../gameobject';

export enum ExtendMessageType {
    //String = 27,              // TODO: perform tests on it
    Messenger = 28
}

export enum ExtendMessengerType {
    Invite,
    Out,
    CharList,
    Chat,
    GroupAdd,
    GroupDelete,
    GroupChange,
    GroupMove,
    GroupList,
    ChangeChatColor,
    Block,
    Unblock,
    BlockList,
    OneVsOne,
    NotDelivered,
}

export default function (session: Session<SendersType>, msg: Message) {
    let subType = msg.read('i32>') as ExtendMessageType;

    switch (subType) {
        case ExtendMessageType.Messenger:
            var thirdType = msg.read('u8');

            switch(thirdType) {
                case ExtendMessengerType.GroupAdd:
                    const groupName = msg.read('stringnt');
                    console.log(groupName)
                    break;
                case ExtendMessengerType.OneVsOne:
                    const data = {
                        senderUid: msg.read('i32>'),
                        receiverId: msg.read('i32>'),
                        text: msg.read('stringnt')
                    }

                    if(data.senderUid !== session.character.uid) {
                        // TODO: malformed packet, log it
                        return;
                    }

                    session.send.extend({
                        subType: ExtendMessageType.Messenger,
                        thirdType: ExtendMessengerType.OneVsOne,
                        senderUid: session.character.uid,
                        senderNickname: session.character.nickname,
                        receiverUid: data.receiverId,
                        colorId: 1, // tmp
                        text: data.text
                    })

                    // TODO: handle system messages
                    if (data.receiverId === 0) {
                        session.send.extend({
                            subType: ExtendMessageType.Messenger,
                            thirdType: ExtendMessengerType.OneVsOne,
                            senderUid: 0,
                            senderNickname: 'System',
                            receiverUid: session.character.uid,
                            colorId: 1,
                            text: 'lorem ipsum'
                        });
                    }
                    else {
                        const receiverCharacter: Character = game.world.find(GameObjectType.Character, (ch: Character) => ch.id == data.receiverId);

                        receiverCharacter.session.send.extend({
                            subType: ExtendMessageType.Messenger,
                            thirdType: ExtendMessengerType.OneVsOne,
                            senderUid: session.character.id,
                            senderNickname: session.character.nickname,
                            receiverUid: receiverCharacter.uid,
                            colorId: 1, // TODO: messenger chat color enum
                            text: data.text
                        });
                    }
                    break;
            }
            
            break;
    }
}