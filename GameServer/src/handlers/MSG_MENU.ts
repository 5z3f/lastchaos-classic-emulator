import log from '@local/shared/logger';
import api from '../api';

import Character from '../gameobject/character';
import { Statistic, Modifier, ModifierType } from '../types/statistic';
import Position from '../types/position';
import app from '../app';
import game from '../game';
import database from '../database';

export default function (session, msg) {
    let subType = msg.read('u8') as number;
    let subTypeMap = {
        0: 'MSG_MENU_NEW',
        2: 'MSG_MENU_START',
    };

    const subTypeHandler = {
        MSG_MENU_NEW: async () => {
            let data = {
                nickname: msg.read('stringnt') as string,
                classId: msg.read('u8') as number,
                hairId: msg.read('u8') as number,
                faceId: msg.read('u8') as number,
                jobId: 0,
            };

            const MAX_CLASSES = 6;
            const MAX_FACESTYLES = 3;
            const MAX_HAIRSTYLES = 3;

            // TODO: packet is probably malformed, log it
            if (data.faceId >= MAX_FACESTYLES || data.hairId >= MAX_HAIRSTYLES || data.jobId >= MAX_CLASSES)
                return;

            const [exists] = await database.characters.exists(data.nickname);

            if (exists) {
                session.send.fail(10); // MSG_FAIL_DB_ALREADY_NAME
                return;
            }

            const result = await database.characters.create({
                accountId: session.accountId,
                nickname: data.nickname,
                classId: data.classId,
                faceId: data.faceId,
                hairId: data.hairId
            });

            if (!result) {
                session.send.fail(14); // MSG_FAIL_DB_UNKNOWN
                return;
            }

            const charId = result.insertId;

            // TODO: add standard items here (?)

            // TODO: this code is duplicated, we need to import it from somewhere (origin: MSG_LOGIN)
            const dbCharacters = await database.accounts.getCharacters(session.accountId);
            if (!dbCharacters) {
                session.send.fail(14); // MSG_FAIL_DB_UNKNOWN
                return;
            }

            for (let dbCharacter of dbCharacters) {
                const wearingItems = await database.characters.getWearingItems(dbCharacter.id);

                if (!wearingItems) {
                    session.send.fail(14); // MSG_FAIL_DB_UNKNOWN
                    return;
                }

                session.send.db('MSG_DB_CHAR_EXIST', [dbCharacter, wearingItems]);
            }

            session.send.db('MSG_DB_CHAR_END');
        },
        MSG_MENU_START: async () => {
            let characterId = msg.read('i32>') as number; // selected character id

            const dbCharacter = await database.characters.getById(characterId);

            // TODO: packet is malformed, log it
            if (!dbCharacter) {
                session.send.fail(13); // MSG_FAIL_DB_NOT_EXIST_CHAR
                return;
            }

            const startingZone = game.world.get('zone', 0);

            let character = new Character({
                session: session,
                uid: session.uid,
                id: dbCharacter.id,
                classType: dbCharacter.class,
                jobType: dbCharacter.profession,
                zone: startingZone,
                areaId: 0,
                appearance: {
                    hairType: dbCharacter.hair,
                    faceType: dbCharacter.face
                },
                progress: {
                    level: dbCharacter.level,
                    experience: dbCharacter.experience,
                    maxExperience: 100,                                     // FIXME: probably will be removed later (?)
                    skillpoint: dbCharacter.skillpoint
                },
                //@ts-ignore
                statistics: {
                    runSpeed: new Statistic(20.0),
                    attack: new Statistic(100),                                     // TODO:
                    magicAttack: new Statistic(100),                                // TODO:
                    defense: new Statistic(100),                                    // TODO:
                    magicResist: new Statistic(100),                                // TODO:
                    walkSpeed: new Statistic(10.0),                                 // TODO:
                    attackRange: new Statistic(2.3),                                // TODO:
                    attackSpeed: new Statistic(10.0),                               // TODO:
                    statpoints: dbCharacter.statpoints,
                    strengthAdded: dbCharacter.strength,
                    dexterityAdded: dbCharacter.dexterity,
                    intelligenceAdded: dbCharacter.intelligence,
                    conditionAdded: dbCharacter.condition,
                },
                nickname: dbCharacter.nickname,
                position: new Position(1111, 951, 160.3)                    // TODO: add default spawnpoints and radius on it
            });

            // pin character to our session
            session.character = character;

            // send start game message
            session.send.db('MSG_DB_OK');
        }
    };

    if (subTypeMap[subType] in subTypeHandler)
        subTypeHandler[subTypeMap[subType]]();
}
