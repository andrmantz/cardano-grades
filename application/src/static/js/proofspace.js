window.onload = () => {
    let preFilledCreds = [];

    const cfg = {
        size: 300,
        serviceDid: "WwDZ3sgsvnYsSvofQ6zjT5",
        interactionId: "1",
        instanceId: "6584306e8c88bbfa40464042",
    };

    ProofSpace.WebLinker.start(
        document.getElementById("qrCode"),
        cfg,
        preFilledCreds,
    );
};
