import { details } from '@kadena/client-utils/coin';
import { createTokenId } from '@kadena/client-utils/marmalade';
import type { Command } from 'commander';
import debug from 'debug';
import { HDKEY_ENC_EXT } from '../../constants/config.js';
import { getHDKeys } from '../../keys/utils/keysHelpers.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

function getHdKeysStruct(): { filename: string; filepath: string }[] {
  const keys = getHDKeys();
  return keys.map((key) => ({
    filename: key.replace(HDKEY_ENC_EXT, ''),
    filepath: key,
  }));
}

const SUBCOMMAND_ROOT: 'create-token' = 'create-token';

export const createTokenKeyAliasCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'keyalias',
  'Create a new NFT token on Marmalade using a key alias',
  [
    globalOptions.network(),
    globalOptions.networkChainId(),
    globalOptions.accountName(),
    globalOptions.uri(),
    globalOptions.policies(),
  ],
  async (config) => {
    debug('marmalade-mint:action')({ config });

    // kadena marmalade create-token keyalias --key-alias=123 --uri=abc --policies=abc,def
    // kadena marmalade mint hdkey --hd-alias=123 --password=123 --uri=abc

    // kadena marmalade non-fungible hdkey --hd-alias=123 --password=123 --uri=abc

    // 1. keyAlias for plain key
    // 2. hdkey with index and (if required) password
    // 3. key pair & predicate directly in arguments

    const accountDetails = (await details(
      config.accountName,
      config.networkConfig.networkId,
      config.chainId,
      config.networkConfig.networkHost,
    )) as
      | {
          guard: {
            pred: string;
            keys: string[];
          };
          balance: number;
          account: string;
        }
      | undefined;

    if (accountDetails === undefined) {
      throw Error(
        `Account ${config.accountName} does not exist on ${config.networkConfig.networkId} on chain ${config.chainId}`,
      );
    }

    const tokenIdResponse = createTokenId(
      {
        account: {
          account: config.accountName,
          publicKeys: accountDetails.guard.keys,
        },
        gasPayer: {
          account: config.accountName,
          publicKeys: accountDetails.guard.keys,
        },
        chainId: config.chainId,
        uri: config.uri,
        policies: config.policies
          .split(',')
          .map((value: string) => value.trim()),
        creationGuard: accountDetails.guard as Parameters<
          typeof createTokenId
        >[0]['creationGuard'],
      },
      {
        host: config.networkConfig.networkHost,
        defaults: {
          networkId: config.networkConfig.networkId,
        },
      },
    );

    const tokenId = await tokenIdResponse.execute();
    console.log(tokenId);
    const keys = getHdKeysStruct();
    console.log(keys);
  },
);

export function marmaladeCreateTokenCommandFactory(
  program: Command,
  version: string,
): void {
  const marmaladeProgram = program
    .command(SUBCOMMAND_ROOT)
    .description(`Create a token on Marmalade`);

  createTokenKeyAliasCommand(marmaladeProgram, version);
}
