import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useChain } from '@cosmos-kit/react';
import { useRef } from 'react';
import { contracts } from 'badkidsjs';
import {contracts as BadBridgeContracts} from '../bad-bridge-ts'
import { neutronChainName, stargazeChainName, marketplaceContract, badkidsAddress , neutronContractAddress} from '../config';

export const useClient = () => {
  const neutronChainContext = useChain(neutronChainName);
  const neutronAddress = neutronChainContext.address
  const getNeutronSigningCosmWasmClient = neutronChainContext.getSigningCosmWasmClient
  const signingNeutronCosmWasmClientRef = useRef<SigningCosmWasmClient>();

  const connectToNeutron = neutronChainContext.isWalletConnected ? neutronChainContext.enable : neutronChainContext.connect
  // const connectToNeutron = neutronChainContext.enable
  // await neutronChainContext.enable()
  
  
  const chainContext = useChain(stargazeChainName);
 const { getSigningCosmWasmClient, address }  = chainContext;
  const signingCosmWasmClientRef = useRef<SigningCosmWasmClient>();
  const noAddressWarn = 'Wallet is not connected.';

  const fetchNeutronSigningCosmWasmClient = async () => {
    if (signingNeutronCosmWasmClientRef.current) {
      return signingNeutronCosmWasmClientRef.current
    }
    const signingNeutronCosmWasmClient = await getNeutronSigningCosmWasmClient()
    signingNeutronCosmWasmClientRef.current = signingNeutronCosmWasmClient
    return signingNeutronCosmWasmClient
  }

  const fetchSigningCosmWasmClient = async () => {
    if (signingCosmWasmClientRef.current) {
      return signingCosmWasmClientRef.current;
    }
    const signingCosmWasmClient = await getSigningCosmWasmClient();
    signingCosmWasmClientRef.current = signingCosmWasmClient;
    return signingCosmWasmClient;
  };

  // const getBadBridgeQueryClient = async () => {
  //   const { BadBridgeClient,  } = BadBridgeContracts.BadBridge;
  //   const getBadBridgeQueryClient = BadBridgeContracts.BadBridge.getBadBridgeQueryClient;
  //   await BadBridgeContracts.BadBridge.useBadBridgeNftTransfersQuery({
  //     client: BadBridgeClient,
  //     address: neutronAddress,
  //     contractAddress: neutronContractAddress
  //   })
  //   return getBadBridgeQueryClient()
  // }

  const getBadBridgeClient = async () => {
    if (!neutronAddress) {
      await connectToNeutron()
    }
    const { BadBridgeClient } = BadBridgeContracts.BadBridge;
    const signingCosmWasmClient = await fetchNeutronSigningCosmWasmClient();
    return new BadBridgeClient(
      signingCosmWasmClient,
      String(neutronAddress),
      neutronContractAddress
    );
  };

  const getMarketplaceClient = async () => {
    if (!address) throw Error(noAddressWarn);
    const { MarketplaceClient } = contracts.Marketplace;
    const signingCosmWasmClient = await fetchSigningCosmWasmClient();
    return new MarketplaceClient(
      signingCosmWasmClient,
      address,
      marketplaceContract
    );
  };

  const getMarketplaceMsgComposer = () => {
    if (!address) throw Error(noAddressWarn);
    const { MarketplaceMessageComposer } = contracts.Marketplace;
    return new MarketplaceMessageComposer(address, marketplaceContract);
  };

  const getSg721UpdatableClient = async (collectionAddr: string) => {
    if (!address) throw Error(noAddressWarn);
    const { Sg721UpdatableClient } = contracts.Sg721Updatable;
    const signingCosmWasmClient = await fetchSigningCosmWasmClient();
    return new Sg721UpdatableClient(
      signingCosmWasmClient,
      address,
      collectionAddr
    );
  };

  const getSg721UpdatableMsgComposer = (collectionAddr: string) => {
    if (!address) throw Error(noAddressWarn);
    const { Sg721UpdatableMessageComposer } = contracts.Sg721Updatable;
    return new Sg721UpdatableMessageComposer(address, collectionAddr);
  };

  return {
    getMarketplaceClient,
    getMarketplaceMsgComposer,
    getSg721UpdatableClient,
    getSg721UpdatableMsgComposer,
    getBadBridgeClient
  };
};
