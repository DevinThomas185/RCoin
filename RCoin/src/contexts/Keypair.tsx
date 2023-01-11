import React, {createContext, useState, useContext} from 'react';
import {KeypairData, keypairService} from '../services/keypairService';
import {Keypair, PublicKey, Signer} from '@solana/web3.js';

type KeypairContextData = {
  writePair(kp: string, encryptionKey: string): Promise<PublicKey>;
  writePairBio(kp: Keypair, encryptionKey: string): void;
  readMnemonic(decryptionKey: string, pk: string): Promise<string | undefined>;
  readPair(decryptionKey: string, pk: string): Promise<Keypair | undefined>;
  readPairBio(decryptionKey: string): Promise<Keypair | undefined>;
  secretKeyExists(pk: string): Promise<boolean>;
  restoreSecretKey(
    mnemonic: string,
    password: string,
    pk: string,
  ): Promise<boolean>;
  bioSecretKeyExitsts(): Promise<boolean>;
  deleteBio(): void;
};

const KeypairContext = createContext<KeypairContextData>(
  {} as KeypairContextData,
);

// This does something
const KeypairProvider = ({children}: {children: React.ReactNode}) => {
  const writePair = (mnemonic: string, encryptionKey: string) => {
    return keypairService.writePair(mnemonic, encryptionKey);
  };

  const writePairBio = (kp: Keypair, encryptionKey: string) => {
    keypairService.writePairBio(kp, encryptionKey);
  };

  const deleteBio = () => {
    keypairService.deleteBio();
  };

  const readMnemonic = async (decryptionKey: string, pk: string) => {
    const data: string | undefined = await keypairService.readMnemonic(
      decryptionKey,
      pk,
    );
    return data;
  };

  const readPair = async (decryptionKey: string, pk: string) => {
    const data: Keypair | undefined = await keypairService.readPair(
      decryptionKey,
      pk,
    );
    return data;
  };

  const readPairBio = async (decryptionKey: string) => {
    const data: Keypair | undefined = await keypairService.readPairBio(
      decryptionKey,
    );
    return data;
  };

  const secretKeyExists = async (pk: string): Promise<boolean> => {
    return keypairService.secretKeyExists(pk);
  };

  const restoreSecretKey = async (
    mnemonic: string,
    password: string,
    pk: string,
  ): Promise<boolean> => {
    return keypairService.restoreSecretKey(mnemonic, password, pk);
  };

  const bioSecretKeyExitsts = (): Promise<boolean> => {
    return keypairService.bioSecretKeyExitsts();
  };

  return (
    <KeypairContext.Provider
      value={{
        writePair,
        writePairBio,
        readMnemonic,
        readPair,
        readPairBio,
        secretKeyExists,
        restoreSecretKey,
        bioSecretKeyExitsts,
        deleteBio,
      }}>
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
