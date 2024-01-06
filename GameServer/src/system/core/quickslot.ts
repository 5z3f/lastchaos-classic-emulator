import database from "../../database";
import Character from "../../gameobject/character";
import { CharacterEvents } from "../../gameobject";
import { InventoryTabType } from "./inventory";
import { QuickSlotMessageType } from "../../handlers/MSG_QUICKSLOT";

export enum QuickSlotType {
    Empty = -1,
    Skill,
    Action,
    Item,
}

export const QUICKSLOT_MAXSLOT = 10;
export const QUICKSLOT_PAGE_NUM = 3;

type QuickslotItem = [ number, number, number ];

export default class Quickslot {
    owner: Character;
    quickSlots: Array<Array<Array<number>>>;
    emptyQuickslotItem: QuickslotItem = [ -1, -1, -1 ];

    constructor(owner: Character) {
        this.owner = owner;

        this.quickSlots = Array.from({ length: QUICKSLOT_PAGE_NUM }, () => 
            Array.from({ length: QUICKSLOT_MAXSLOT }, () => this.emptyQuickslotItem)
        );

        // TODO: fix types here, src/dst = { uid, col, row }
        this.owner.on(CharacterEvents.InventorySwap, (tab, src, dst) => {
            if(tab != InventoryTabType.Normal)
                return;

            const triggeredSlotSrc = this.find(QuickSlotType.Item, src.col, src.row);
            const triggeredSlotDst = this.find(QuickSlotType.Item, dst.col, dst.row);

            if(triggeredSlotDst) {
                const [ pageId, slotId ] = triggeredSlotDst;
                this.add({
                    pageId: pageId,
                    slotId: slotId,
                    slotType: (src.uid === -1) ? QuickSlotType.Empty : QuickSlotType.Item,
                    value1: (src.uid === -1) ? -1 : dst.col,
                    value2: (src.uid === -1) ? -1 : dst.row
                })
            }

            if(triggeredSlotSrc) {
                const [ pageId, slotId ] = triggeredSlotSrc;
                this.add({
                    pageId: pageId,
                    slotId: slotId,
                    slotType: (dst.uid === -1) ? QuickSlotType.Empty : QuickSlotType.Item,
                    value1: (dst.uid === -1) ? -1 : src.col,
                    value2: (dst.uid === -1) ? -1 : src.row
                })
            }

            
            //this.owner.session.send.quickslot(0, 0);
            console.log('inventory swap', tab, src, dst);
        });
    }

    find(slotType: QuickSlotType, value1: number, value2: number) {
        for(let pageId = 0; pageId < this.quickSlots.length; pageId++) {
            for(let slotId = 0; slotId < this.quickSlots[pageId].length; slotId++) {
                const [ slotTypeId, v1, v2 ] = this.quickSlots[pageId][slotId];

                if(slotTypeId == slotType && v1 == value1 && v2 == value2)
                    return [ pageId, slotId ];
            }
        }
    }

    update(pageId: number, slotId: number, slotType: QuickSlotType, value1: number, value2: number) {
        this.quickSlots[pageId][slotId] = [ slotType, value1, value2 ];
    }

    async add({ pageId, slotId, slotType, value1, value2 = -1, updateDb = true, sendPacket = true }) {
        this.update(pageId, slotId, slotType, value1, value2);

        if(updateDb) {
            // TODO: update single row
            await database.quickslot.update(this.owner.id, pageId, this.quickSlots[pageId]);
        }

        if(sendPacket) {
            this.owner.session.send.quickslot(QuickSlotMessageType.Add, {
                pageId,
                slotId
            });
        }
    }

    async remove({ pageId, slotId }) {
        this.quickSlots[pageId][slotId] = this.emptyQuickslotItem;

        // TODO: update single row
        await database.quickslot.update(this.owner.id, pageId, this.quickSlots[pageId]);
        this.owner.session.send.quickslot(QuickSlotMessageType.Add, {
            pageId,
            slotId
        });

        this.owner.session.send.quickslot
    }

    async swap({ pageId, slotIdFrom, slotIdTo }) {
        const from = this.quickSlots[pageId][slotIdFrom];

        this.quickSlots[pageId][slotIdFrom] = this.quickSlots[pageId][slotIdTo];        
        this.quickSlots[pageId][slotIdTo] = from;

        // TODO: update single row
        await database.quickslot.update(this.owner.id, pageId, this.quickSlots[pageId]);
        
        this.owner.session.send.quickslot(QuickSlotMessageType.Add, {
            pageId,
            slotId: slotIdTo
        });

        this.owner.session.send.quickslot(QuickSlotMessageType.Add, {
            pageId,
            slotId: slotIdFrom
        });
    }
}