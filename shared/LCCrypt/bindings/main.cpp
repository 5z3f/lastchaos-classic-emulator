#include <stdio.h>
#include <string>
#include <cstring>

#define MAX_MESSAGE_DATA (1000 - 1)

#include <CryptNetMsg.h>

#include <node_api.h>


napi_value LCCrypt_Crypt_1(napi_env env, napi_callback_info info) {
	size_t argc = 1;
	napi_value args[1];
	napi_get_cb_info(env, info, &argc, args, NULL, NULL);

	unsigned char* pSrc;
	size_t nLenSrc;
	napi_get_buffer_info(env, args[0], (void**)&pSrc, &nLenSrc);

	unsigned int nKey = CNM_INIT_KEY;

	unsigned char * pDest = NULL;
	int nLenDest = CNM_Crypt(pSrc, (int)nLenSrc, nKey, &pDest);

	napi_value value;
	if(nLenDest > 0){
		napi_create_external_buffer(env, nLenDest, pDest, NULL, NULL, &value);
	}
	return value;
}

napi_value LCCrypt_Decrypt_1(napi_env env, napi_callback_info info) {
	size_t argc = 1;
	napi_value args[1];
	napi_get_cb_info(env, info, &argc, args, NULL, NULL);

	unsigned char* pSrc;
	size_t nLenSrc;
	napi_get_buffer_info(env, args[0], (void**)&pSrc, &nLenSrc);

	unsigned int nKey = CNM_INIT_KEY;

	unsigned char * pDest = NULL;
	int nLenDest = CNM_Decrypt(pSrc, (int)nLenSrc, nKey, &pDest);

	napi_value value;
	
	if(nLenDest > 0){
		napi_create_external_buffer(env, nLenDest, pDest, NULL, NULL, &value);
	}
		
	return value;
}


napi_value Init(napi_env env, napi_value exports) {

	napi_value fn;

	napi_create_function(env, NULL, 0, LCCrypt_Crypt_1, NULL, &fn);
	napi_set_named_property(env, exports, "Crypt", fn);

	napi_create_function(env, NULL, 0, LCCrypt_Decrypt_1, NULL, &fn);
	napi_set_named_property(env, exports, "Decrypt", fn);

	return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)

