import { Lucid, Blockfrost, Emulator } from "lucid-cardano";
import { addresses } from "../helpers/seedUtils.js";

class CardanoConnection {
    constructor() {
        this.lucid = null;
        this.emulator = null;
    }

    async initialize() {
        if (!this.lucid) {
            try {
                if (process.env.EMULATE) {
                    const initBalances = [{
                        address: process.env.ADMINISTRATOR_ADDRESS,
                        assets: { lovelace: 3000000000n }
                    }];
                    addresses.forEach((address) => {
                        initBalances.push({
                            address: address,
                            assets: { lovelace: 3000000000n }
                        });
                    });

                    const emulator = new Emulator(initBalances);
                    this.emulator = emulator;
                    this.lucid = await Lucid.new(emulator);
                } else {
                    this.lucid = await Lucid.new(
                        new Blockfrost(
                            process.env.BLOCKFROST_URL,
                            process.env.BLOCKFROST_PROJECT,
                        ),
                        process.env.NETWORK,
                    );
                }

                this.lucid.selectWalletFromSeed(process.env.ADMINISTRATOR_SEED);

                const walletAddress = await this.lucid.wallet.address();
                if (process.env.ADMINISTRATOR_ADDRESS !== walletAddress) {
                    throw new Error(
                        "Administrator address does not match the seed",
                    );
                }
            } catch (error) {
                throw error;
            }
        }
        return this.lucid;
    }
}

export default CardanoConnection;
