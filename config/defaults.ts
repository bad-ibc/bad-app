import { assets } from 'chain-registry';
import { AssetList, Asset } from '@chain-registry/types';

export const stargazeChainName = 'stargazetestnet' as string
export const stargazeToken = 'ustars' as string

export const neutronChainName = "neutrontestnet" as string
export const neutronToken = 'untrn' as string

// don't need vvv
export const marketplaceContract =
  'stars1fvhcnyddukcqfnt7nlwv3thm5we22lyxyxylr9h77cvgkcn43xfsvgv0pl';

export const badkidsAddress = stargazeChainName == "stargaze" ? "stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420" : "stars1tsujchr0mmq855wdp3zlva3gapf0kvnm40xwjurzfqmnftp4w9fqpq0u7f"
export const interchainAccountAddress = stargazeChainName == "stargaze" ? "" : "stars1g3rcxkvvf4mh6ezfxnupfsmc39rayrddnntmzanwmam6m74z0xcsx2e77s"
export const neutronContractAddress = 'neutron1pekzylkajutxqw3ay6uhk5xznc0vxu0tltl38ftme6n57uxcus2qslp0pa'
// export const txHash = "75E776D01F31B23D4411D3F9F9AECECD24849A341FC3385E85B15941D8D5E490"

export const chainassets: AssetList = assets.find(
  (chain) => chain.chain_name === stargazeChainName
) as AssetList;


export const coin: Asset = chainassets.assets.find(
  (asset) => asset.base === stargazeToken
) as Asset;

export const exponent = coin.denom_units.find(
  (unit) => unit.denom === coin.display
)?.exponent as number;
