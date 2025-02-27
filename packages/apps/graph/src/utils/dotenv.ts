import type { ChainId } from '@kadena/types';
import * as _dotenv from 'dotenv';

_dotenv.config();

export const dotenv: {
  CHAIN_COUNT: number;
  COMPLEXITY_LIMIT: number;
  COMPLEXITY_ENABLED: boolean;
  COMPLEXITY_EXPOSED: boolean;
  DATABASE_URL: string;
  MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH: number;
  NETWORK_HOST: string;
  NETWORK_ID: string;
  PORT: number;
  PRISMA_LOGGING_ENABLED: boolean;
  PRISMA_LOG_TO_FILE: boolean;
  PRISMA_LOG_FILENAME: string;
  TRACING_ENABLED: boolean;
  TRACING_EXPOSED: boolean;
  TRACING_LOG_FILENAME: string;
  MARMALADE_ENABLED: boolean;
  MARMALADE_REPOSITORY_OWNER: string;
  MARMALADE_REPOSITORY_NAME: string;
  MARMALADE_REPOSITORY_BRANCH: string;
  MARMALADE_REMOTE_TEMPLATE_PATH: string;
  MARMALADE_REMOTE_NAMESPACE_PATH: string[];
  MARMALADE_REMOTE_EXCLUDE: string[];
  MARMALADE_LOCAL_TEMPLATE_PATH: string;
  MARMALADE_LOCAL_NAMESPACE_PATH: string;
  GITHUB_TOKEN: string;
  SIMULATE_DEFAULT_CHAIN_ID: ChainId;
  SIMULATE_LOG_FOLDER_NAME: string;
} = {
  CHAIN_COUNT: parseInt(or(process.env.CHAIN_COUNT, '20'), 10),
  COMPLEXITY_LIMIT: parseInt(or(process.env.COMPLEXITY_LIMIT, '500'), 10),
  COMPLEXITY_ENABLED: or(
    process.env.COMPLEXITY_ENABLED?.toLocaleLowerCase() === 'true',
    false,
  ),
  COMPLEXITY_EXPOSED: or(
    process.env.COMPLEXITY_EXPOSED?.toLocaleLowerCase() === 'true',
    false,
  ),
  DATABASE_URL: or(
    process.env.DATABASE_URL,
    'postgresql://devnet@localhost:5432/devnet?pool_timeout=0',
  ),
  MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH: parseInt(
    or(process.env.MAX_CALCULATED_BLOCK_CONFIRMATION_DEPTH, '7'),
    10,
  ),
  NETWORK_HOST: or(process.env.NETWORK_HOST, 'http://localhost:8080'),
  NETWORK_ID: or(process.env.NETWORK_ID, 'fast-development'),
  PORT: parseInt(or(process.env.PORT, '4000'), 10),
  PRISMA_LOGGING_ENABLED: or(
    process.env.PRISMA_LOGGING_ENABLED?.toLocaleLowerCase() === 'true',
    false,
  ),
  PRISMA_LOG_TO_FILE: or(
    process.env.PRISMA_LOG_TO_FILE?.toLocaleLowerCase() === 'true',
    false,
  ),
  PRISMA_LOG_FILENAME: or(process.env.PRISMA_LOG_FILENAME, 'prisma.log'),
  TRACING_ENABLED: or(
    process.env.TRACING_ENABLED?.toLocaleLowerCase() === 'true',
    false,
  ),
  TRACING_EXPOSED: or(
    process.env.TRACING_EXPOSED?.toLocaleLowerCase() === 'true',
    false,
  ),
  TRACING_LOG_FILENAME: or(process.env.TRACING_LOG_FILENAME, 'traces.log'),
  MARMALADE_ENABLED: or(
    process.env.MARMALADE_ENABLED?.toLocaleLowerCase() === 'true',
    false,
  ),
  MARMALADE_REPOSITORY_OWNER: or(
    process.env.MARMALADE_REPOSITORY_OWNER,
    'kadena-io',
  ),
  MARMALADE_REPOSITORY_NAME: or(
    process.env.MARMALADE_REPOSITORY_NAME,
    'marmalade',
  ),
  MARMALADE_REPOSITORY_BRANCH: or(
    process.env.MARMALADE_REPOSITORY_BRANCH,
    'v2',
  ),
  MARMALADE_REMOTE_TEMPLATE_PATH: or(
    process.env.MARMALADE_REMOTE_TEMPLATE_PATH,
    'pact/yaml/marmalade-v2',
  ),
  MARMALADE_REMOTE_NAMESPACE_PATH: or(
    process.env.MARMALADE_REMOTE_NAMESPACE_PATH?.split(','),
    ['pact/marmalade-ns', 'pact/util'],
  ),

  MARMALADE_REMOTE_EXCLUDE: or(
    process.env.MARMALADE_REMOTE_EXCLUDE?.split(','),
    ['sample', 'data', 'test'],
  ),

  MARMALADE_LOCAL_TEMPLATE_PATH: or(
    process.env.MARMALADE_LOCAL_TEMPLATE_PATH,
    'src/devnet/deployment/marmalade/templates/v2',
  ),
  MARMALADE_LOCAL_NAMESPACE_PATH: or(
    process.env.MARMALADE_LOCAL_NAMESPACE_PATH,
    'src/devnet/deployment/marmalade/templates/ns',
  ),
  GITHUB_TOKEN: or(process.env.GITHUB_TOKEN, '/pact/marmalade-ns'),
  SIMULATE_DEFAULT_CHAIN_ID: or(
    process.env.SIMULATE_DEFAULT_CHAIN_ID as ChainId,
    '0' as ChainId,
  ),
  SIMULATE_LOG_FOLDER_NAME: or(process.env.SIMULATE_LOG_FOLDER_NAME, 'logs'),
};

function or<T>(value: T | undefined, otherwise: T): T {
  return value === undefined ? otherwise : value;
}
