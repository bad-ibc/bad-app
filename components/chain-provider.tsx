import { ContractsProvider } from 'badkidsjs';
import { useChain } from '@cosmos-kit/react';

export const ChainContractProvider = ({ chainName, children }: { chainName: string, children: any }) => {
  const { address, getCosmWasmClient, getSigningCosmWasmClient } = useChain(chainName);
  return (
    <ContractsProvider contractsConfig={{
      address,
      getCosmWasmClient,
      getSigningCosmWasmClient
    }}>
      {children}
    </ContractsProvider>
  );
};