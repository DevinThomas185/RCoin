import React, {createContext, useState, useContext} from 'react';
import {KeypairData, keypairService} from '../services/keypairService';
import {Keypair, Signer} from '@solana/web3.js';

type KeypairContextData = {
  writePair(kp: Keypair, encryptionKey: string): void;
  writePairBio(kp: Keypair, encryptionKey: string): void;
  readPair(decryptionKey: string): Promise<Keypair | undefined>;
  readPairBio(decryptionKey: string): Promise<Keypair | undefined>;
  bioSecretKeyExitsts(): Promise<boolean>;
};

const KeypairContext = createContext<KeypairContextData>(
  {} as KeypairContextData,
);

// This does something
const KeypairProvider = ({children}: {children: React.ReactNode}) => {
  const writePair = (kp: Keypair, encryptionKey: string) => {
    keypairService.writePair(kp, encryptionKey);
  };

  const writePairBio = (kp: Keypair, encryptionKey: string) => {
    keypairService.writePairBio(kp, encryptionKey);
  };

  const readPair = async (decryptionKey: string) => {
    const data: Keypair | undefined = await keypairService.readPair(
      decryptionKey,
    );
    return data;
  };

  const readPairBio = async (decryptionKey: string) => {
    const data: Keypair | undefined = await keypairService.readPairBio(
      decryptionKey,
    );
    return data;
  };

  const bioSecretKeyExitsts = (): Promise<boolean> => {
    return keypairService.bioSecretKeyExitsts();
  };

  return (
    <KeypairContext.Provider value={{writePair, writePairBio, readPair, readPairBio, bioSecretKeyExitsts}}>
      {children}
    </KeypairContext.Provider>
  );
};

const useKeypair = () => {
  const context = useContext(KeypairContext);

  if (!context) {
    throw new Error('useKeypair must be used within AuthProvider');
  }

  return context;
};

export {KeypairContext, KeypairProvider, useKeypair};
