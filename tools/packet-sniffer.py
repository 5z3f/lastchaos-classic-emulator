import os
import time
import json
import frida
import argparse
import psutil

parser = argparse.ArgumentParser(description="Hook script")
parser.add_argument("--version", type=int, required=1107, help="Client version")
parser.add_argument("--packdefault", type=bool, required=True, help="Is first byte packed?")
args = parser.parse_args()

clientVersion = args.version
packDefault = args.packdefault

offsets = {
    "CNM_Crypt": {
        1107: 0x104048E0,
        112009: 0x1045B0D0
    },
    "CNM_Decrypt": {
        1107: 0x10404C00,
        112009: 0x1045B3F0
    }
}

frida_script = """
    const CNM_TEMP_BUFFER_LENGTH = ((1000 - 1) + 5);
    const offsets = %OFFSETS%;
    const clientVersion = %CLIENT_VERSION%;
    const packDefault = %PACK_DEFAULT%;

    // attach to CNM_Crypt function
    if(offsets.CNM_Crypt[clientVersion]) {
        Interceptor.attach(ptr(offsets.CNM_Crypt[clientVersion]), {
            onEnter: function(args) {
                // before encryption
                const size = args[1].toInt32();
                const msgBuf = Memory.readByteArray(args[0], size);
                const msgBufArray = Array.from(new Uint8Array(msgBuf));

                // encrypted buffer
                const key = args[2].toInt32();
                const buf = Memory.readByteArray(args[3], CNM_TEMP_BUFFER_LENGTH);

                send({ type: 'send', buffer: msgBufArray });
            }
        });
    }

    // attach to CNM_Decrypt function
    if(offsets.CNM_Decrypt[clientVersion]) {
        Interceptor.attach(ptr(offsets.CNM_Decrypt[clientVersion]), {
            onEnter: function(args) {
                const size = args[1].toInt32();
                const encMsgPtr = args[0];
                const encKey = args[2].toInt32();

                const encMsgByteArray = Memory.readByteArray(encMsgPtr, size);
                const encMsgArray = Array.from(new Uint8Array(encMsgByteArray));

                if(packDefault) {
                    // lets unpack the message type
                    encMsgArray[0] ^= 2 << 6;
                }

                this.decMsgPtr = args[3];

                if(clientVersion == 1107) {
                    this.decMsgArray = encMsgArray; // on this version we can do so because the engine was patched
                }
                else {
                    // FIXME: decrypted buffer is empty (even on onLeave event...)
                    this.decMsgArray = Array.from(new Uint8Array(this.decMsgByteArray));
                }

                send({ type: 'recv', buffer: this.decMsgArray });
            },
            // onLeave: function(retval) {
            //     // FIXME: decrypted buffer is empty...
            //     const decMsgByteArray = Memory.readByteArray(this.decMsgPtr, CNM_TEMP_BUFFER_LENGTH);
            //     send({ type: 'recv', buffer: decMsgByteArray });
            // }
        });
    }
"""

# replace placeholders with actual values
frida_script = frida_script.replace("%OFFSETS%", json.dumps(offsets))
frida_script = frida_script.replace("%CLIENT_VERSION%", str(clientVersion))
frida_script = frida_script.replace("%PACK_DEFAULT%", str(packDefault).lower())

def on_message(message, data):
    if message['type'] == 'send':
        bytes = message['payload']['buffer']
        formatted_bytes = ', '.join(f'0x{byte:x}' for byte in bytes)
        ascii_representation = ''.join(chr(byte) if 32 <= byte < 127 else '.' for byte in bytes)
        line = f"[{message['payload']['type']}] {len(bytes)} bytes: {formatted_bytes} | {ascii_representation}"

        with open(os.path.join(base_process_dir, 'msglog.txt'), 'a') as f:
            f.write(line + "\n")

        print(line)
    else:
        print(message)

# loop until process is found
while True:
    try:
        session = frida.attach("Nksp.exe")
        device = frida.get_local_device()
        processes = device.enumerate_processes()
        for process in processes:
            if process.name == "Nksp.exe":
                print(f"Found Nksp.exe with PID {process.pid}")
                process_path = psutil.Process(process.pid).exe()
                process_dir = os.path.dirname(process_path)
                base_process_dir = os.path.dirname(process_dir)
                break
        break
    except frida.ProcessNotFoundError:
        print("Nksp.exe not found, waiting...")
        time.sleep(1)

script = session.create_script(frida_script)

script.on('message', on_message)
script.load()

# prevent script from terminating
input()