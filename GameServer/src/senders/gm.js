const message = require('@local/shared/message');
const log = require('@local/shared/logger');

module.exports = {
    messageName: 'MSG_GM',
    send: function (session, msgId)
    {
        return (subType) =>
        {
            // TODO: figure out what the fug is this
            // 0x119240  4336  ?ReceiveGmMessage@CSessionState@@QAEXPAVCNetworkMessage@@@Z
            // -----------------------------------------------------------------------------
            // pcVar3 = *(char **)(param_1 + 0xc) + 1;
            // if ((char *)(*(int *)(param_1 + 4) + *(int *)(param_1 + 0x10)) < pcVar3) {
            //     pcVar3 = Translate(s_ETRSWarning:_Message_over-readin,4);
            //     CPrintF(pcVar3);
            //     cVar2 = '\0';
            // }
            // else {
            //     cVar2 = **(char **)(param_1 + 0xc);
            //     *(char **)(param_1 + 0xc) = pcVar3;
            //     *(undefined4 *)(param_1 + 0x14) = 0;
            // }
            // if (cVar2 == '\0') {
            //     pCVar1 = _pNetwork + 0xe610c;
            //     if ((CNetworkLibrary *)(*(int *)(param_1 + 4) + *(int *)(param_1 + 0x10)) <
            //         *(CNetworkLibrary **)(param_1 + 0xc) + 1) {
            //     pcVar3 = Translate(s_ETRSWarning:_Message_over-readin,4);
            //     CPrintF(pcVar3);
            //     *pCVar1 = (CNetworkLibrary)0x0;
            //     }
            //     else {
            //     *pCVar1 = **(CNetworkLibrary **)(param_1 + 0xc);
            //     *(int *)(param_1 + 0xc) = *(int *)(param_1 + 0xc) + 1;
            //     *(undefined4 *)(param_1 + 0x14) = 0;
            //     }
            //     CPrintF(s_I'm_a_GM,_level_%d._104f4928,(uint)(byte)_pNetwork[0xe610c]);
            // }
            // return;
            // }
            // -------------------------------------------------------------------------------

            const whoami = (level) =>
            {
                //var msg = new message({ type: msgId, subType: 0 });
                //msg.write('i8', level) // level
                //
                //session.write(msg.build());
            }

            const subTypeHandler = {
                'MSG_GM_WHOAMI': () => whoami(10)
                //'MSG_GM_COMMAND': () => command()
            };

            if(subType in subTypeHandler)
                subTypeHandler[subType]();
        }
    }
}