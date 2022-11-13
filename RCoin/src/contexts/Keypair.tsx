import React, {createContext, useState, useContext} from 'react';
import {KeypairData, keypairService} from '../services/keypairService';
import {Keypair} from '@solana/web3.js';

type KeypairContextData = {
  writePair(kp: Keypair, encryptionKey: string): void;
  readPair(decryptionKey: string): Promise<KeyPair>;
};

const KeypairContext = createContext<KeypairContextData>(
  {} as KeypairContextData,
);

// This does something
const KeypairProvider = ({children}: {children: React.ReactNode}) => {
  const writePair = (kp: Keypair, encryptionKey: string) => {
    keypairService.writePair(kp, encryptionKey);
  };

  const readPair = async (decryptionKey: string) => {
    const data: Keypair | undefined = await keypairService.readPair(
      decryptionKey,
    );
    return data;
  };

  return (
    <KeypairContext.Provider value={{writePair, readPair}}>
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
