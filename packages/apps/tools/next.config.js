/** @type {import('next').NextConfig} */
const nextTranslate = require('@webpro/next-translate-plugin');
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');

const withVanillaExtract = createVanillaExtractPlugin();

const config = {
  nextTranslate: { basePath: __dirname },
  eslint: {
    ignoreDuringBuilds: true, // lint is a different task/phase
  },
  reactStrictMode: true,
  pageExtensions:
    process.env.NODE_ENV === 'production' ? ['(?<!(spec|test).)tsx'] : ['tsx'],
  transpilePackages: ['@kadena/react-ui'],
  env: {
    KADENA_API_TTIL: process.env.KADENA_API_TTIL,
    KADENA_MAINNET_API: process.env.KADENA_MAINNET_API,
    KADENA_MAINNET_NETWORKS: process.env.KADENA_MAINNET_NETWORKS,
    KADENA_TESTNET_API: process.env.KADENA_TESTNET_API,
    KADENA_TESTNET_NETWORKS: process.env.KADENA_TESTNET_NETWORKS,
    GAS_PRICE: process.env.GAS_PRICE,
    GAS_LIMIT: process.env.GAS_LIMIT,
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
    WALLET_CONNECT_RELAY_URL: process.env.WALLET_CONNECT_RELAY_URL,
  },
};

module.exports = withVanillaExtract(nextTranslate(config));
