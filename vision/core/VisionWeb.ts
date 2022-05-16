
import _visionweb from 'visionweb/dist/VisionWeb.js'
import Bignumber from 'bignumber.js'

interface IAddress {
    fromHex(address: string): string;
    toHex(address: string): string;
    fromPrivateKey(privateKey: string): string;
    fromEth(address: string): string | Boolean;
    toEth(address: string): string | Boolean;
}

interface IAccount {
    address: {
        base58: string;
        hex: string;
    };
    privateKey: string;
    publicKey: string;
}

interface IVisionWeb {
    // TODO
    readonly TransactionBuilder;
    readonly Vs;
    readonly Contract;
    readonly Plugin;
    readonly Event;
    readonly version;

    event;
    transactionBuilder;
    vs;
    plugin;
    utils;
    providers;
    BigNumber;
    defaultBlock: number | Boolean;
    defaultPrivateKey: string | Boolean;
    defaultAddress: {
        hex: string | Boolean;
        base58: string | Boolean;
    }
    fullnodeVersion: string;
    feeLimit: number;
    injectPromise;

    new(option: Object | string, solidityNode?: string, eventServer?:string, sideOptions?: Object | string, privateKey?: string);

    getFullnodeVersion: () => string;
    setDefaultBlock(blockID: Number): void;
    setPrivateKey(privateKey: string): void;
    setAddress(address: string): void;
    fullnodeSatisfies(version: string): string;
    // TODO
    isValidProvider(provider): Boolean;
    // TODO
    setFullNode(fullNode): void;
    setSolidityNode(solidityNode): void;

    setEventServer(params): void;
    // TODO
    currentProviders();
    currentProvider();
    getEventResult(params);
    getEventByTransactionID(params);

    // TODO
    contract(abi: any[], address?: string);

    readonly address: IAddress;

    readonly sha3: (string: string, prefix?: Boolean) => string;
    readonly toHex: (val: string) => string;
    readonly toUtf8: (hex: string) => string;
    readonly fromUtf8: (string: string) => string;
    readonly toAscii: (hex: string) => string;
    readonly fromAscii: (string: string, padding) => string;
    readonly toDecimal: (value: number | string) => Number | string;
    readonly fromDecimal: (value: number | string) => Number | string;
    readonly fromVdt: (vdt: Bignumber | string) => string | Bignumber;
    readonly toVdt: (vs: string | Bignumber) => string | Bignumber;
    readonly toBigNumber: (amount: number) => Bignumber;

    readonly isAddress: (address: string) => Boolean;
    readonly isEthAddress: (address: string) => Boolean;

    // TODO
    readonly createAccount: () => IAccount;

    isConnected(callback?: (err, node) => any);

}

export const VisionWeb = _visionweb as IVisionWeb;
