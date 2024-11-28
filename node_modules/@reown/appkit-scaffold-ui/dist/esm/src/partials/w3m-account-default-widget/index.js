var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AccountController, CoreHelperUtil, ModalController, RouterController, StorageUtil, ConnectorController, EventsController, ConnectionController, SnackController, ConstantsUtil as CommonConstantsUtil, OptionsController, ChainController } from '@reown/appkit-core';
import { customElement, UiHelperUtil } from '@reown/appkit-ui';
import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ConstantsUtil } from '@reown/appkit-common';
import { W3mFrameRpcConstants } from '@reown/appkit-wallet';
import styles from './styles.js';
let W3mAccountDefaultWidget = class W3mAccountDefaultWidget extends LitElement {
    constructor() {
        super();
        this.unsubscribe = [];
        this.caipAddress = AccountController.state.caipAddress;
        this.address = CoreHelperUtil.getPlainAddress(AccountController.state.caipAddress);
        this.allAccounts = AccountController.state.allAccounts;
        this.profileImage = AccountController.state.profileImage;
        this.profileName = AccountController.state.profileName;
        this.disconnecting = false;
        this.balance = AccountController.state.balance;
        this.balanceSymbol = AccountController.state.balanceSymbol;
        this.features = OptionsController.state.features;
        this.unsubscribe.push(...[
            AccountController.subscribeKey('caipAddress', val => {
                this.address = CoreHelperUtil.getPlainAddress(val);
                this.caipAddress = val;
            }),
            AccountController.subscribeKey('balance', val => (this.balance = val)),
            AccountController.subscribeKey('balanceSymbol', val => (this.balanceSymbol = val)),
            AccountController.subscribeKey('profileName', val => (this.profileName = val)),
            AccountController.subscribeKey('profileImage', val => (this.profileImage = val)),
            OptionsController.subscribeKey('features', val => (this.features = val)),
            AccountController.subscribeKey('allAccounts', allAccounts => {
                this.allAccounts = allAccounts;
            })
        ]);
    }
    disconnectedCallback() {
        this.unsubscribe.forEach(unsubscribe => unsubscribe());
    }
    render() {
        if (!this.caipAddress) {
            throw new Error('w3m-account-view: No account provided');
        }
        const shouldShowMultiAccount = ChainController.state.activeChain === ConstantsUtil.CHAIN.EVM && this.allAccounts.length > 1;
        return html `<wui-flex
        flexDirection="column"
        .padding=${['0', 'xl', 'm', 'xl']}
        alignItems="center"
        gap="l"
      >
        ${shouldShowMultiAccount ? this.multiAccountTemplate() : this.singleAccountTemplate()}
        <wui-flex flexDirection="column" alignItems="center">
          <wui-text variant="paragraph-500" color="fg-200">
            ${CoreHelperUtil.formatBalance(this.balance, this.balanceSymbol)}
          </wui-text>
        </wui-flex>
        ${this.explorerBtnTemplate()}
      </wui-flex>

      <wui-flex flexDirection="column" gap="xs" .padding=${['0', 's', 's', 's']}>
        ${this.authCardTemplate()} <w3m-account-auth-button></w3m-account-auth-button>
        ${this.onrampTemplate()} ${this.swapsTemplate()} ${this.activityTemplate()}
        <wui-list-item
          variant="icon"
          iconVariant="overlay"
          icon="disconnect"
          ?chevron=${false}
          .loading=${this.disconnecting}
          @click=${this.onDisconnect.bind(this)}
          data-testid="disconnect-button"
        >
          <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>`;
    }
    onrampTemplate() {
        const onramp = this.features?.onramp;
        if (!onramp) {
            return null;
        }
        return html `
      <wui-list-item
        data-testid="w3m-account-default-onramp-button"
        iconVariant="blue"
        icon="card"
        ?chevron=${true}
        @click=${this.handleClickPay.bind(this)}
      >
        <wui-text variant="paragraph-500" color="fg-100">Buy crypto</wui-text>
      </wui-list-item>
    `;
    }
    activityTemplate() {
        const isSolana = ChainController.state.activeChain === ConstantsUtil.CHAIN.SOLANA;
        return html ` <wui-list-item
      iconVariant="blue"
      icon="clock"
      iconSize="sm"
      ?chevron=${!isSolana}
      ?disabled=${isSolana}
      @click=${this.onTransactions.bind(this)}
    >
      <wui-text variant="paragraph-500" color="fg-100" ?disabled=${isSolana}> Activity </wui-text>
      ${isSolana ? html `<wui-tag variant="main">Coming soon</wui-tag>` : ''}
    </wui-list-item>`;
    }
    swapsTemplate() {
        const swaps = this.features?.swaps;
        const isSolana = ChainController.state.activeChain === ConstantsUtil.CHAIN.SOLANA;
        if (!swaps || isSolana) {
            return null;
        }
        return html `
      <wui-list-item
        iconVariant="blue"
        icon="recycleHorizontal"
        ?chevron=${true}
        @click=${this.handleClickSwap.bind(this)}
      >
        <wui-text variant="paragraph-500" color="fg-100">Swap</wui-text>
      </wui-list-item>
    `;
    }
    authCardTemplate() {
        const type = StorageUtil.getConnectedConnector();
        const authConnector = ConnectorController.getAuthConnector();
        const { origin } = location;
        if (!authConnector || type !== 'AUTH' || origin.includes(CommonConstantsUtil.SECURE_SITE)) {
            return null;
        }
        return html `
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `;
    }
    handleSwitchAccountsView() {
        RouterController.push('SwitchAddress');
    }
    handleClickPay() {
        RouterController.push('OnRampProviders');
    }
    handleClickSwap() {
        RouterController.push('Swap');
    }
    explorerBtnTemplate() {
        const addressExplorerUrl = AccountController.state.addressExplorerUrl;
        if (!addressExplorerUrl) {
            return null;
        }
        return html `
      <wui-button size="md" variant="neutral" @click=${this.onExplorer.bind(this)}>
        <wui-icon size="sm" color="inherit" slot="iconLeft" name="compass"></wui-icon>
        Block Explorer
        <wui-icon size="sm" color="inherit" slot="iconRight" name="externalLink"></wui-icon>
      </wui-button>
    `;
    }
    singleAccountTemplate() {
        return html `
      <wui-avatar
        alt=${ifDefined(this.caipAddress)}
        address=${ifDefined(CoreHelperUtil.getPlainAddress(this.caipAddress))}
        imageSrc=${ifDefined(this.profileImage === null ? undefined : this.profileImage)}
        data-testid="single-account-avatar"
      ></wui-avatar>
      <wui-flex flexDirection="column" alignItems="center">
        <wui-flex gap="3xs" alignItems="center" justifyContent="center">
          <wui-text variant="large-600" color="fg-100">
            ${this.profileName
            ? UiHelperUtil.getTruncateString({
                string: this.profileName,
                charsStart: 20,
                charsEnd: 0,
                truncate: 'end'
            })
            : UiHelperUtil.getTruncateString({
                string: this.address || '',
                charsStart: 4,
                charsEnd: 4,
                truncate: 'middle'
            })}
          </wui-text>
          <wui-icon-link
            size="md"
            icon="copy"
            iconColor="fg-200"
            @click=${this.onCopyAddress}
          ></wui-icon-link> </wui-flex
      ></wui-flex>
    `;
    }
    multiAccountTemplate() {
        if (!this.address) {
            throw new Error('w3m-account-view: No account provided');
        }
        const account = this.allAccounts.find(acc => acc.address === this.address);
        const label = AccountController.state.addressLabels.get(this.address);
        return html `
      <wui-profile-button-v2
        .onProfileClick=${this.handleSwitchAccountsView.bind(this)}
        address=${ifDefined(this.address)}
        icon="${account?.type === W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT &&
            ChainController.state.activeChain === ConstantsUtil.CHAIN.EVM
            ? 'lightbulb'
            : 'mail'}"
        avatarSrc=${ifDefined(this.profileImage ? this.profileImage : undefined)}
        profileName=${ifDefined(label ? label : this.profileName)}
        .onCopyClick=${this.onCopyAddress.bind(this)}
      ></wui-profile-button-v2>
    `;
    }
    onCopyAddress() {
        try {
            if (this.address) {
                CoreHelperUtil.copyToClopboard(this.address);
                SnackController.showSuccess('Address copied');
            }
        }
        catch {
            SnackController.showError('Failed to copy');
        }
    }
    onTransactions() {
        EventsController.sendEvent({
            type: 'track',
            event: 'CLICK_TRANSACTIONS',
            properties: {
                isSmartAccount: AccountController.state.preferredAccountType ===
                    W3mFrameRpcConstants.ACCOUNT_TYPES.SMART_ACCOUNT
            }
        });
        RouterController.push('Transactions');
    }
    async onDisconnect() {
        try {
            this.disconnecting = true;
            await ConnectionController.disconnect();
            EventsController.sendEvent({ type: 'track', event: 'DISCONNECT_SUCCESS' });
            ModalController.close();
        }
        catch {
            EventsController.sendEvent({ type: 'track', event: 'DISCONNECT_ERROR' });
            SnackController.showError('Failed to disconnect');
        }
        finally {
            this.disconnecting = false;
        }
    }
    onExplorer() {
        const addressExplorerUrl = AccountController.state.addressExplorerUrl;
        if (addressExplorerUrl) {
            CoreHelperUtil.openHref(addressExplorerUrl, '_blank');
        }
    }
    onGoToUpgradeView() {
        EventsController.sendEvent({ type: 'track', event: 'EMAIL_UPGRADE_FROM_MODAL' });
        RouterController.push('UpgradeEmailWallet');
    }
};
W3mAccountDefaultWidget.styles = styles;
__decorate([
    state()
], W3mAccountDefaultWidget.prototype, "caipAddress", void 0);
__decorate([
    state()
], W3mAccountDefaultWidget.prototype, "address", void 0);
__decorate([
    state()
], W3mAccountDefaultWidget.prototype, "allAccounts", void 0);
__decorate([
    state()
], W3mAccountDefaultWidget.prototype, "profileImage", void 0);
__decorate([
    state()
], W3mAccountDefaultWidget.prototype, "profileName", void 0);
__decorate([
    state()
], W3mAccountDefaultWidget.prototype, "disconnecting", void 0);
__decorate([
    state()
], W3mAccountDefaultWidget.prototype, "balance", void 0);
__decorate([
    state()
], W3mAccountDefaultWidget.prototype, "balanceSymbol", void 0);
__decorate([
    state()
], W3mAccountDefaultWidget.prototype, "features", void 0);
W3mAccountDefaultWidget = __decorate([
    customElement('w3m-account-default-widget')
], W3mAccountDefaultWidget);
export { W3mAccountDefaultWidget };
//# sourceMappingURL=index.js.map