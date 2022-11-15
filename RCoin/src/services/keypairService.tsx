import * as RNFS from 'react-native-fs';
// Use v3.1.9-1 because developers do be retarded
const CryptoJS = require('crypto-js');
// import * as bs58 from 'bs58';

import {Keypair, Signer} from '@solana/web3.js';

const FILENAME =
  '0111000101110101011011110111001001101110011100110111010001100001011011100111010001101001011011100110111101110011';
const path = RNFS.DocumentDirectoryPath + `/${FILENAME}.txt`;

export type KeypairData = {
  sk: string;
  pk: string;
};

// TODO[pg1919] return success or truth or smth
const writePair = (kp: Keypair, encryptionKey: string) => {
  RNFS.writeFile(
    path,
    CryptoJS.AES.encrypt(
      JSON.stringify({secretKey: kp.secretKey, publicKey: kp.publicKey}),
      encryptionKey,
    ).toString(),
    'utf8',
  )
    .then(() => {
      console.log('Created file shhhh!');
    })
    .catch((err: any) => {
      console.log(err.message);
    });
};

const readPair = (decryptionKey: string): Promise<Keypair | undefined> => {
  return new Promise(resolve => {
    RNFS.readFile(path)
      .then((contents: any) => {
        const decryptedContents = CryptoJS.AES.decrypt(
          contents,
          decryptionKey,
        ).toString(CryptoJS.enc.Utf8);
        const signer: Signer = JSON.parse(decryptedContents);
        const kp = Keypair.fromSecretKey(
          new Uint8Array(Object.values(signer.secretKey)),
        );
        resolve(kp);
      })
      .catch((err: any) => {
        console.log(err.message, err.code);
        resolve(undefined);
      });
  });
};

export const keypairService = {
  readPair,
  writePair,
};
