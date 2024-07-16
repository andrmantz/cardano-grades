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

const onClaim = async () => {
    const tx = await lucid
        .newTx()
        .payToAddress(await lucid.wallet.address(), {})
        .complete();
    await tx.sign().complete();
};

const submitGrades = async () => {
    await onClaim();

    const checkElements = document.querySelectorAll(".info-input");

    const students = [];
    checkElements.forEach(element => {
        const value = element.value;
        const dataId = element.getAttribute("data-id");
        
        const elementData = {
            value: value,
            dataId: dataId
        };
        
        students.push(elementData);
    });
    
    await fetch(window.location.href, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            students: students,
        }),
    });

    window.location.pathname = "/";
};

window.L = L;
document.getElementById("gradeBtn").addEventListener("click", submitGrades);
document.getElementById("connectBtn").addEventListener("click", loadCardano);
