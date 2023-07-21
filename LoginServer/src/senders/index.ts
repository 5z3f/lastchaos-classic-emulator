
import session from '@local/shared/session';
import channelInfo from './channelInfo';
import fail from './fail';


export default (session: session) => {
    const send = {
        channelInfo: channelInfo(session),
        fail: fail(session),
    };

    return send;
}
