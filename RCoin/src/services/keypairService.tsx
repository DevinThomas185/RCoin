import * as RNFS from 'react-native-fs';
// Use v3.1.9-1 because developers do be retarded
const CryptoJS = require('crypto-js');
// import * as bs58 from 'bs58';

import {Keypair, Signer} from '@solana/web3.js';
import ReactNativeBiometrics from 'react-native-biometrics';


export type KeypairData = {
  sk: string;
  pk: string;
};

const SECRET_KEY_NAME = 'corn'
const BIO_SECRET_KEY_NAME = 'cream'

const rnBiometrics = new ReactNativeBiometrics()

const handleCreateBioKeys = () => {
  rnBiometrics.createKeys()
    .then((resultObject) => {
      const { publicKey } = resultObject
      console.log(publicKey)
    })
}

const handleDeleteBioKeys = () => {
  rnBiometrics.deleteKeys()
    .then((resultObject) => {
      const { keysDeleted } = resultObject

      if (keysDeleted) {
        console.log('Successful deletion')
      } else {
        console.log('Unsuccessful deletion because there were no keys to delete')
      }
    })
}

const handleCheckBioKeys = async (): Promise<boolean> => {
  const resultObject = await rnBiometrics.biometricKeysExist();
  const { keysExist } = resultObject;
  return keysExist;
}

// TODO[pg1919] return success or truth or smth
const _writePair = (kp: Keypair, encryptionKey: string, filename: string) => {
  const path = RNFS.DocumentDirectoryPath + `/${filename}.txt`;

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

const writePair = (kp: Keypair, encryptionKey: string) => {
  RNFS.unlink(RNFS.DocumentDirectoryPath + `/${BIO_SECRET_KEY_NAME}.txt`)
  handleDeleteBioKeys()
  
  _writePair(kp, encryptionKey, SECRET_KEY_NAME);
}

const writePairBio = (kp: Keypair, encryptionKey: string) => {
  _writePair(kp, encryptionKey, BIO_SECRET_KEY_NAME);
}

const readPair = (decryptionKey: string, filename: string = SECRET_KEY_NAME): Promise<Keypair | undefined> => {
  const path = RNFS.DocumentDirectoryPath + `/${filename}.txt`;

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

const readPairBio = (decryptionKey: string): Promise<Keypair | undefined> => {
  return readPair(decryptionKey, BIO_SECRET_KEY_NAME);
}

const bioSecretKeyExitsts = async (): Promise<boolean> => {
  const keyExists = await handleCheckBioKeys();
  if (!keyExists) {
    handleCreateBioKeys();
    RNFS.unlink(RNFS.DocumentDirectoryPath + `/${BIO_SECRET_KEY_NAME}.txt`);
    return false;
  }
  return RNFS.exists(RNFS.DocumentDirectoryPath + `/${BIO_SECRET_KEY_NAME}.txt`);

}

export const keypairService = {
  readPair,
  readPairBio,
  writePair,
  writePairBio,
  bioSecretKeyExitsts,
};
