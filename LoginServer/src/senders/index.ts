
import session from '@local/shared/session';
import channelInfo from './channelInfo';
import fail from './fail';

export type SendersType = {
    channelInfo: ReturnType<typeof channelInfo>,
    fail: ReturnType<typeof fail>,
}


export default (session: session<SendersType>) => {
    const send = {
        channelInfo: channelInfo(session),
        fail: fail(session),
    };

    return send;
}
