import Session from "@local/shared/session";
import { CharacterRole } from "../../gameobject/character";
import { Buff, BuffOrigin } from "./buff";
import { Modifier, ModifierType, Statistic } from "./statistic";
import api from "../../api";
import { ItemMessageType } from "../../api/item";
import game from "../../game";
import { ContentType } from "../../content";
import BaseItem from "../../baseobject/item";
import Monster from "../../gameobject/monster";
import { SendersType } from "../../senders";
import { ChatType, Color } from "../../system/core/chat";
import { GameObjectType } from "../../gameobject";
import { ZoneType } from "../../world";

const commands =  {
    "help": {
        "description": "Displays a list of commands.",
        "usage": "/help",
        execute: (args: string[], session: Session<SendersType>) => {
            const availableCommands = Object.keys(commands)
                .filter(command => command !== "help")
                .map(command => {
                    return commands[command].usage;
                });
            
            for(let i = 0; i < availableCommands.length; i++) {
                api.chat.message({
                    chatType: ChatType.Whisper,
                    text: availableCommands[i],
                    senderCharacter: '',
                    receiverCharacter: session.character
                });
            }
        }
    },
    "speedup": {
        "description": "Speeds up the character by a given amount",
        "usage": "/speedup <speed>",
        execute: (args: string[], session: Session<SendersType>) => {
            const speed = parseFloat(args[0]);

            // remove previous speed buff
            let prevRunSpeedBuff = session.character.buffs.find(BuffOrigin.Command, '/speedup');

            if(prevRunSpeedBuff)
                session.character.buffs.remove(prevRunSpeedBuff);


            let runSpeedBefore = session.character.statistics.runSpeed.getTotalValue();
            let runSpeedBuff = new Buff(session.character, BuffOrigin.Command, '/speedup', [
                [session.character.statistics.runSpeed, new Modifier(ModifierType.Additive, speed)]
            ]);

            session.character.buffs.add(runSpeedBuff);
            api.chat.system(session.character, `Applied running speed buff (${runSpeedBefore} >> ${session.character.statistics.runSpeed.getTotalValue()})`, Color.LightSeaGreen);
        }
    },
    "itemdrop": {
        "description": "Drops an item",
        "usage": "/itemdrop <itemId> <amount> <plus>",
        execute: async (args: string[], session: Session<SendersType>) => {
            let itemId = parseInt(args[0]);
            let amount = parseInt(args[1]);
            let plus = parseInt(args[2]);
            
            if (!itemId)
                return;

            let itemUid = await api.item.create({
                id: itemId,
                owner: session.character,
                stack: amount || 1,
                plus: plus || 0
            });
        
            // TODO: log and raise error message
            if (!itemUid)
                return;

            session.send.item({
                subType: ItemMessageType.Drop,
                itemUid: itemUid,
                itemId: itemId,
                stack: amount || 1,
                position: session.character.position,
                objType: 1,
                objUid: session.character.uid,
                alive: 0 // TODO: implement
            });

            api.chat.system(session.character, `Item created (uid: ${itemUid}, id: ${itemId})`, Color.LightSeaGreen);
        }
    },
    "itemget": {
        "description": "Gets an item",
        "usage": "/itemget <itemId> <amount> <plus>",
        execute: async (args: string[], session: Session<SendersType>) => {
            let itemId = parseInt(args[0]);
            let amount = parseInt(args[1]);
            let plus = parseInt(args[2]);

            let itemUid = await api.item.create({
                id: itemId,
                owner: session.character,
                stack: amount || 1,
                plus: plus || 0,
                into: 'inventory'
            });

            api.chat.system(session.character, `Item created (uid: ${itemUid}, id: ${itemId})`, Color.LightSeaGreen);
        }
    },
    "search": {
        "description": "Search for content by name",
        "usage": "/search <contentType> <itemName> <?page> <?itemsPerPage>",
        execute: async (args: string[], session: Session<SendersType>) => {
            const contentTypeMap = {
                'item': ContentType.Item,
                'monster': ContentType.Monster,
                'npc': ContentType.NPC
            };
        
            const contentType = contentTypeMap[args[0].toLowerCase()];

            if(contentType == undefined) {
                api.chat.system(session.character, 'Please provide a valid content type', Color.IndianRed);
                return;
            }

            const text = args[1] ? args[1].toLowerCase() : '';

            if(!text) {
                api.chat.system(session.character, 'Please provide a search term', Color.IndianRed);
                return;
            }
        
            const content = game.content.filter(contentType, (item: BaseItem) => item.name.toLowerCase().includes(text.toLowerCase()));
            
            // pagination
            const page = args[2] ? parseInt(args[2]) : 1;
            const contentPerPage = args[3] ? parseInt(args[3]) : 10;        
            const start = (page - 1) * contentPerPage;
            const end = start + contentPerPage;
            const paginatedItems = content.slice(start, end);
            const totalPages = Math.ceil(content.length / contentPerPage);

            api.chat.message({
                chatType: ChatType.Whisper,
                text: `Search results for "${text}" ${ page <= totalPages ? `| Page ${page} of ${totalPages}` : '' }`,
                senderCharacter: '',
                receiverCharacter: session.character
            });

            if(!paginatedItems.length) {
                api.chat.system(session.character, `No results found`, Color.IndianRed);
                return;
            }
        
            for (const item of paginatedItems) {
                api.chat.message({
                    chatType: ChatType.Whisper,
                    text: `ID: ${item.id} [${item.name}]`,
                    senderCharacter: '',
                    receiverCharacter: session.character
                });
            }
        }
    },
    "spawn" :{
        "description": "Spawns a monster or npc",
        "usage": "/spawn <monsterId>",
        execute: (args: string[], session: Session<SendersType>) => {
            // TODO: Spawn NPCs
            const contentId = parseInt(args[0]);

            // find monster from database by id
            const baseMonster = game.content.monsters.find((m) => m.id == contentId);

            if (!baseMonster) {
                api.chat.system(session.character, `Not found monster with id ${contentId}`, Color.IndianRed);
                return;
            }

            let monster = new Monster({
                id: baseMonster.id,
                flags: baseMonster.flags,
                level: baseMonster.level,
                zone: session.character.zone,
                position: session.character.position,
                respawnTime: 0, // TODO:
                //@ts-ignore
                statistics: {
                    health: baseMonster.statistics.health,
                    maxHealth: new Statistic(baseMonster.statistics.health),
                    mana: baseMonster.statistics.mana,
                    maxMana: new Statistic(baseMonster.statistics.mana),
                    attack: new Statistic(baseMonster.statistics.attack),
                    magicAttack: new Statistic(baseMonster.statistics.magicAttack),
                    defense: new Statistic(baseMonster.statistics.defense),
                    magicResist: new Statistic(baseMonster.statistics.magicResist),
                    walkSpeed: new Statistic(baseMonster.statistics.walkSpeed),
                    runSpeed: new Statistic(baseMonster.statistics.runSpeed),
                    attackRange: new Statistic(baseMonster.statistics.attackRange),
                    attackSpeed: new Statistic(baseMonster.statistics.attackSpeed),
                },
                statpoints: {
                    strength: baseMonster.statistics.strength,
                    dexterity: baseMonster.statistics.dexterity,
                    intelligence: baseMonster.statistics.intelligence,
                    condition: baseMonster.statistics.condition,
                }
            });

            game.world.add(GameObjectType.Monster, ZoneType.Juno, monster);
            monster.appear(session.character);
            
            api.chat.system(session.character, `Spawned monster ${contentId}`, Color.LightSeaGreen);
        }
    },
    "hp" : {
        "description": "Set character's health points by percentage or value (can't exceed max health points)",
        "usage": "/hp <percentOrValue>",
        execute: (args: string[], session: Session<SendersType>) => {
            const percentage = args[0].includes('%');

            let value = 0;
            if(percentage) {
                value = parseInt(args[0].replace('%', ''));
                value = session.character.statistics.maxHealth.getTotalValue() * (value / 100);
            }
            else {
                value = parseInt(args[0]);
            }

            if (value < 1) {
                api.chat.system(session.character, `Please provide a valid value`, Color.IndianRed);
                return;
            }

            if (value > session.character.statistics.maxHealth.getTotalValue()) {
                api.chat.system(session.character, `Health value can't exceed max health points`, Color.IndianRed);
                return;
            }

            session.character.statistics.health = value;
            session.character.updateStatistics();

            api.chat.system(session.character, `Set health points to ${value}`, Color.LightSeaGreen);
        }
    }

}

export default commands;