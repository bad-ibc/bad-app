import React, { useEffect, useState } from 'react';
import {
  Center,
  Flex,
  HStack,
  Link,
  Spinner,
  Text,
  useColorMode,
  Grid,
  useDisclosure,
  Icon,
} from '@chakra-ui/react';
import { MdVerified } from 'react-icons/md';
import { useChain } from '@cosmos-kit/react';
import { stargazeChainName, NAMES, OWNED_TOKENS, COLLECTIONS, coin, badkidsAddress, neutronChainName, neutronToken } from '../config';
import { contracts, stargaze } from 'badkidsjs';

import { useLazyQuery } from '@apollo/client';
import { Collections, Tokens, Names, TxResult, Token } from './types';

import { shortenAddress, getStargazeProfileLink } from '../utils';
import {
  TransferNftModal,
  BurnNftModal,
  NftSaleModal,
  NftDetailModal,
  UpdatePriceModal,
  RemoveListingModal,
  SimpleButton,
  NftCards,
  ProfileStat,
  NftCard,
} from './sell';
import { getPrices } from '../api';
import { useClient, useColor, useTransactionToast } from 'hooks';

export const FromNeutron = () => {
  const { showToast } = useTransactionToast();
  const { address } = useChain(neutronChainName);
  const stargazeInfo = useChain(stargazeChainName)
  const stargazeAddress = stargazeInfo.address
  const tokenId = 88
  const [getTokens, setTokens] = useState([])
  // const [selectedToken, setSelectedToken] = useState<Token>();
  // const [price, setPrice] = useState<number>();

  // const [execNamesQuery, queryNamesResult] = useLazyQuery<Names>(NAMES);
  // const [execOwnedTokensQuery, queryOwnedTokensResult] = useLazyQuery<Tokens>(
  //   OWNED_TOKENS,
  //   { notifyOnNetworkStatusChange: true }
  // );
  // const [execCollectionsQuery, queryCollectionsResult] =
  //   useLazyQuery<Collections>(COLLECTIONS, {
  //     notifyOnNetworkStatusChange: true,
  //   });

  // const getStarsPrice = async () => {
  //   const geckoId = coin?.coingecko_id || 'stargaze';
  //   try {
  //     const res = await getPrices([geckoId]);
  //     setPrice(res.stargaze.usd);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const nftDetailModalControl = useDisclosure();
  // const nftSaleModalControl = useDisclosure();
  // const transferModalControl = useDisclosure();
  // const burnModalControl = useDisclosure();
  // const updatePriceModalControl = useDisclosure();
  // const removeListingModalControl = useDisclosure();

  // useEffect(() => {
  //   getStarsPrice();
  // }, []);

  const handleCardClick = async ({tokenId}) => {
    try {
      console.log({tokenId})
      const denom  = "factory/neutron1pekzylkajutxqw3ay6uhk5xznc0vxu0tltl38ftme6n57uxcus2qslp0pa/" + String(tokenId)
      console.log({denom})
      const client = await getBadBridgeClient();
      const tx = await client.unlockNft({destination: String(stargazeAddress), tokenId},  "auto", undefined, [{denom, amount:'100'}])
      console.log({tx})
      showToast(TxResult.Success);
    } catch(error) {
      console.error({error})
      showToast(TxResult.Failed, error);
    }
  }

  const { getSg721UpdatableClient, getBadBridgeClient } = useClient();

  const queryTokens = async () => {
    try {
      const rpcEndpoint ='https://rpc-palvus.pion-1.ntrn.tech:443'

      const tokenClient = await stargaze.ClientFactory.createRPCQueryClient({rpcEndpoint});
      var key: any, offset = 0, limit = 100, countTotal: any, reverse: any
      const allBalances = await tokenClient.cosmos.bank.v1beta1.allBalances({
        address: String(address)
      })
    setTokens(allBalances.balances.filter(t => t.denom !== neutronToken).map(t => {
      const tokenId = t.denom.split("/")[t.denom.split("/").length - 1]
      t.token = {
        tokenId
      }
      return t
    }))
      console.log({allBalances})
      // const client = await getBadBridgeClient();
      // const tx = await client.unlockNft({destination: String(stargazeAddress), tokenId: String(tokenId)},  "auto", undefined, [{denom:token, amount:'50'}])
      // console.log({tx})


      // const tokens = client.
      // const queryId = await client.getQueryId({tokenId: token.tokenId})
      // const tx = await client.removeInterchainQuery({queryId})
      // console.log({tx})
      // showToast(TxResult.Success);
      // setTransferStage(4)
    } catch (error) {
      showToast(TxResult.Failed, error);
      console.error(error);
    } finally {


    }
  }

  useEffect(() => {
    if (!address) return;
    queryTokens()
    // execOwnedTokensQuery({
    //   variables: {
    //     badkidsAddress: badkidsAddress,
    //     ownerAddr: address,
    //     sortBy: 'PRICE_DESC',
    //     limit: 100,
    //   },
    // });
    // execNamesQuery({
    //   variables: {
    //     associatedAddr: address,
    //   },
    // });
    // execCollectionsQuery({
    //   variables: {
    //     tokenOwnerAddr: address,
    //   },
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  // const updateData = () => {
  //   queryOwnedTokensResult.refetch();
  //   queryCollectionsResult.refetch();
  // };

  // const update = () => {
  //   updateData();
  //   nftDetailModalControl.onClose();
  // };

  // const isLoading =
  //   queryNamesResult.loading ||
  //   queryCollectionsResult.loading ||
  //   queryOwnedTokensResult.loading;

  // const names = queryNamesResult.data?.names.names;


  const { colorMode } = useColorMode();
  const { textColor, borderColor, bgColor } = useColor();

  // const noAddress = (
  //   <Center h="100%" flex="1">
  //     <Text fontWeight="600" fontSize="20px" color={textColor.secondary}>
  //       Please connect the wallet
  //     </Text>
  //   </Center>
  // ) 


  // const withAddress = (
  //   <Flex minH="300px" flexDir="column">
  //     {isLoading ? (
  //       <Center h="100%" flex="1">
  //         <Spinner
  //           color={textColor.primary}
  //           emptyColor={bgColor.tertiary}
  //           size="lg"
  //           speed="0.4s"
  //         />
  //       </Center>
  //     ) : queryOwnedTokensResult.data &&
  //       queryOwnedTokensResult.data?.tokens.total > 0 ? (
  //       <NftCards
  //         allNfts={queryOwnedTokensResult.data}
  //         handleCardClick={(token: Token) => {
  //           nftDetailModalControl.onOpen();
  //           setSelectedToken(token);
  //         }}
  //       />
  //     ) : (
  //       <Center h="100%" flex="1">
  //         <Text
  //           fontWeight="600"
  //           fontSize="20px"
  //           color={textColor.secondary}
  //         >
  //           No NFTs found
  //         </Text>
  //       </Center>
  //     )}
  //   </Flex>
  // )
  return (
    <Flex
    w="792px"
    px="24px"
    pt="18px"
    pb="75px"
    mb="60px"
    mx="auto"
    minH="400px"
    flexDir="column"
    bg={bgColor}
  >
  <Center h="100%" flex="1">
      <Text
        onClick={queryTokens}
        cursor="pointer"
        fontWeight="600" fontSize="20px" color={textColor.secondary}>
        refresh
      </Text>
    </Center>
    <Grid
      templateColumns="repeat(3, 1fr)"
      justifyContent="space-between"
      gridGap="24px"
      background="transparent"
    >

      {getTokens.map((balance) => (
        <NftCard
          key={balance.denom}
          token={balance.token}
          handleCardClick={handleCardClick}
        />
      ))}
    </Grid>
    </Flex>
  );

  return (
    <Flex
      w="792px"
      px="24px"
      pt="18px"
      pb="75px"
      mb="60px"
      mx="auto"
      minH="400px"
      flexDir="column"
      bg={bgColor}
    >
      {getTokens.map(t => {
        <Text> {JSON.stringify(t)}</Text>
      })}
      {/* {!address ?  noAddress : withAddress} */}
{/* 
      {selectedToken && (
        <TransferNftModal
          token={selectedToken}
          modalControl={transferModalControl}
          update={update}
        />
      )} */}
    </Flex>
  );
};
