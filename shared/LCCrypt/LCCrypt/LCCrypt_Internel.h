#ifndef __LC_CRYPT_INTERNEL_H__
#define __LC_CRYPT_INTERNEL_H__

// 암호키 초기 값
#define CNM_INIT_KEY		((unsigned int)(1852535664))	// 초기 키 값 : nksp

// 4바이트 변수에서 각 바이트 값을 unsigned char로 얻음, 하위 바이트 0 ~ 최상위 바이트 3
#define LCCNM_BYTE_0(n)		((unsigned char)((n      ) & 0x000000ff))
#define LCCNM_BYTE_1(n)		((unsigned char)((n >>  8) & 0x000000ff))
#define LCCNM_BYTE_2(n)		((unsigned char)((n >> 16) & 0x000000ff))
#define LCCNM_BYTE_3(n)		((unsigned char)((n >> 24) & 0x000000ff))

#define LCCNM_DUMMY_SIZE		(1)								// 더미 사이즈 : 더미는 메시지 타입 대신에 CNetMsg에서 사용
#define LCCNM_BEGIN_SIZE		(1)								// 시작 마크 크기
#define LCCNM_END_SIZE			(1)								// 끝 마크 크기
#define LCCNM_CHECKSUM_SIZE		(2)								// 체크섬 크기

#define LCCNM_DUMMY_TYPE		((unsigned char)1)				// 더미
#define LCCNM_BEGIN_MARK		((unsigned char)('l'))			// 시작 마크 : l
#define LCCNM_END_MARK		((unsigned char)('c'))			// 시작 마크 : c

#define LCCNM_CRC				(0x8003)						// CRC-16

#define LCCNM_ROTATE_RIGHT(n)	((unsigned char)((((n << 7) & 0x80) | ((n >> 1) & 0x7f)) & 0xff))
#define LCCNM_ROTATE_LEFT(n)	((unsigned char)(((n >> 7) & 0x01) | ((n << 1) & 0xfe) & 0xff))

#define LCCNM_MAKEWORD(low, high)			((unsigned short)(((high << 8) & 0xff00) | (low & 0x00ff)))
#define LCCNM_MAKELONG(b0, b1, b2, b3)	((unsigned int)((b0 & 0x000000ff) | ((b1 << 8) & 0x0000ff00) | ((b2 << 16) & 0x00ff0000) | ((b3 << 24) & 0xff000000)))

// return value		암호화된 길이, 오류시 -1
// pSrc				원본 데이터
// nLenSrc			원본 길이
// nKey				암호키
// pDest			암호 데이터 버퍼
int LCCrypt_Crypt(const unsigned char* pSrc, int nLenSrc, unsigned int nKey, unsigned char* pDest);

// return value		복호된 길이, 오류시 -1
// pSrc				복호 데이터
// nLenSrc			복호 길이
// nKey				암호키
// pDest			평문 데이터 버퍼
// pTmpBuf			변환 임시 버퍼
int LCCrypt_Decrypt(const unsigned char* pSrc, int nLenSrc, unsigned int nKey, unsigned char* pDest, unsigned char* pTmpBuf);

#endif // __LC_CRYPT_INTERNEL_H__
