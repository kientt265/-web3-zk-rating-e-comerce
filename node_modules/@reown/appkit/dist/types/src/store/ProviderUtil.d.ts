import type UniversalProvider from '@walletconnect/universal-provider';
import type { ChainNamespace } from '@reown/appkit-common';
export interface ProviderStoreUtilState {
    providers: Record<ChainNamespace, UniversalProvider | unknown | undefined>;
    providerIds: Record<ChainNamespace, ProviderIdType | undefined>;
}
export type ProviderIdType = 'walletConnect' | 'injected' | 'coinbaseWallet' | 'eip6963' | 'w3mAuth' | 'coinbaseWalletSDK';
export declare const ProviderUtil: {
    state: ProviderStoreUtilState;
    subscribeKey<K extends keyof ProviderStoreUtilState>(key: K, callback: (value: ProviderStoreUtilState[K]) => void): () => void;
    subscribeProviders(callback: (providers: ProviderStoreUtilState['providers']) => void): () => void;
    setProvider<T = UniversalProvider>(chainNamespace: ChainNamespace, provider: T): void;
    getProvider<T_1 = UniversalProvider>(chainNamespace: ChainNamespace): T_1 | undefined;
    setProviderId(chainNamespace: ChainNamespace, providerId: ProviderIdType): void;
    getProviderId(chainNamespace: ChainNamespace): ProviderIdType | undefined;
    reset(): void;
    resetChain(chainNamespace: ChainNamespace): void;
};
