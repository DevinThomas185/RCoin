import * as RNFS from 'react-native-fs';
// Use v3.1.9-1 because developers do be retarded
const CryptoJS = require('crypto-js');
// import * as bs58 from 'bs58';

import {Keypair, PublicKey, Signer} from '@solana/web3.js';
import ReactNativeBiometrics from 'react-native-biometrics';
import * as bip39 from '../best_practice_here/bip39';

export type KeypairData = {
  sk: string;
  pk: string;
};

const getSecretKeyName = (pk: string) => {
  return `corn-${pk}`;
};

const bioSecretKeyName = 'cream';

const rnBiometrics = new ReactNativeBiometrics();

const handleCreateBioKeys = () => {
  rnBiometrics.createKeys().then(resultObject => {
    const {publicKey} = resultObject;
    console.log(publicKey);
  });
};

const handleDeleteBioKeys = () => {
  rnBiometrics.deleteKeys().then(resultObject => {
    const {keysDeleted} = resultObject;

    if (keysDeleted) {
      console.log('Successful deletion');
    } else {
      console.log('Unsuccessful deletion because there were no keys to delete');
    }
  });
};

const handleCheckBioKeys = async (): Promise<boolean> => {
  const resultObject = await rnBiometrics.biometricKeysExist();
  const {keysExist} = resultObject;
  return keysExist;
};

const deleteBio = () => {
  RNFS.unlink(RNFS.DocumentDirectoryPath + `/${bioSecretKeyName}.txt`)
    .then(() => {
      console.log(`Deleted ${bioSecretKeyName}`);
    })
    .catch(e => {
      console.log(`/${bioSecretKeyName}.txt`, e);
    });
  handleDeleteBioKeys();
};

// TODO[pg1919] return success or truth or smth
const _writePair = (
  contents: string,
  encryptionKey: string,
  filename: string,
) => {
  const path = RNFS.DocumentDirectoryPath + `/${filename}.txt`;

  RNFS.writeFile(
    path,
    CryptoJS.AES.encrypt(contents, encryptionKey).toString(),
    'utf8',
  )
    .then(() => {
      console.log(`Created file ${filename} shhhh!`);
    })
    .catch((err: any) => {
      console.log(err.message);
    });
};

const writePair = async (
  mnemonic: string,
  encryptionKey: string,
): Promise<PublicKey> => {
  const seed = await bip39.mnemonicToSeed(mnemonic, encryptionKey);
  const kp: Keypair = Keypair.fromSeed(seed.subarray(0, 32));

  console.log(mnemonic);

  _writePair(
    mnemonic,
    encryptionKey,
    getSecretKeyName(kp.publicKey.toString()),
  );

  return kp.publicKey;
};

const writePairBio = (kp: Keypair, encryptionKey: string) => {
  _writePair(
    JSON.stringify({secretKey: kp.secretKey, publicKey: kp.publicKey}),
    encryptionKey,
    bioSecretKeyName,
  );
};

const _readContents = (
  decryptionKey: string,
  filename: string,
): Promise<string | undefined> => {
  const path = RNFS.DocumentDirectoryPath + `/${filename}.txt`;

  return new Promise(resolve => {
    RNFS.readFile(path)
      .then((contents: any) => {
        const decryptedContents = CryptoJS.AES.decrypt(
          contents,
          decryptionKey,
        ).toString(CryptoJS.enc.Utf8);

        resolve(decryptedContents);
      })
      .catch((err: any) => {
        console.log(err.message, err.code);
        resolve(undefined);
      });
  });
};

const readMnemonic = async (
  decryptionKey: string,
  pk: string,
): Promise<string | undefined> => {
  const decryptedContents = await _readContents(
    decryptionKey,
    getSecretKeyName(pk),
  );

  return decryptedContents;
};

const readPair = async (
  decryptionKey: string,
  pk: string,
): Promise<Keypair | undefined> => {
  const mnemonic = await readMnemonic(decryptionKey, pk);

  if (!mnemonic) {
    return undefined;
  }

  const seed: Buffer = await bip39.mnemonicToSeed(mnemonic, decryptionKey);

  return Keypair.fromSeed(seed.subarray(0, 32));
};

const readPairBio = async (
  decryptionKey: string,
): Promise<Keypair | undefined> => {
  const decryptedContents = await _readContents(
    decryptionKey,
    bioSecretKeyName,
  );
  if (decryptedContents === undefined) {
    return undefined;
  }

  const signer: Signer = JSON.parse(decryptedContents);
  const kp = Keypair.fromSecretKey(
    new Uint8Array(Object.values(signer.secretKey)),
  );

  return kp;
};

const restoreSecretKey = async (
  mnemonic: string,
  password: string,
  pk: string,
): Promise<boolean> => {
  try {
    const seed: Buffer = await bip39.mnemonicToSeed(mnemonic, password);
    const kp: Keypair = Keypair.fromSeed(seed.subarray(0, 32));

    if (kp.publicKey.toString() === pk) {
      writePair(mnemonic, password);
      return true;
    } else {
      console.log(
        'Mnemonic and password provided does not match the public key associated with this account',
      );
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

const secretKeyExists = async (pk: string): Promise<boolean> => {
  return RNFS.exists(
    RNFS.DocumentDirectoryPath + `/${getSecretKeyName(pk)}.txt`,
  );
};

const bioSecretKeyExitsts = async (): Promise<boolean> => {
  const keyExists = await handleCheckBioKeys();
  const {available} = await rnBiometrics.isSensorAvailable();
  if (!available) {
    return false;
  }

  if (!keyExists) {
    handleCreateBioKeys();
    RNFS.unlink(RNFS.DocumentDirectoryPath + `/${bioSecretKeyName}.txt`).catch(
      e => {
        console.log(`/${bioSecretKeyName}.txt`, e);
      },
    );
    return false;
  }

  return RNFS.exists(RNFS.DocumentDirectoryPath + `/${bioSecretKeyName}.txt`);
};

export const keypairService = {
  readMnemonic,
  readPair,
  readPairBio,
  writePair,
  writePairBio,
  secretKeyExists,
  restoreSecretKey,
  bioSecretKeyExitsts,
  deleteBio,
};
