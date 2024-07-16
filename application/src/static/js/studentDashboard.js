import * as L from "https://unpkg.com/lucid-cardano@0.10.7/web/mod.js";

const loadCardano = async () => {
    const nami = window.cardano.nami;
    if (!nami) {
        setTimeout(loadCardano);
    } else {
        const api = await nami.enable();

        const lucid = await L.Lucid.new(new L.Emulator([]));
        lucid.selectWallet(api);

        document.getElementById("connectBtn").disabled = true;
        document.getElementById("connectBtn").innerHTML =
            '<i class="las la-wallet"></i> Wallet connected';

        window.lucid = lucid;
    }
};

const mintDegree = async () => {
    const studentAddress = await lucid.wallet.address();
    
    await fetch("/student/mint", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            studentAddress: studentAddress,
        }),
    });

    window.location.pathname = "/";
};

window.L = L;
document.getElementById("mintBtn").addEventListener("click", mintDegree);
document.getElementById("connectBtn").addEventListener("click", loadCardano);
