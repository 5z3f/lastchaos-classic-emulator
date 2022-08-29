{
  "targets": [
    {
      "target_name": "LCCrypt",
      "sources": [
        "main.cpp"
      ],
      "include_dirs": [
        '../',
      ],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": ["NAPI_CPP_EXCEPTIONS"],
      "libraries": []
    }
  ]
}