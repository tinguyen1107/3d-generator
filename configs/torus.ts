import { SubVerifierDetails } from '@toruslabs/customauth';

export type TorusVerifiers = 'google';
export const torusVerifiers: Record<TorusVerifiers, SubVerifierDetails> = {
  google: {
    typeOfLogin: `google`,
    // verifier: process.env.NEXT_PUBLIC_TORUS_VERIFIER_GOOGLE_VERIFIER! || 'rep-run-google-testnet',
    verifier: 'rep-google-testnet',
    clientId:
      process.env.NEXT_PUBLIC_TORUS_VERIFIER_GOOGLE_CLIENT_ID! ||
      '1080216124332-ao36ktpg9k3bqlp3qv1smletk2qqkfvm.apps.googleusercontent.com',
  },
};
export const TorusConfig = Object.freeze({
  baseUrl: process.env.NEXT_PUBLIC_TORUS_BASE_URL || 'http://localhost:3000',
  network: process.env.NEXT_PUBLIC_TORUS_NETWORK || 'testnet',
  verifiers: torusVerifiers,
});
