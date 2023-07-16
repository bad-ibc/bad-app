import { GridItem, Flex, Text, Image, Grid, useColorModeValue } from '@chakra-ui/react';
import { exponent } from 'config';
import { useColor } from 'hooks';
import { getHttpUrl, isGtZero, toDisplayAmount, getImage } from 'utils';
import { Token, Tokens } from '../../types';
import { StarsIcon } from './stars-icon';


interface INftCard {
  handleCardClick: (token: Token) => void;
  token: Token;
}

export const NftCard: React.FC<INftCard> = ({ token, handleCardClick }) => {
  const { textColor } = useColor();

  // const getImage = (tokenId) => {
  //   const images = {
  //     7:'https://res.cloudinary.com/stargaze/image/upload/w_700/b5ij1wrgjzmzcivljffz.jpg',
  //     100: 'https://res.cloudinary.com/stargaze/image/upload/w_700/u5swhukgqofrwrqj7vyp.jpg',
  //     45: 'https://res.cloudinary.com/stargaze/image/upload/w_700/ouw1ndsrjjbhe0btkn6u.jpg',
  //     73: 'https://res.cloudinary.com/stargaze/image/upload/w_700/ay895kdyocd5ublmlukw.jpg',
  //     88: 'https://res.cloudinary.com/stargaze/image/upload/w_700/ucjpnj0fh1segz3fuwqf.jpg',
  //     22: 'https://res.cloudinary.com/stargaze/image/upload/w_700/plbs1zrqrdmizjpo8mnb.jpg',
  //     84: 'https://res.cloudinary.com/stargaze/image/upload/w_700/badkx397up5ww8epsldm.jpg',
  //     30: 'https://res.cloudinary.com/stargaze/image/upload/w_700/snav2rleap7jhvzm8pyo.jpg',
  //     42: 'https://res.cloudinary.com/stargaze/image/upload/w_700/w91bnc1hjm6yfjdvpngz.jpg'
  //   }
  //   return images[tokenId]
  // }


  return (
    <GridItem cursor="pointer" onClick={() => handleCardClick(token)}>
      <Image
        mb="12px"
        alt={token.name}
        boxSize="232px"
        borderRadius="35px"
        src={getImage(token.tokenId)}
      />
      <Text
        fontWeight="800"
        fontSize="14px"
        color={useColorModeValue('primary.900', 'primary.100')}
        mb="8px"
        lineHeight="shorter"
      >
        {token.name}
      </Text>
      {/* {isGtZero(token.highestCollectionBid) && (
        <SplitText
          left="Highest offer"
          right={`${toDisplayAmount(
            token.highestCollectionBid,
            exponent
          )} STARS`}
          withIcon
          mb="8px"
        />
      )}
      {token.forSale && token.price && (
        <SplitText
          left="List Price"
          right={`${toDisplayAmount(token.price.amount, exponent)} STARS`}
          withIcon
        />
      )} */}
    </GridItem>
  );
};

export const SplitText = ({
  left,
  right,
  withIcon,
  size = 'sm',
  rightClickable = false,
  onRightClick,
  mb,
}: {
  left: string;
  right: string;
  size?: 'sm' | 'md' | 'lg';
  withIcon?: boolean;
  rightClickable?: boolean;
  onRightClick?: () => void;
  mb?: string;
}) => {
  const { textColor } = useColor();

  const fontSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <Flex alignItems="center" lineHeight="16px" mb={mb}>
      <Text
        fontWeight="400"
        fontSize={fontSizes[size] + 'px'}
        color={textColor.secondary}
        textAlign="left"
      >
        {left}&nbsp;
      </Text>
      <Text
        fontWeight="600"
        fontSize={fontSizes[size] + 'px'}
        color={textColor.primary}
        cursor={rightClickable ? 'pointer' : 'inherit'}
        onClick={onRightClick}
      >
        {right}
      </Text>
      {withIcon && (
        <StarsIcon
          ml="6px"
          yOffset="-1px"
          boxSize={fontSizes[size] + 4 + 'px'}
        />
      )}
    </Flex>
  );
};

export const NftCards = ({
  allNfts,
  handleCardClick,
}: {
  allNfts: Tokens;
  handleCardClick: (token: Token) => void;
}) => {
  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      justifyContent="space-between"
      gridGap="24px"
      background="transparent"
    >
      {allNfts.tokens.tokens.map((token) => (
        <NftCard
          key={token.id}
          token={token}
          handleCardClick={handleCardClick}
        />
      ))}
    </Grid>
  );
};
