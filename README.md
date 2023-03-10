# lastchaos-classic-emulator
![Nksp_XuX5KlFjEQ](https://user-images.githubusercontent.com/39301116/224224116-f1b8efe9-82a4-4859-a0e5-76748a43fd5a.png)

https://user-images.githubusercontent.com/39301116/187806343-64885c75-1463-4ced-ba07-f3c042920a7b.mp4


# setup
```
Import lastchaos.sql to into your database and set connection details in the .env file

> npm install

> npm run loginserver
> npm run gameserver
```

# client

**Server is currently based on client:**
```
> Nation:           USA
> Version:          1107
> Release date:     07.2008
> --------------------------
> Download:
> https://mega.nz/file/Gy43nbBJ#ZmtL2TLEZbhz7DRGW8VA1Cg5p40r6LdYkWCekZd1bN0
> --------------------------
```

**How to run it**

[sl.dta (test 127.0.0.1 4191)](https://github.com/5z3f/lastchaos-classic-emulator/files/10030763/sl.zip)

[LastChaosDTA.exe](https://github.com/5z3f/lastchaos-classic-emulator/files/10042812/LastChaosDTA.zip)

```
> 1. Change IP to localhost inside sl.dta using LastChaosDTA editor (or replace the file with the one I provided above)
> 2. start bin/Nksp.exe 6574
```

```
Ingame account:
Username: test
Password: test
```

# patches [USA Client 1107]
```
> File:             Engine.dll
> Description:      IP Filter Patch
> Starting Offset:  0x107379
> Replace:          3c 3d 75 16 80 3d 29 c1 58 10 68
>                   ->
>                   e9 ec 03 00 00 90 90 90 90 90 90
```

```
> File:             Engine.dll
> Description:      ReceiveFromServerNew() Encryption Patch
> Starting Offset:  0x11110f
> Replace:          85 c0 7d 04 33 f6 eb 1f 8b 7b 04 8b c8 8b d1 c1
>                   e9 02 8d b5 0c fc ff ff f3 a5 8b ca 83 e1 03 f3
>                   a4 8b 75 08 89 43 10
>                   ->
>                   90 90 90 90 90 90 90 90 90 90 90 90 90 90 90 90
>                   90 90 90 90 90 90 90 90 90 90 90 90 90 90 90 90
>                   90 90 90 90 90 90 90
```

```
> File:             Engine.dll
> Description:      SendToServerNew() Encryption Patch
> Starting Offset:  0x111295
> Replace:          50 8d 4d bc e8 e2 0e 00 00
>                   ->
>                   90 90 90 90 90 90 90 90 90
```

```
> File:             EntitiesMP.dll
> Description:      SendMyNextMovePosition() Tick Patch (1s -> 100ms)
> Starting Offset:  0x00ED880
> Replace:          E8 03 00 00
>                   ->
>                   64 00 00 00
```

```
> Patched Engine.dll:
> https://mega.nz/file/LnRRURYC#tcxf1G21AegtNgfWa41Y8K-5X0Q5cpmZRazhS4k4CkQ
```

```
> Patched EntitiesMP.dll:
> https://mega.nz/file/G6wWwDTT#uyy6BMqm9WX2QvW8VzKZtl6ryRVm9fKgWna4W0Ks9zk
```

# about
```
> under construction
> by agsvn, Karmel0x
```
