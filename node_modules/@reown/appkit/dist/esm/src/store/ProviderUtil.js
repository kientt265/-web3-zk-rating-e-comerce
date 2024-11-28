import { proxy, ref, subscribe } from 'valtio/vanilla';
import { subscribeKey as subKey } from 'valtio/vanilla/utils';
const state = proxy({
    providers: { eip155: undefined, solana: undefined, polkadot: undefined },
    providerIds: { eip155: undefined, solana: undefined, polkadot: undefined }
});
export const ProviderUtil = {
    state,
    subscribeKey(key, callback) {
        return subKey(state, key, callback);
    },
    subscribeProviders(callback) {
        return subscribe(state.providers, () => callback(state.providers));
    },
    setProvider(chainNamespace, provider) {
        if (provider) {
            state.providers[chainNamespace] = ref(provider);
        }
    },
    getProvider(chainNamespace) {
        return state.providers[chainNamespace];
    },
    setProviderId(chainNamespace, providerId) {
        if (providerId) {
            state.providerIds[chainNamespace] = providerId;
        }
    },
    getProviderId(chainNamespace) {
        return state.providerIds[chainNamespace];
    },
    reset() {
        state.providers = { eip155: undefined, solana: undefined, polkadot: undefined };
        state.providerIds = { eip155: undefined, solana: undefined, polkadot: undefined };
    },
    resetChain(chainNamespace) {
        state.providers[chainNamespace] = undefined;
        state.providerIds[chainNamespace] = undefined;
    }
};
//# sourceMappingURL=ProviderUtil.js.map