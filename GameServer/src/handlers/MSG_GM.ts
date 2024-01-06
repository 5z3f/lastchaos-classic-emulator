import log from '@local/shared/logger';
import Message from '@local/shared/message';
import Session from '@local/shared/session';
import commands from '../system/core/commands';
import { CharacterRole } from '../gameobject/character';
import { SendersType } from '../senders';
import { Color } from '../system/core/chat';

export enum GMMessageType {
    WhoAmI,
    Command,
}

function handleWhoAmI(session: Session<SendersType>) {
    if (session.character.role == CharacterRole.None)
        return;

    session.send.gm({
        subType: GMMessageType.WhoAmI,
        level: 10, // TODO: implement role levels
    }); 

    const roleName = CharacterRole[session.character.role];
    session.character.chat.system(`Authorized as ${roleName}`, Color.LightSeaGreen);
}

function handleCommand(session: Session<SendersType>, msg: Message) {
    const data = {
        command: msg.read('stringnt'),
    };

    const [commandName, ...args] = data.command.split(' ');
    const command = commands[commandName];

    if(!command) {
        session.character.chat.system(`Unknown command: ${commandName}`, Color.IndianRed);
        return;
    }

    command.execute(args, session)
}

export default function (session: Session<SendersType>, msg: Message) {
    let subType = msg.read('u8') as GMMessageType;

    switch (subType) {
        case GMMessageType.WhoAmI:
            handleWhoAmI(session);
            break;

        case GMMessageType.Command:
            handleCommand(session, msg);
            break;

        default:
            log.error(`Unhandled message subtype: ${subType}`);
            break;
    }
}