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

export const mintCommand: (program: Command, version: string) => void =
  createCommand(
    'mint',
    'mint a new NFT on Marmalade',
    [
      globalOptions.network(),
      globalOptions.publicKey(),
      globalOptions.secretKey(),
    ],
    async (config) => {
      debug('marmalade-mint:action')({ config });

      // kadena marmalade mint keyalias --key-alias=123 --uri=abc --policies=abc,def
      // kadena marmalade mint hdkey --hd-alias=123 --password=123 --uri=abc

      // kadena marmalade non-fungible hdkey --hd-alias=123 --password=123 --uri=abc

      // 1. keyAlias for plain key
      // 2. hdkey with index and (if required) password
      // 3. key pair & predicate directly in arguments

      const tokenIdReponse = createTokenId(
        {
          account: {
            account: '123',
            publicKeys: [],
          },
          gasPayer: {
            account: '123',
            publicKeys: [],
          },
          chainId: '1',
          uri: 'https://example.com',
          policies: [],
          creationGuard: {
            keys: [],
            pred: 'keys-all',
          },
        },
        {
          host: config.networkConfig.networkHost,
          defaults: {
            networkId: config.networkConfig.networkId,
          },
        },
      );

      const tokenId = await tokenIdReponse.execute();
      console.log(tokenId);
      const keys = getHdKeysStruct();
      console.log(keys);
      // mintNFT
    },
  );
