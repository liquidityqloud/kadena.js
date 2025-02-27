import { Box } from '@components/box';
import { Text } from '@components/text';
import type { IBlock } from '@utils/hooks/use-parsed-blocks';
import { selectColor } from '@utils/select-color';
import React from 'react';
import { ChainBlock } from './../chain-block';

interface IChainwebRowProps {
  blocks: IBlock[];
  height: number;
}

export const ChainwebRow = ({
  blocks,
  height,
}: IChainwebRowProps): JSX.Element => {
  const row: Array<IBlock | undefined> = new Array(20).fill(undefined);
  blocks.forEach((block) => (row[block.chainId] = block));

  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        // mb: '$12',
      }}
    >
      <Text
        as="span"
        css={{
          fontWeight: '$bold',
          width: '$blockWidth',
          height: '$blockWidth',
          fontSize: '$xs',
          color: '$mauve11',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          pr: '$2',
          mx: '$1',
          '&::after': {
            content: '',
            position: 'absolute',
            top: '$3',
            bottom: '$3',
            right: 0,
            width: 1,
            background: '$mauve8',
          },
        }}
      >
        {height}
      </Text>
      {row.map((block, index) => {
        return (
          <ChainBlock
            key={`${height}-${index}`}
            color={selectColor(index, 6)}
            block={block}
            textColor={selectColor(index, 11)}
          />
        );
      })}
    </Box>
  );
};
