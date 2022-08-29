#ifndef __LCCRYPT_H__
#define __LCCRYPT_H__

#define LCCNM_META_DATA_SIZE		5

// 암호키 정보 데이터
#define CNM_KEY_TYPE				unsigned int

// 암호/복호 버퍼 크기
#define CNM_TEMP_BUFFER_LENGTH	(MAX_MESSAGE_DATA + LCCNM_META_DATA_SIZE)

// 라이브러리에서 정의되야 되는 함수

#ifdef _MSC_VER
#ifdef  __cplusplus
extern "C" {
#endif // __cplusplus
#endif // _MSC_VER

// 암호키 초기화 함수
extern void CNM_InitKeyValue(CNM_KEY_TYPE* pKey);

// 암호키 생성 함수 : 현재 암호키로부터 다음 암호키를 생성
extern void CNM_NextKey(CNM_KEY_TYPE* pKey);

// 암호키 복사
extern void CNM_CopyKey(CNM_KEY_TYPE* pDestKey, const CNM_KEY_TYPE* pSrcKey);

// 암호화
// return value		암호화후 길이, 오류 발생시 음수
// pSrc				원본 데이터
// nLenSrc			원본 데이터 길이
// pKey				암호키 데이터
// pDest			대상 버퍼
extern int CNM_Crypt(const unsigned char* pSrc, int nLenSrc, CNM_KEY_TYPE* pKey, unsigned char* pDest, unsigned char* pTmpBuf);

// 복호화
// return value		복호후 길이, 오류 발생시 0 또는 음수
// pSrc				복호된 데이터
// nLenSrc			복호된 데이터 길이
// pKey				복호키 데이터
// pDest			대상 버퍼
// pTmpBuf			복호용 임시 버퍼
extern int CNM_Decrypt(const unsigned char* pSrc, int nLenSrc, CNM_KEY_TYPE* pKey, unsigned char* pDest, unsigned char* pTmpBuf);

/////////////////////////////////////////
// LC 자체 암호화에서는 미사용하는 함수들
// Seed 생성 : Client
// return value		생성된 Seed Value
// strID			User ID
// strPW			User Password
// nTickCount		return value of GetTickCount()
extern unsigned int CNM_MakeSeedForClient(const char* strID, const char* strPW, unsigned long nTickCount);

// Seed 생성 : Server
// return value		생성된 Seed Value
// nRandom			Random Value
// nPulse			Server Pulse
extern unsigned int CNM_MakeSeedForServer(int nRandomValue, int nServerPulse);

// Seed에서 Key 생성
// pKey				생성된 Key를 저장할 곳
// nSeed			사용할 Seed Value
extern void CNM_MakeKeyFromSeed(CNM_KEY_TYPE* pKey, unsigned int nSeed);
// LC 자체 암호화에서는 미사용하는 함수들
/////////////////////////////////////////

#ifdef _MSC_VER
#ifdef  __cplusplus
}
#endif // __cplusplus
#endif // _MSC_VER

#endif // __LCCRYPT_H__
