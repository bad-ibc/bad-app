/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.26.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
import { InstantiateMsg, ExecuteMsg, QueryMsg, Uint64, Uint128, Binary, QueryType, QueryRegisteredQueryResponse, RegisteredQuery, Coin, KVKey, Height, String, NftTransfersResponse, NftTransfer } from "./BadBridge.types";
export interface BadBridgeReadOnlyInterface {
  contractAddress: string;
  icaAccount: () => Promise<String>;
  tokenDenom: ({
    tokenId
  }: {
    tokenId: string;
  }) => Promise<String>;
  nftTransfers: ({
    sender
  }: {
    sender: string;
  }) => Promise<NftTransfersResponse>;
  getRegisteredQuery: ({
    queryId
  }: {
    queryId: number;
  }) => Promise<QueryRegisteredQueryResponse>;
  getQueryId: ({
    tokenId
  }: {
    tokenId: string;
  }) => Promise<Uint64>;
}
export class BadBridgeQueryClient implements BadBridgeReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.icaAccount = this.icaAccount.bind(this);
    this.tokenDenom = this.tokenDenom.bind(this);
    this.nftTransfers = this.nftTransfers.bind(this);
    this.getRegisteredQuery = this.getRegisteredQuery.bind(this);
    this.getQueryId = this.getQueryId.bind(this);
  }

  icaAccount = async (): Promise<String> => {
    return this.client.queryContractSmart(this.contractAddress, {
      ica_account: {}
    });
  };
  tokenDenom = async ({
    tokenId
  }: {
    tokenId: string;
  }): Promise<String> => {
    return this.client.queryContractSmart(this.contractAddress, {
      token_denom: {
        token_id: tokenId
      }
    });
  };
  nftTransfers = async ({
    sender
  }: {
    sender: string;
  }): Promise<NftTransfersResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      nft_transfers: {
        sender
      }
    });
  };
  getRegisteredQuery = async ({
    queryId
  }: {
    queryId: number;
  }): Promise<QueryRegisteredQueryResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_registered_query: {
        query_id: queryId
      }
    });
  };
  getQueryId = async ({
    tokenId
  }: {
    tokenId: string;
  }): Promise<Uint64> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_query_id: {
        token_id: tokenId
      }
    });
  };
}
export interface BadBridgeInterface extends BadBridgeReadOnlyInterface {
  contractAddress: string;
  sender: string;
  registerICA: (fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  mintNft: ({
    tokenId
  }: {
    tokenId: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  registerTransferNftQuery: ({
    minHeight,
    sender,
    tokenId
  }: {
    minHeight: number;
    sender: string;
    tokenId: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  removeInterchainQuery: ({
    queryId
  }: {
    queryId: number;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  unlockNft: ({
    destination,
    tokenId
  }: {
    destination: string;
    tokenId: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  updateConfig: ({
    nftContractAddress,
    updatePeriod
  }: {
    nftContractAddress?: string;
    updatePeriod?: number;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class BadBridgeClient extends BadBridgeQueryClient implements BadBridgeInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.registerICA = this.registerICA.bind(this);
    this.mintNft = this.mintNft.bind(this);
    this.registerTransferNftQuery = this.registerTransferNftQuery.bind(this);
    this.removeInterchainQuery = this.removeInterchainQuery.bind(this);
    this.unlockNft = this.unlockNft.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
  }

  registerICA = async (fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      register_i_c_a: {}
    }, fee, memo, funds);
  };
  mintNft = async ({
    tokenId
  }: {
    tokenId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      mint_nft: {
        token_id: tokenId
      }
    }, fee, memo, funds);
  };
  registerTransferNftQuery = async ({
    minHeight,
    sender,
    tokenId
  }: {
    minHeight: number;
    sender: string;
    tokenId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      register_transfer_nft_query: {
        min_height: minHeight,
        sender,
        token_id: tokenId
      }
    }, fee, memo, funds);
  };
  removeInterchainQuery = async ({
    queryId
  }: {
    queryId: number;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      remove_interchain_query: {
        query_id: queryId
      }
    }, fee, memo, funds);
  };
  unlockNft = async ({
    destination,
    tokenId
  }: {
    destination: string;
    tokenId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      unlock_nft: {
        destination,
        token_id: tokenId
      }
    }, fee, memo, funds);
  };
  updateConfig = async ({
    nftContractAddress,
    updatePeriod
  }: {
    nftContractAddress?: string;
    updatePeriod?: number;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_config: {
        nft_contract_address: nftContractAddress,
        update_period: updatePeriod
      }
    }, fee, memo, funds);
  };
}