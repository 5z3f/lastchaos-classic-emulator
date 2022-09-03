# lastchaos-classic-emulator

![Nksp_9ulkIyPx49](https://user-images.githubusercontent.com/39301116/188268831-1a2ff0a4-9459-4311-943d-39a8fdf98206.png)

https://user-images.githubusercontent.com/39301116/187806343-64885c75-1463-4ced-ba07-f3c042920a7b.mp4

https://user-images.githubusercontent.com/39301116/187806405-9f6ee374-fb6b-48f0-9f19-84056b7196e0.mp4

# setup
```
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

# patches
```
> Description:      USA Client 1107 IP Filter Patch
> Starting Offset:  0x107379
> Replace:          3c 3d 75 16 80 3d 29 c1 58 10 68
>                   ->
>                   e9 ec 03 00 00 90 90 90 90 90 90
```

```
> Description:      USA Client 1107 SendToServerNew Encryption Patch
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
> Description:      USA Client 1107 ReceiveFromServerNew Encryption Patch
> Starting Offset:  0x111295
> Replace:          50 8d 4d bc e8 e2 0e 00 00
>                   ->
>                   90 90 90 90 90 90 90 90 90
```

```
> Patched Engine.dll:
> https://mega.nz/file/LvRX2CxI#K7vSD1BZp2DXUM6aBEkmkm-UMWPj0vWfgLHcO6gywEk
```

# about
```
> under construction
> by agsvn, Karmel0x
```
