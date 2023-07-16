import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  UseDisclosureReturn,
  Image,
  Text,
  Grid,
  GridItem,
  Icon,
  Flex,
  HStack,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  NormalButton,
  SemiLargeButton,
  SimpleButton,
} from '../../base/buttons';
import { SplitText } from '../ui/nft-cards';
import { AiOutlineTag, AiOutlineFire } from 'react-icons/ai';
import { BsSend } from 'react-icons/bs';
import { FiShare } from 'react-icons/fi';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import { NftTraits } from '../ui/nft-traits';
import { Collection, Events, Token, TxResult } from '../../types';
import {
  download,
  getHttpUrl,
  getTwitterShareLink,
  shortenAddress,
  toDisplayAmount,
  getImage
} from 'utils';
import { useLazyQuery } from '@apollo/client';
import { neutronChainName, stargazeChainName, EVENTS, exponent, interchainAccountAddress } from 'config';
import { useChain } from '@cosmos-kit/react';
import { useClient, useColor, useTransactionToast } from 'hooks';
import { Coin } from '@cosmjs/stargate';

export const NftDetailModal = ({
  token,
  ownerName,
  collection,
  modalControl,
}: {
  token: Token;
  ownerName: string;
  collection: Collection;
  modalControl: UseDisclosureReturn;
}) => {


  // let transferStage = 0 // TODO: should be 0 at beginning
  let txHash = '75E776D01F31B23D4411D3F9F9AECECD24849A341FC3385E85B15941D8D5E490'
  let height = 5773768

  const { getSigningCosmWasmClient, address } = useChain(stargazeChainName);
  const neutronChain = useChain(neutronChainName);
  const neutronAddress = neutronChain.address

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transferStage, setTransferStage] = useState(0)
  // tokenId = "45"

  const { getSg721UpdatableClient, getBadBridgeClient } = useClient();

  const { showToast } = useTransactionToast();

  const handleActionClick = async () => {
    switch(transferStage) {
      case 0:
        handleTransferClick()
        break;
      case 1:
        handleRegisterTransferNftQueryClick()
        break;
      case 2:
        handleMinNFTClick()
        break;
      case 3:
        handleUnregisterQueryClick()
        break;
      default:
        throw new Error(`Transfer stage ${transferStage} out of bounds`)
    }
  }


  const handleTransferClick = async () => {
    console.log('handleTransferClick')
    setIsLoading(true);
    let tx
    try {
      const client = await getSg721UpdatableClient(token.collectionAddr);
      // = 'https://rpc.elgafar-1.stargaze-apis.com:443';
      //appUrl = 'https://rpc.elgafar-1.stargaze-apis.com:443';

      tx = await client.transferNft({
        recipient: interchainAccountAddress,
        tokenId: token.tokenId,
      });
      // transferStage = 1
      setTransferStage(1)
      console.log({tx})
      txHash = tx.transactionHash
      height = tx.height
      console.log(`set txHash to ${txHash} and height to ${height}`)
      showToast(TxResult.Success);
    } catch (error) {
      console.log({tx})
      showToast(TxResult.Failed, error);
      console.error(error);
    } finally {
      console.log({tx})
      setIsLoading(false);
    }
  };

  const handleRegisterTransferNftQueryClick = async () => {
    console.log(`handleRegisterTransferNftQueryClick`)
    const minHeight = height - 1
    setIsLoading(true)
    try {
      const client = await getBadBridgeClient();
      const tx = await client.registerTransferNftQuery({minHeight, sender: String(address), tokenId: token.tokenId}, "auto", undefined, [{denom:'untrn', amount:'1000000'}])
      console.log({tx})
      showToast(TxResult.Success);
      setTransferStage(2)
    } catch(error) {
      showToast(TxResult.Failed, error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleMinNFTClick = async () => {
    console.log(`handleMintNFTClick`)
    setIsLoading(true);
    try {

      // const tokenId = "45"
      const tokenId = token.tokenId
      const client = await getBadBridgeClient();
      const transfers = await client.nftTransfers({sender: String(address)})
      console.log({transfers})

      console.log({tokenId})
      const mineIncluded = transfers.transfers.findIndex(t => {
        console.log(t.token_id, tokenId)
        return t.token_id == tokenId
      })
      console.log({mineIncluded})
      if (mineIncluded < 0) {
        showToast(TxResult.Failed, new Error("Still waiting for new dimension to realize what's going on"))
        return
      }
      if (transfers.length == 0) {
        showToast(TxResult.Failed, new Error("Still waiting for new dimension to realize what's going on"))
        return
      }
      const tx = await client.mintNft({tokenId})
      console.log({tx})
      showToast(TxResult.Success);
      setTransferStage(3)
    } catch (error) {
      showToast(TxResult.Failed, error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUnregisterQueryClick = async () =>{
    console.log(`handleUnregisterQueryClick`)
    setIsLoading(true);
    try {
      const client = await getBadBridgeClient();
      const queryId = await client.getQueryId({tokenId: token.tokenId})
      console.log({queryId})
      const tx = await client.removeInterchainQuery({queryId})
      console.log({tx})
      showToast(TxResult.Success);
      // setTransferStage(4)
    } catch (error) {
      showToast(TxResult.Failed, error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

const transferText = () => {
  let text, subtext
  switch(transferStage) {
    case(0):
      text = 'Find Freedom Step 1'
      subtext = 'Transfer Bad Kid to another dimension'
      break
    case(1):
      text = 'Find Freedom Step 2'
      subtext = 'Let new dimension know about it'
      break
    case(2):
      text = 'Finally Freedom'
      subtext = 'Finish it off'
      break;
    case(3):
      text = '🎉🎊🍾🥳🥂'
      subtext = 'Congratulations you did it!!!'
      break;
    case(4):
      text = '♻️👅♻️'
      subtext = 'You\'re something else 🥹'
      break;
    default:
        throw new Error(`no transferStage ${transferStage} text prepared`)
  }
  return {text, subtext}
}

  const handleRemoveInterchainQueryClick = async () => {
      // await client.removeInterchainQuery({queryId})
  }

  const handleUnlockClick = async () => {
      // await client.unlockNft({destination, tokenId})
  }




  // here was where it started before
  const [execEventsQuery, queryEventsResult] = useLazyQuery<Events>(EVENTS);

  const { isOpen, onClose } = modalControl;


  const creatorName = collection.createdBy.name
    ? collection.createdBy.name.name + '.stars'
    : shortenAddress(collection.createdBy.addr);

  useEffect(() => {
    if (token.lastSale || !address) return;
    execEventsQuery({
      variables: {
        forToken: {
          collectionAddr: collection.collectionAddr,
          tokenId: token.tokenId,
        },
        filter: 'TOKEN_METADATAS',
        sortBy: 'BLOCK_HEIGHT_ASC',
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, token.id]);

  const lastSaleEvent = useMemo(() => {
    if (token.lastSale) {
      return {
        name: 'Last sale',
        value: toDisplayAmount(token.lastSale.price.amount, exponent),
      };
    }
    if (!queryEventsResult.data) return;
    const mintEvent = queryEventsResult.data.events.edges.find(
      (event) => event.node.action === 'mint_sender'
    );
    return mintEvent
      ? {
          name: 'Minted for',
          value: toDisplayAmount(mintEvent.node.data.mintPrice, exponent),
        }
      : undefined;
  }, [queryEventsResult.data, token.lastSale]);

  const priceText: {
    [key: string]: string;
  } = {
    fixed_price: 'Price:',
    auction: 'Best offer:',
  };
  // let age, brains, badness, muscles
  // const traits = token.traits.filter((t, i) => t.name == "age" || t.name == "brains" || t.name == "badness" || t.name == "muscles")
    // age: token.traits[0],
    // brains: token.traits[1],
    // badness: token.traits[2],
    // muscles: token.traits[8]
    // } : {age, brains, badness, muscles}


  const { bgColor, textColor } = useColor();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent w="816px" pb="60px" bg={bgColor.primary}>
        <ModalHeader>
        <Text
                fontWeight="600"
                fontSize="46px"
                color={textColor.primary}
                mb="12px"
                lineHeight="30px"
              >
                {token.name}
              </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(2, 1fr)" gridGap="24px" mb="12px">
            <GridItem>
              <Image
                alt="nft"
                boxSize="100%"
                borderRadius="6px"
                src={getImage(token.tokenId)}
              />
            </GridItem>
            <GridItem 
            >
                <Text
                mt="100px"
                justifyContent="space-between" alignItems="center"
                  fontSize="38px"
                  cursor="pointer"
                  textAlign="center"
                  fontWeight="bold"
                  onClick={handleActionClick}>
               {transferText().text}
               </Text>
              {
                transferStage > 2 ? <Link
                  alignItems="center"
                  display="block"
                  width="100%"
                  textAlign="center"
                  target="_blank"
                  href={"https://explorer.rs-testnet.polypore.xyz/pion-1/account/" + neutronAddress}
                >{neutronAddress ? 'Go to blockexplorer' : 'wait'}</Link> :   <Text
                  fontSize="18px"
                  fontWeight="bold"
                  textAlign="center"
                >
               ({transferText().subtext})
               </Text>
            }
            </GridItem>
            {/* <GridItem>

          <Flex justifyContent="center" gap="35px">
            <Text>Age: {traits.filter(t => t.name == "age")[0].value}</Text><Text> Brains: {traits.filter(t => t.name == "brains")[0].value}</Text>
          </Flex>
          <Flex justifyContent="center" gap="35px">
            <Text>Badness {traits.filter(t => t.name == "badness")[0].value}</Text><Text>Muscles: {traits.filter(t => t.name == "muscles")[0].value}</Text>
          </Flex>
            </GridItem> */}
          </Grid>

        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
