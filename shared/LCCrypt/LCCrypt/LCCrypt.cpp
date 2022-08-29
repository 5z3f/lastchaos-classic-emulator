#include <string.h>
#include <stdlib.h>
#include "LCCrypt.h"
#include "LCCrypt_Internel.h"

// 16��Ʈ CRC ����
static inline unsigned short LCCNM_CalcCRC(unsigned char* pData, int nLen)
{
	unsigned short crc = 0;
	int i;

	while (nLen-- > 0)
	{
		crc = crc ^ ((int)*pData++ << 8);
		i = 8;
		while (i-- > 0)
		{
			if (crc & 0x8000)
				crc = (crc << 1) ^ LCCNM_CRC;
			else
				crc <<= 1;
		}
	}

	return crc;
}

// return value		��ȣȭ�� ����, ������ -1
// pSrc				���� ������
// nLenSrc			���� ����
// nKey				��ȣŰ
// pDest			��ȣ ������ ����
int LCCrypt_Crypt(const unsigned char* pSrc, int nLenSrc, unsigned int nKey, unsigned char* pDest)
{
	// ��ȯ ���̺�
	#include "LCCrypt_TransTable"

	int nLenDest = nLenSrc + (LCCNM_BEGIN_SIZE + LCCNM_END_SIZE + LCCNM_CHECKSUM_SIZE + LCCNM_DUMMY_SIZE);
	unsigned short nCheckSum = 0;	// üũ��
	int nIndexSrc = 0;				// pSrc ���� �ε���
	int nIndexDest = 0;				// pDest ���� �ε���
	unsigned char btTrans;			// ��ȯ ���̺���
	unsigned char btKey[4];			// Ű�� ����Ʈ�� �и�

	if (nLenSrc < 0)
		return -1;

	btKey[0] = LCCNM_BYTE_3(nKey);
	btKey[1] = LCCNM_BYTE_2(nKey);
	btKey[2] = LCCNM_BYTE_1(nKey);
	btKey[3] = LCCNM_BYTE_0(nKey);

	// ���� ����
	pDest[nIndexDest] = LCCNM_DUMMY_TYPE;
	nIndexDest++;

	// ���۸�ũ ����
	pDest[nIndexDest] = LCCNM_BEGIN_MARK;
	nIndexDest++;

	// ������ ����
	while (nIndexSrc < nLenSrc)
	{
		pDest[nIndexDest] = pSrc[nIndexSrc];
		nIndexDest++;
		nIndexSrc++;
	}

	// �� ��ũ ����
	pDest[nIndexDest] = LCCNM_END_MARK;
	nIndexDest++;

	// üũ�� ���� : ���� ����
	nCheckSum = LCCNM_CalcCRC(pDest + LCCNM_DUMMY_SIZE, nIndexDest - LCCNM_DUMMY_SIZE);

	// üũ�� ����
	pDest[nIndexDest] = LCCNM_BYTE_1(nCheckSum);
	nIndexDest++;
	pDest[nIndexDest] = LCCNM_BYTE_0(nCheckSum);;
	nIndexDest++;

	// ������ ��ȣȭ : ���� ����
	nIndexDest = LCCNM_DUMMY_SIZE;
	while (nIndexDest < nLenDest)
	{
		// ġȯ
		btTrans = LCCNM_TransTable[pDest[nIndexDest]];

		// Ű�� XOR
		btTrans ^= btKey[nIndexDest % 4];

		// ���������� Rotate
		btTrans = LCCNM_ROTATE_RIGHT(btTrans);

		// Ű ����
		btKey[nIndexDest % 4] = btTrans;

		// �� ����
		pDest[nIndexDest] = btTrans;

		nIndexDest++;
	}

	return nLenDest;
}

// return value		��ȣ�� ����, ������ -1
// pSrc				��ȣ ������
// nLenSrc			��ȣ ����
// nKey				��ȣŰ
// pDest			�� ������ ����
// pTmpBuf			��ȯ �ӽ� ����
int LCCrypt_Decrypt(const unsigned char* pSrc, int nLenSrc, unsigned int nKey, unsigned char* pDest, unsigned char* pTmpBuf)
{
	// ��ȯ ���̺�
	#include "LCCrypt_TransTable_Reverse"

	int nLenDest = nLenSrc - (LCCNM_BEGIN_SIZE + LCCNM_END_SIZE + LCCNM_CHECKSUM_SIZE + LCCNM_DUMMY_SIZE);
	unsigned short nCheckSum = 0;	// üũ��
	unsigned char btKey[4];			// Ű�� ����Ʈ�� �и�
	int nIndexSrc = 0;				// pSrc ���� �ε���
	unsigned char btTrans;			// ��ȯ ���̺���

	//(*pDest) = NULL;

	if (nLenDest < 0)
		return -1;

	btKey[0] = LCCNM_BYTE_3(nKey);
	btKey[1] = LCCNM_BYTE_2(nKey);
	btKey[2] = LCCNM_BYTE_1(nKey);
	btKey[3] = LCCNM_BYTE_0(nKey);

	//pTmpBuf = new unsigned char[nLenSrc];

	// ������ ��ȣȭ : ���� ����
	nIndexSrc = LCCNM_DUMMY_SIZE;
	while (nIndexSrc < nLenSrc)
	{
		// ���� ��ȣ���� ����
		btTrans = pSrc[nIndexSrc];

		// �������� Rotate
		btTrans = LCCNM_ROTATE_LEFT(btTrans);

		// Ű�� XOR
		btTrans ^= btKey[nIndexSrc % 4];

		// ġȯ
		btTrans = LCCNM_RTransTable[btTrans];

		// Ű����
		btKey[nIndexSrc % 4] = pSrc[nIndexSrc];

		// �� ����
		pTmpBuf[nIndexSrc] = btTrans;

		nIndexSrc++;
	}

	// üũ�� �˻� : ���� ����
	nCheckSum = LCCNM_MAKEWORD(pTmpBuf[nLenSrc - 1], pTmpBuf[nLenSrc - 2]);
	if (nCheckSum != LCCNM_CalcCRC(pTmpBuf + LCCNM_DUMMY_SIZE, nLenSrc - LCCNM_CHECKSUM_SIZE - LCCNM_DUMMY_SIZE))
	{
		return -1;
	}

	// ���۸�ũ �˻�
	if (pTmpBuf[LCCNM_DUMMY_SIZE] != LCCNM_BEGIN_MARK)
	{
		return -1;
	}

	// ����ũ �˻�
	if (pTmpBuf[nLenSrc - LCCNM_CHECKSUM_SIZE - 1] != LCCNM_END_MARK)
	{
		return -1;
	}

	//(*pDest) = new unsigned char[nLenDest];
	memcpy(pDest, pTmpBuf + LCCNM_BEGIN_SIZE + LCCNM_DUMMY_SIZE, sizeof(unsigned char) * nLenDest);

	return nLenDest;
}
