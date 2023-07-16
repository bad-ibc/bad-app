import React, { useEffect, useState } from 'react';
import {
  Center,
  Flex,
  HStack,
  Link,
  Spinner,
  Text,
  useColorMode,
  useDisclosure,
  Icon,
} from '@chakra-ui/react';
import { MdVerified } from 'react-icons/md';
import { useChain } from '@cosmos-kit/react';
import { stargazeChainName, NAMES, OWNED_TOKENS, COLLECTIONS, coin, badkidsAddress } from '../config';

import { useLazyQuery } from '@apollo/client';
import { Collections, Tokens, Names, Token } from './types';
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
} from './sell';
import { getPrices } from '../api';
import { useColor } from 'hooks';

export const FromStargaze = () => {
  const { address } = useChain(stargazeChainName);
  const [selectedToken, setSelectedToken] = useState<Token>();
  const [price, setPrice] = useState<number>();

  const [execNamesQuery, queryNamesResult] = useLazyQuery<Names>(NAMES);
  const [execOwnedTokensQuery, queryOwnedTokensResult] = useLazyQuery<Tokens>(
    OWNED_TOKENS,
    { notifyOnNetworkStatusChange: true }
  );
  const [execCollectionsQuery, queryCollectionsResult] =
    useLazyQuery<Collections>(COLLECTIONS, {
      notifyOnNetworkStatusChange: true,
    });

  const getStarsPrice = async () => {
    const geckoId = coin?.coingecko_id || 'stargaze';
    try {
      const res = await getPrices([geckoId]);
      setPrice(res.stargaze.usd);
    } catch (error) {
      console.error(error);
    }
  };

  // const hydrateTokens = () => {
  //   console.log('hydrate tokens')
  //   queryOwnedTokensResult.data.tokens.tokens = queryOwnedTokensResult.data.tokens.tokens.map((t) => {
  //     console.log('hydrating')
  //     t.imageUrl = 'https://res.cloudinary.com/stargaze/image/upload/w_700/b5ij1wrgjzmzcivljffz.jpg'
  //     return t
  //   })
  // }

  const nftDetailModalControl = useDisclosure();
  const nftSaleModalControl = useDisclosure();
  const transferModalControl = useDisclosure();
  const burnModalControl = useDisclosure();
  const updatePriceModalControl = useDisclosure();
  const removeListingModalControl = useDisclosure();

  useEffect(() => {
    getStarsPrice();
  }, []);

  useEffect(() => {
    if (!address) return;
    execOwnedTokensQuery({
      variables: {
        badkidsAddress: badkidsAddress,
        ownerAddr: address,
        sortBy: 'PRICE_DESC',
        limit: 100,
      },
    });
    execNamesQuery({
      variables: {
        associatedAddr: address,
      },
    });
    execCollectionsQuery({
      variables: {
        tokenOwnerAddr: address,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const updateData = () => {
    queryOwnedTokensResult.refetch()//.then(hydrateTokens)
    queryCollectionsResult.refetch();
  };
  const runThis = () => {
    nftDetailModalControl.onClose()
    console.log('runThis')
  }

  const update = () => {
    console.log('update called')
    updateData();
    nftDetailModalControl.onClose();
  };

  const isLoading =
    queryNamesResult.loading ||
    queryCollectionsResult.loading ||
    queryOwnedTokensResult.loading;

  const names = queryNamesResult.data?.names.names;

  const name =
    names && names?.length > 0
      ? names[0].name + '.stars'
      : shortenAddress(address);

  const isNameVerified = names?.[0]?.records.some((record) => record.verified);

  const profileStats = [
    // {
    //   name: 'Collections',
    //   value: queryCollectionsResult.data?.collections.total || 0,
    // },
    { name: 'Bad Kids', value: queryOwnedTokensResult.data?.tokens.total || 0 },
    // {
    //   name: 'Listed on marketplace',
    //   value:
    //     queryOwnedTokensResult.data?.tokens.tokens.filter(
    //       (token) => token.forSale
    //     ).length || 0,
    // },
  ];

  const selectedCollection =
    queryCollectionsResult.data?.collections.collections.find(
      (colletion) => colletion.collectionAddr === selectedToken?.collectionAddr
    );

  const { colorMode } = useColorMode();
  const { textColor, borderColor, bgColor } = useColor();

      const noAddress = (
        <Center h="100%" flex="1">
          <Text fontWeight="600" fontSize="20px" color={textColor.secondary}>
            Please connect the wallet
          </Text>
        </Center>
        )

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
          cursor="pointer"
          onClick={updateData}
        fontWeight="600" fontSize="20px" color={textColor.secondary}>
          refresh
        </Text>
      </Center>
    {!address ? noAddress : (
        <Flex minH="300px" flexDir="column">
          {isLoading ? (
            <Center h="100%" flex="1">
              <Spinner
                color={textColor.primary}
                emptyColor={bgColor.tertiary}
                size="lg"
                speed="0.4s"
              />
            </Center>
          ) : queryOwnedTokensResult.data &&
            queryOwnedTokensResult.data?.tokens.total > 0 ? (
            <NftCards
              allNfts={queryOwnedTokensResult.data}
              handleCardClick={(token: Token) => {
                nftDetailModalControl.onOpen();
                setSelectedToken(token);
              }}
            />
          ) : (
            <Center h="100%" flex="1">
              <Text
                fontWeight="600"
                fontSize="20px"
                color={textColor.secondary}
              >
                No NFTs found
              </Text>
            </Center>
          )}
        </Flex>
      )}

      {selectedToken && selectedCollection && (
        <NftDetailModal
          token={selectedToken}
          ownerName={name}
          collection={selectedCollection}
          modalControl={nftDetailModalControl}
          // openModals={{
          //   burn: burnModalControl.onOpen,
          //   list: nftSaleModalControl.onOpen,
          //   transferNft: transferModalControl.onOpen,
          //   removeListing: removeListingModalControl.onOpen,
          //   updatePrice: updatePriceModalControl.onOpen,
          // }}
        />
      )}
    </Flex>
  );
};
