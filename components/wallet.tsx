import { useChain } from '@cosmos-kit/react';
import {
  Box,
  Center,
  Grid,
  GridItem,
  Icon,
  Stack,
  useColorModeValue,
  Image,
  Text,
} from '@chakra-ui/react';
import { MouseEventHandler } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import {
  Astronaut,
  Error,
  Connected,
  ConnectedShowAddress,
  ConnectedUserInfo,
  Connecting,
  ConnectStatusWarn,
  CopyAddressBtn,
  Disconnected,
  NotExist,
  Rejected,
  RejectedWarn,
  WalletConnectComponent,
  ChainCard,
} from './wallet-ui';
import { stargazeChainName } from '../config';

export const WalletSection = () => {
  const {
    connect,
    openView,
    status,
    username,
    address,
    message,
    wallet,
    chain: chainInfo,
    logoUrl,
  } = useChain(stargazeChainName);

  // const neutronChainInfo = useChain('neutrontestnet');
  // console.log({neutronChainInfo})

  const chain = {
    chainName: stargazeChainName,
    label: chainInfo.pretty_name,
    value: stargazeChainName,
    icon: logoUrl,
  };

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault();
    openView();
  };

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      
      walletStatus={status}
      disconnect={
        <Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />
      }
      connecting={<Connecting />}
      connected={
        <Connected buttonText={'My Wallet'} onClick={onClickOpenView} />
      }
      rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
      error={<Error buttonText="Change Wallet" onClick={onClickOpenView} />}
      notExist={
        <NotExist buttonText="Install Wallet" onClick={onClickOpenView} />
      }
    />
  );

  const connectWalletWarn = (
    <ConnectStatusWarn
      walletStatus={status}
      rejected={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${wallet?.prettyName}: ${message}`}
        />
      }
      error={
        <RejectedWarn
          icon={<Icon as={FiAlertTriangle} mt={1} />}
          wordOfWarning={`${wallet?.prettyName}: ${message}`}
        />
      }
    />
  );

  const addressBtn = (
    <CopyAddressBtn
    walletStatus={status}
    connected={<ConnectedShowAddress address={address} isLoading={false} />}
    />
    );
    
    const userInfo = username && (
      <GridItem  onClick={onClickOpenView} border="hidden">
        {username}
      </GridItem>
    );
    const color = useColorModeValue('primary.200', 'primary.900')

  return (
    <Center py={16}>
      <Grid
        w="full"
        maxW="sm"
        templateColumns="1fr"
        rowGap={4}
        alignItems="center"
        justifyContent="center"
      >
        {/* <GridItem marginBottom={'20px'}>
          <ChainCard
            prettyName={chain?.label || stargazeChainName}
            icon={chain?.icon}
          />
        </GridItem> */}
        <GridItem px={6}>
          <Stack
            className="dotted-border"
            justifyContent="center"
            // border="dashed"
            alignItems="center"
            borderRadius="lg"
            // spacing={4}
            px={4}
            py={{ base: 6, md: 6 }}
            color={color}
          >
            {userInfo}
            {addressBtn}

            {// if address don't show box }
            }
            {!address && <Box  w="full" maxW={{ base: 52, md: 64 }}>{connectWalletButton}</Box>}
{/* 
            <Box w="full" maxW={{ base: 52, md: 64 }}>
              {connectWalletButton}
            </Box> */}
            {connectWalletWarn && <GridItem>{connectWalletWarn}</GridItem>}
          </Stack>
        </GridItem>
      </Grid>
    </Center>
  );
};
