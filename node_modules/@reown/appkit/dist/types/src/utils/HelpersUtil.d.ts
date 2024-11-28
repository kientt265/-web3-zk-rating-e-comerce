import type { NamespaceConfig } from '@walletconnect/universal-provider';
import type { CaipNetwork, CaipNetworkId, ChainNamespace } from '@reown/appkit-common';
import type { SessionTypes } from '@walletconnect/types';
export declare const WcHelpersUtil: {
    getMethodsByChainNamespace(chainNamespace: ChainNamespace): string[];
    createNamespaces(caipNetworks: CaipNetwork[]): NamespaceConfig;
    getChainsFromNamespaces(namespaces?: SessionTypes.Namespaces): CaipNetworkId[];
};
