import { input } from '@inquirer/prompts';

export async function publicKey(): Promise<string> {
  return await input({
    message: `Enter public key`,
  });
}

export async function secretKey(): Promise<string> {
  return await input({
    message: `Enter the secret key`,
  });
}

export async function uri(): Promise<string> {
  return await input({
    message: `Enter the URI`,
  });
}
export async function policies(): Promise<string> {
  return await input({
    message: `Enter the policies (comma separated)`,
  });
}
