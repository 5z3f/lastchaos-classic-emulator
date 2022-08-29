#include <stdlib.h>
#include "LCCrypt.h"
#include "LCCrypt_Internel.h"

void CNM_InitKeyValue(CNM_KEY_TYPE* pKey)
{
	*pKey = CNM_INIT_KEY;
}

void CNM_NextKey(CNM_KEY_TYPE* pKey)
{
	*pKey = LCCNM_MAKELONG((unsigned char)rand(), (unsigned char)rand(), (unsigned char)rand(), (unsigned char)rand());
}

void CNM_CopyKey(CNM_KEY_TYPE* pDestKey, const CNM_KEY_TYPE* pSrcKey)
{
	*pDestKey = *pSrcKey;
}

int CNM_Crypt(const unsigned char* pSrc, int nLenSrc, CNM_KEY_TYPE* pKey, unsigned char* pDest)
{
	return LCCrypt_Crypt(pSrc, nLenSrc, *pKey, pDest);
}

int CNM_Decrypt(const unsigned char* pSrc, int nLenSrc, CNM_KEY_TYPE* pKey, unsigned char* pDest, unsigned char* pTmpBuf)
{
	return LCCrypt_Decrypt(pSrc, nLenSrc, *pKey, pDest, pTmpBuf);
}

unsigned int CNM_MakeSeedForClient(const char* strID, const char* strPW, unsigned long nTickCount)
{
	return 0;
}

unsigned int CNM_MakeSeedForServer(int nRandomValue, int nServerPulse)
{
	return 0;
}

void CNM_MakeKeyFromSeed(CNM_KEY_TYPE* pKey, unsigned int nSeed)
{
	return ;
}
