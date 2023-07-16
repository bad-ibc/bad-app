import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChainProvider } from '@cosmos-kit/react';
import { ChakraProvider } from '@chakra-ui/react';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as cosmostationWallets } from '@cosmos-kit/cosmostation';
import { wallets as leapWallets } from '@cosmos-kit/leap';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import { chains, assets } from 'chain-registry';


import { getSigningCosmosClientOptions } from 'badkidsjs';
import { GasPrice } from '@cosmjs/stargate';

import { SignerOptions } from '@cosmos-kit/core';
import { Chain } from '@chain-registry/types';
import { defaultTheme , stargazeChainName, stargazeToken, neutronToken, neutronChainName} from 'config';

const subdomain = stargazeChainName === 'stargaze' ? 'mainnet' : 'testnet';

const client = new ApolloClient({
  uri: `https://constellations-api.${subdomain}.stargaze-apis.com/graphql`,
  cache: new InMemoryCache(),
});

function CreateCosmosApp({ Component, pageProps }: AppProps) {
  const signerOptions: SignerOptions = {
    signingStargate: (_chain: Chain) => {
      return getSigningCosmosClientOptions();
    },
    signingCosmwasm: (chain: Chain) => {
      switch (chain.chain_name) {
        case 'stargaze':
        case 'stargazetestnet':
          return {
            gasPrice: GasPrice.fromString('0.0025' + stargazeToken),
          };
        case 'neutron':
        case 'neutrontestnet':
          return {
            gasPrice: GasPrice.fromString('0.0025' + neutronToken),
          };
      }
    },
  };

  // let customAssets = []
  // for (let i = 1; i <= 10; i++) { // TODO: change back to 9999 when ready
  //   const base = `factory/neutron1pekzylkajutxqw3ay6uhk5xznc0vxu0tltl38ftme6n57uxcus2qslp0pa/${String(i).padStart(4, "0")}`
  //   const customAsset = {
  //     base,
  //     denom_units: [
  //       {denom: base, exponent: 0}
  //     ],
  //     logo_URIs: {
  //       png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/neutrontestnet/images/neutron.png",
  //       svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/neutrontestnet/images/neutron.svg"
  //     },
  //     description: 'Bad Kid NFT #' + i,
  //     display: "BadKid#" + i,
  //     name: "BadKid",
  //     symbol:"BK"
  //   }
  //   customAssets.push(customAsset)
  // }

  // const neutronIndex = assets.findIndex(a => {
  //   return a.chain_name === neutronChainName
  // })
  // let neutronAssets = assets[neutronIndex]
  // neutronAssets.assets.push(...customAssets)
  // assets.splice(neutronIndex, 1, neutronAssets)
  return (
    <ChakraProvider theme={defaultTheme}>
      <ChainProvider
        chains={chains}
        assetLists={assets}
        wallets={[...keplrWallets, ...cosmostationWallets, ...leapWallets]}
        endpointOptions={{
          endpoints: {
            stargazetestnet: {
              rpc: ['https://rpc.elgafar-1.stargaze-apis.com:443']
            },
            neutrontestnet: {
              rpc: ['https://rpc-palvus.pion-1.ntrn.tech:443']
            }
          }
        }}
        walletConnectOptions={{
          signClient: {
            projectId: 'a8510432ebb71e6948cfd6cde54b70f7',
            relayUrl: 'wss://relay.walletconnect.org',
            metadata: {
              name: 'CosmosKit Template',
              description: 'CosmosKit dapp template',
              url: 'https://docs.cosmoskit.com/',
              icons: [],
            },
          },
        }}
        wrappedWithChakra={true}
        signerOptions={signerOptions}
      >
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </ChainProvider>
    </ChakraProvider>
  );
}

export default CreateCosmosApp;
