import CardanoConnection from "../config/connector.js";
import {
    Data,
    applyParamsToScript,
    toText,
    fromText,
    Constr,
    fromUnit,
} from "lucid-cardano";

const subjectScriptCode =
    "5908570100003232323232323232322322322322322223232325333011323253330133370e9001180900089919191919191919191919299980f19b8748000c0740044c8c8c8c8c94ccc08ccdc3a4008604400226464a66604a66e1d2000302400113232323232323232533303030330021323232323232323232323253330383370e90000050a99981c299981c19b8748008c0e4dd51800981b0168a5013330384a0941288a99981c198011811981b0158180a99981c19b8f012375c6046606c05a2a666070a666070018266e1d2002303937546002606c05a266607066e1d2002303937546002606c05a941288a99981c19b8700e375a602e606c05a2a66607066464464a66607866e1d2000303b00113375e6e9c008c104c0e8004594ccc0f804c530103d87a800013374a90001981f9ba730020134bd70180080091299981e8008b099299981f0008a5eb804cc0fcc100008cc00c00cc104008c100004dd61813981b0168998029bab30273036302730360193756604e606c03029405280a5014a029405280a99981c19b874800802854ccc0e0cc008c08cc0d80ac0c054ccc0e14ccc0e00304cdc3a400460726ea8c004c0d80b44ccc0e0cdc3a400460726ea8c004c0d80b528251153330383375e604e606c05a6e9c0404cc014dd59813981b1813981b00c9bab3027303601814a029405280a99981c198011811981b0159bae3023303602d1533303853330383370e9001181c9baa3001303602d15333038533303b01014a2294054ccc0e14ccc0e0030528099981c2504a09444cdc38071bad3017303602d14a0294054ccc0e0cdd79ba70103027303602d153330383370e01c6eb4c05cc0d80b454ccc0e0030528899981c2514a09445280a50133323222323370e646600200200444a66608400229000099b80375a608800266004004608a0026660086eacc0b0c0ec00c0e40dcc8cc004004088894ccc10400452f5c0264646464a66608466e1d2002001133006006003133046304730400023300600600330400013253330415333041337129005000899b8900148050528099299982119b8748000c1040044c8c8c8c94ccc124c1300084c94ccc11cc8cc004004034894ccc13000452809919299982599b8f00200514a226600800800260a00046eb8c1380044cdd2a4000660966ea001d2f5c02c6eb8c11c00458c128004c8c8c94ccc11ccdc3a4004002297adef6c60137566098608a004608a0026601a0020766eacc0ccc108c0ccc108004c120004c10000458cc0940a08cdd79816982018189820000981698200020a99982099982099b870014800128251153330413375e006042266e95200033045375000297ae01614c0103d87a80003330073756605e607c004078074608a0046086002444646464a66607e66e1d20020011480004dd69822181e801181e80099299981f19b87480080045300103d87a8000132323300100100222533304400114c103d87a800013232323253330453371e014004266e95200033049375000297ae0133006006003375a608c0066eb8c110008c120008c118004dd59821981e001181e0009980200180111191980080080191299981f8008a60103d87a800013232323253330403371e00e004266e95200033044374c00297ae0133006006003375660820066eb8c0fc008c10c008c104004c09cc0d8064dd61813981b0168a5014a04607a607c607c607c0024466ebccc00cdd6181e981f181f181f181f181f181f181f181f181b0012400066e9520003303c375200297ae03001001222533303a00214c103d87a80001323253330393370e0069000099ba548000cc0f4dd480125eb804ccc014014004cdc0801a4004607c0066eb8c0f000888c94ccc0e40045288a503300530043003002300430030012323300100100222533303800114bd6f7b630099191919299981c99b8f48900002100313303d337606ea4008dd3000998030030019bab303a003375c6070004607800460740024646600200200444a66606e002297ae0132333222323300100100322533303d00110031323303f374e6607e6ea4018cc0fcdd49bae303c0013303f37506eb4c0f40052f5c0660060066082004607e0026eb8c0d8004dd5981b80099801801981d801181c8009800800911299981a8008801099980180199191980080080211299981c0008a5eb804c8c94ccc0dccdd79ba7002374e00a20022660766e9c008cc010010004c0f0008dd6181d0009bac30370013038001302d0223301f0052375c0022c66e1d2002302d3754606200260620046eb4c0bc004c0bc008dd6181680098168011bae302b0013023001163029001302100116300130200022302730283028001323232533302630290021001163027001323300100100722533302600114bd7009919299981299baf3010302300200513302900233004004001133004004001302a0023028001300b301e300f301e0013024001301c001163300100623375e6012603800201444646600200200644a6660460022980103d87a8000132325333022300500213374a90001981300125eb804cc010010004c09c008c094004dd6181000098100011bac301e001301e0023758603800260286002602801246036002603200260220022c6002602000a4602e603000229309b2b19299980899b874800000454ccc050c03c01452616153330113370e90010008a99980a18078028a4c2c2a66602266e1d200400115333014300f00514985858c03c010c94ccc040cdc3a400000226464646464646464a666036603c004264931980500291bae001163370e9001180c1baa301c001301c002375a603400260340046eb0c060004c060008dd7180b00098070028b180700211191980080080191299980a8008a4c2646600600660320046006602e0026eb8004dd70009bae001375c0024600a6ea80048c00cdd5000ab9a5573aaae7955cfaba05742ae89";
const validityTokenPolicy =
    "590190010000323232323232323232222533300632323232533300a3370e9000180480089919191919191919191919299980c180d80109919299980b991980080080591299980e0008a5013232533301b3375e6040603200403029444cc010010004c080008c07800454ccc05ccdc78012450856616c69646974790013370e00290010a5014a06eb4c060008dd7180b0008b180c800991919299980b19b874800800452f5bded8c026eacc06cc050008c050004c8cc004004008894ccc064004530103d87a8000132323232533301a3371e01e004266e9520003301e374c00297ae0133006006003375660360066eb8c064008c074008c06c004c8cc004004008894ccc06000452f5bded8c0264646464a66603266e3d22100002100313301d337606ea4008dd3000998030030019bab301a003375c6030004603800460340026eacc05c004c05c004c058004c054004c050008dd6180900098050029bae3010001300800116300e001300e002300c001300400114984d9588c014dd5000918019baa0015734aae7555cf2ab9f5740ae855d11";
const gradeTokenPolicy =
    "59018c010000323232323232323232232222533300832323232533300c3370e9000180580089919191919191919191919299980d180e80109919299980c99b8f002015153330193371090000008991980080080591299980f0008a5013232533301d3375e6044603600403029444cc010010004c088008c0800045288a50375a60340046eb8c06000458c06c004c8c8c94ccc060cdc3a4004002297adef6c6013756603a602c004602c002646600200200444a6660360022980103d87a8000132323232533301c3371e01e004266e95200033020374c00297ae01330060060033756603a0066eb8c06c008c07c008c074004c8cc004004008894ccc06800452f5bded8c0264646464a66603666e3d22100002100313301f337606ea4008dd3000998030030019bab301c003375c6034004603c00460380026eacc064004c064004c060004c05c004c058008dd6180a00098060029bae3012001300a0011630100013010002300e001300600114984d958dd7000918029baa001230033754002ae6955ceaab9e5573eae815d0aba201";
const registrationTokenPolicy =
    "5901b501000032323232323232323223222533300732323232533300b3370e90001805000899191919191919191919299980c180d801099299980b19b88480000044c8cdd79998008009bac301c301d301d301d301d301d301d301d301d3015301c301501148000cdd2a4000660366ea404d2f5c0444a666038004298103d87a800013232533301b3370e0069000099ba548000cc07cdd480125eb804ccc014014004cdc0801a400460400066eb8c0780085289bad301700116301900132323253330163370e90010008a5eb7bdb1804dd5980d980a001180a000991980080080111299980c8008a6103d87a8000132323232533301a3371e01c004266e9520003301e374c00297ae0133006006003375660360066eb8c064008c074008c06c004c8cc004004008894ccc06000452f5bded8c0264646464a66603266e3d22100002100313301d337606ea4008dd3000998030030019bab301a003375c6030004603800460340026eacc05c004c05c004c058004c054004c050004c02c014dd7180880098048008b18078009807801180680098028008a4c26cac6eb80048c014dd5000918019baa0015734aae7555cf2ab9f5740ae855d11";
const studentScriptCode =
    "5901d9010000323232323232323232232232222533300a3232323232325333010323300100100522533301500114a026464a66602866e2120003232323253330183370e90010008a400026eb4c074c058008c058004c94ccc05ccdc3a4004002298103d87a8000132323300100100222533301d00114c103d87a8000132323232533301e3371e034004266e95200033022375000297ae0133006006003375a603e0066eb8c074008c084008c07c004dd5980e180a801180a800991980080080111299980d0008a6103d87a8000132323232533301b3371e02a004266e9520003301f374c00297ae0133006006003375660380066eb8c068008c078008c070004dd598029809180298090010a51133004004001301900230170011323300100100322533301500114a226464a66602866ebcdd319191980080080111299980d0008a5eb7bdb1804c8c8c8c94ccc06ccdc7a4500002100313301f337606ea4008dd3000998030030019bab301c003375c6034004603c00460380026eacc014c04800930101a00013300400400114a06032004602e00229408c054c058004dd6180980098098011bac301100130110013008300f300800114984d958dd70009bae001230053754002460066ea80055cd2ab9d5573caae7d5d02ba157441";
const policiesScriptCode =
    "5902be01000032323232323232323223222253330083232533300a3370e900118048008991919191919191919299980999b8748000c0480044c8c8c94ccc058c8cdd79998008009bac301c301d301d301d301d301d301d301d301d3015300b301501048000cdd2a4000660366ea404d2f5c0444a6660380042980103d87a800013232533301b3370e0069000099ba548000cc07cdd480125eb804ccc014014004cdc0801a400460400066eb8c0780084c8c8c8c8c94ccc0780045288a5033003300230013756602460306024603000c600460026eacc048c0600148c8cc004004008894ccc07c00452f5bded8c0264646464a66604066e3d2201000021003133024337606ea4008dd3000998030030019bab3021003375c603e004604600460420024646600200200444a66603c002297ae01323332223233001001003225333024001100313233026374e6604c6ea4018cc098dd49bae30230013302637506eb4c0900052f5c0660060066050004604c0026eb8c074004dd5980f00099801801981100118100009800800911299980e0008801099980180199191980080080211299980f8008a5eb804c8c94ccc078cdd79ba7002374e00a20022660446e9c008cc010010004c08c008dd618108009bac301e001301f00114a0646464a666036603c00420022c6038002646600200200c44a666036002297ae013232533301a3375e601c603000400a26603c00466008008002266008008002603e004603a00260126026601a6026002603200260220022c646600200200a44a66602e0022980103d87a80001323253330163375e60146028004016266e9520003301a0024bd70099802002000980d801180c8009bac3016001301600130150023758602600260166002601600c46024002602000260100022c6002600e0044601c601e00229309b2b1bae001230053754002460066ea80055cd2ab9d5573caae7d5d02ba15745";
const degreeMintingPolicy =
    "59066201000032323232323232323223223223222533300b32323232533300f3370e90001807000899191919191919191919191919299980f98110010991919191919299981119b8748000c0840044c8c8c8c8c94ccc09ccdc3a4000604c0022646464a66605466e1d2004302900113232533302c3370e90001815800899192999818981a00109929998179919baf3330010013758606a606c606c606c606c606c606c606c606c605c6018605c04c900019ba548000cc0d0dd481425eb808894ccc0d40085300103d87a80001323253330343370e0069000099ba548000cc0e0dd480125eb804ccc014014004cdc0801a400460720066eb8c0dc00854ccc0bccdc3809240082a66605e6464646600200200a44a66606c00229444c8c94ccc0d4cdc4a401466602c00a6eb8c044c0cc008dd7180b98198010998020020008a50303a0023038001323300100101e22533303500114bd6f7b63009991299981a19baf301030323016303200200f13232333001001003002222533303b0021001132333004004303f00333223233001001005225333040001133041337606ea4010dd3001a5eb7bdb1804c8c8c8c94ccc104cdd79980900400126103d8798000133045337606ea4020dd30038028a99982099b8f0080021323253330433370e900000089982399bb037520146090608200400a200a608200264a666084a66608a00229445280a60103d87a800013374a9000198231ba60014bd70191998008008040011112999823801080089919980200218258019991191980080080291299982600089982699bb037520086ea000d2f5bded8c0264646464a66609a66ebccc078020009300103d8798000133051337606ea4020dd40038028a99982699b8f00800213232533304f3370e900000089982999bb0375201460a8609a00400a200a609a00264a66609c66e1c005200014c103d87a800013374a9000198291ba80014bd7019b80007001133051337606ea4008dd4000998030030019bad304e003375c609800460a0004609c0026eb8c118004dd69823800982480109982299bb037520046e98004cc01801800cdd598210019bae304000230440023042001375c60740026eacc0ec004c0f4008dd5980b1819180b18190010800981b80099801001181c00091299981899b9000200114c0103d8798000153330313371e0040022980103d87a800014c103d87b80001323300100101b22533303400114a026464a666066a66606666ebcc03cc0c40080384cdc399980a1bab30153031002023017480085280a511330040040013038002303600114a0294052819198008008011129998198008a4c26466006006606e0046464a66606466e1d20000011323232325333039303c002149858dd7181d000981d0011bae303800130300021630300013035001163758606400260540022c606000260500022c605c605e605e604e6016604e002605a002604a0022c6600c026466e1cccc020dd59804981298049812800810a450856616c69646974790048008c004c08cc01cc08c0088c0a8004c0a0004c08000458cc0040388cdc39998019bab300430203004302000101e0064800888c8cc00400400c894ccc09c004530103d87a8000132325333026300500213374a90001981500125eb804cc010010004c0ac008c0a4004888c8c8c94ccc094cdc3a40040022900009bad302a302300230230013253330243370e90010008a6103d87a8000132323300100100222533302a00114c103d87a8000132323232533302b3371e014004266e9520003302f375000297ae0133006006003375a60580066eb8c0a8008c0b8008c0b0004dd5981498110011811000998048018011181218128009bad301f002375c603a0022c6040002646464a66603a66e1d200200114bd6f7b63009bab3022301b002301b0013300200100b323300100100322533301f00114bd6f7b630099191919299981019b8f4881000021003133024337606ea4008dd3000998030030019bab3021003375c603e0046046004604200244646600200200644a6660400022980103d87a800013232323253330213371e00e004266e95200033025374c00297ae0133006006003375660440066eb8c080008c090008c088004dd5980e800980e800980e0011bac301a001301a002375860300026030002601e00a6eb8c054004c03400458c04c004c04c008c044004c02400452613656375c0026eb8004dd7000918029baa001230033754002ae6955ceaab9e5573eae815d0aba201";

class CardanoRepository {
    async init() {
        const conn = new CardanoConnection();
        this.lucid = await conn.initialize();
        this.emulator = conn.emulator;
    }

    constructor() {
        this.lucid = null;
        this.emulator = null;
    }

    PoliciesDatum = Data.Object({
        subjects: Data.Array(
            Data.Object({
                policy: Data.Bytes(),
                name: Data.Bytes(),
            }),
        ),
    });

    SubjectDatum = Data.Object({
        teacher: Data.Bytes(),
        registrations: Data.Array(Data.Bytes),
        register_until: Data.Integer(),
        reset: Data.Boolean(),
    });

    SubjectRedeemer = {
        register: Data.to(new Constr(0, [])),
        update: Data.to(new Constr(1, [])),
        grade: Data.to(new Constr(2, [])),
    };

    /* 
        Emulator utils 
    */
    submit = async (tx) => {
        const signedTx = await tx.sign().complete();
        await signedTx.submit();
        this.emulator.awaitBlock(this.emulator.blockHeight + 5);
    };

    pickTeacher = (teacher) => {
        const keys = {
            'addr_test1vq3u06x3az639mnr9g4u63zpr72awzysddx9chuaz06mjrcu6x377':
                'ed25519_sk1rq9293txvl7znfzwxc0qaclragzhecwqhnmayewc0aje882tsm3s8lr9dl',
            'addr_test1vzyxxdlemy75eszfhv5r5gvymte0xmznk6ytxqn5m0p7nkc6n23tf':
                'ed25519_sk1rk9hwmyq43d0yljxfthlhttqf9tumcpfvzw3n3danr5xvensursq3p4gak',
            'addr_test1vq5mn7z05vzvfuxcy54n0zslqsut5q480uazzs8nugefm8sxx2hhq':
                'ed25519_sk1stx333v2t2ut8lezmu7yvcnnggttl5ucd99hvv4qpdgjms88gjqsan0vpl',
            'addr_test1vr2guplt6kts794h3gd7v86cjhzm9qsfud4taldp8qjh0rqp0wv0g':
                'ed25519_sk1ltn47rhvaxxs770rms4cakuzz48g6qwhw06zgzt005ldnn3pre3s533hdd',
            'addr_test1vrj9s7kfgh45rjt3t8zkqwpv5ghuc08qk4ly48ja08vkcmqheh9g6':
                'ed25519_sk1kqumpvnknm8unnpvkgqpvum236xjngk0k9et8fqznn0nthv7xkcqlhc9e8',
            'addr_test1vqaphknrp0duul7ux2hpyu5jvkwvf3v0lzf2yfkjncz7hhsumlv7a':
                'ed25519_sk18g60e72xejh87jjw5u3zqlcky9tnldpqsp2vrspe79eqjvv6xhys9cvzsh',
            'addr_test1vrx9fr5vle5nzaxc28nyst9q0paz9de6xtzntj2t640g4ecf287wa':
                'ed25519_sk1zvwjtygmclpkhzj665mxa8rrxmqm49yk77ghq6wrvm0mfnj7u7sscmazkd',
            'addr_test1vrhf0z5ykx57yrnj0c8ylurxpgmfqyztc8xk78hszyptvaq58t06w':
                'ed25519_sk15syq3jn9n7ezzpm5jjcwgy6j940hvp5uk0cxyvlkzjcaxfqv3qnqp0xv9f',
            'addr_test1vpnx32u9jz50m4sgte8k75gml7esp36g65tqnnzyh3rd7wqpjj24n':
                'ed25519_sk1vce32qmcl64j74dcc7s2akcp9aaaes9twwjf4ysr2xy3wgkza0qqq2ryqp',
        }

        this.lucid.selectWalletFromPrivateKey(keys[teacher]);
    }

    reset = () => {
        this.lucid.selectWalletFromSeed(process.env.ADMINISTRATOR_SEED);
    }

    utxosat = async (address) => {
        return (await this.lucid.utxosAt(address));
    }

    vUnit = () => {
        return process.env.VUNIT;
    };
    /*
        Registration Policy Functions
    */
    registrationPolicy = () => {
        return {
            type: "PlutusV2",
            script: applyParamsToScript(registrationTokenPolicy, [
                this.lucid.utils.getAddressDetails(
                    process.env.ADMINISTRATOR_ADDRESS,
                ).paymentCredential.hash,
            ]),
        };
    };

    getRToken = (name) => {
        return `${this.lucid.utils.mintingPolicyToId(this.registrationPolicy())}${fromText(name)}`;
    };

    getRPolicy = () => {
        return this.lucid.utils.mintingPolicyToId(this.registrationPolicy());
    }

    /*
        Policies Contract Function
    */

    policyScript = () => {
        return {
            type: "PlutusV2",
            script: applyParamsToScript(policiesScriptCode, [
                this.lucid.utils.getAddressDetails(
                    process.env.ADMINISTRATOR_ADDRESS,
                ).paymentCredential.hash,
            ]),
        };
    };

    initPolicyContract = async () => {
        const utxo = (
            await this.lucid.utxosAt(process.env.ADMINISTRATOR_ADDRESS)
        )[0];
        const outRef = new Constr(0, [
            new Constr(0, [utxo.txHash]),
            BigInt(utxo.outputIndex),
        ]);

        const validityToken = {
            type: "PlutusV2",
            script: applyParamsToScript(validityTokenPolicy, [outRef]),
        };

        const validityUnit = `${this.lucid.utils.mintingPolicyToId(validityToken)}${fromText("Validity")}`;

        const policiesData = this.policyScript();

        const address = this.lucid.utils.validatorToAddress(policiesData);

        const datum = Data.to(
            {
                subjects: [],
            },
            this.PoliciesDatum,
        );

        const tx = await this.lucid
            .newTx()
            .collectFrom([utxo])
            .mintAssets({ [validityUnit]: 1n }, Data.void())
            .payToContract(address, { inline: datum }, { [validityUnit]: 1n })
            .attachMintingPolicy(validityToken)
            .complete();

        await this.submit(tx);
        return validityUnit;
    };

    getPolicies = async () => {
        const pAddress = this.lucid.utils.validatorToAddress(
            this.policyScript(),
        );
        const policies = (
            await this.lucid.utxosAtWithUnit(pAddress, this.vUnit())
        )[0];
        const gradeTokens = Data.from(policies.datum, this.PoliciesDatum);
        return gradeTokens;
    };

    updatePolicies = async (newPolicies) => {
        const policiesData = this.policyScript();
        const pAddress = this.lucid.utils.validatorToAddress(
            this.policyScript(),
        );

        const policies = (
            await this.lucid.utxosAtWithUnit(pAddress, this.vUnit())
        )[0];
        const tokens = newPolicies.map((gToken) => ({
            policy: this.lucid.utils.mintingPolicyToId(gToken.gToken),
            name: fromText(gToken.sName),
        }));

        const datum = Data.to(
            {
                subjects: tokens,
            },
            this.PoliciesDatum,
        );

        const tx = await this.lucid
            .newTx()
            .collectFrom([policies], Data.void())
            .payToContract(pAddress, { inline: datum }, { [this.vUnit()]: 1n })
            .attachSpendingValidator(policiesData)
            .addSigner(process.env.ADMINISTRATOR_ADDRESS)
            .complete();

        await this.submit(tx);
    };

    /*
    Subject Contract Calls 
    */

    gUnit = (subject) => {
        return `${this.lucid.utils.mintingPolicyToId(subject.gToken)}${fromText(subject.sName)}`;
    }

    sAddress = (subject) => {
        return this.lucid.utils.validatorToAddress(this.getSubject(subject));
    }

    deploySubject = async (name, teacher, initStudents, initGrades) => {
        const utxo = (
            await this.lucid.utxosAt(process.env.ADMINISTRATOR_ADDRESS)
        )[0];
        const outRef = new Constr(0, [
            new Constr(0, [utxo.txHash]),
            BigInt(utxo.outputIndex),
        ]);

        const gradeToken = {
            type: "PlutusV2",
            script: applyParamsToScript(gradeTokenPolicy, [fromText(name), outRef]),
        };

        const pid = this.lucid.utils.mintingPolicyToId(gradeToken);

        const unit = `${pid}${fromText(name)}`;
        const rPid = this.lucid.utils.mintingPolicyToId(
            this.registrationPolicy(),
        );

        const script = {
            type: "PlutusV2",
            script: applyParamsToScript(subjectScriptCode, [
                pid,
                fromText(name),
                this.lucid.utils.getAddressDetails(
                    process.env.ADMINISTRATOR_ADDRESS,
                ).paymentCredential.hash,
                rPid,
            ]),
        };

        const address = this.lucid.utils.validatorToAddress(script);

        const datum = Data.to(
            {
                teacher:
                    this.lucid.utils.getAddressDetails(teacher)
                        .paymentCredential.hash,
                registrations: [],
                register_until: 0n,
                reset: false,
            },
            this.SubjectDatum,
        );

        const sum = initGrades.reduce((a, b) => a + b, 0);

        const tx = this.lucid
            .newTx()
            .collectFrom([utxo])
            .mintAssets({ [unit]: 100000000000n }, Data.void())
            .payToContract(
                address,
                { inline: datum },
                { [unit]: 100000000000n - BigInt(sum) },
            )
            .attachMintingPolicy(gradeToken);

        // Setup init grades
        for (let i = 0; i < initStudents.length; i++) {
            const student = this.lucid.utils.validatorToAddress(
                this.getStudentValidator(initStudents[i]),
            );
            tx.payToAddress(student, { [unit]: BigInt(initGrades[i]) });
        }

        await this.submit(await tx.complete());
        return gradeToken;
    };

    getSubject = (subject) => {
        const rPid = this.lucid.utils.mintingPolicyToId(
            this.registrationPolicy(),
        );
        const pid = this.lucid.utils.mintingPolicyToId(subject.gToken);
        return {
            type: "PlutusV2",
            script: applyParamsToScript(subjectScriptCode, [
                pid,
                fromText(subject.sName),
                this.lucid.utils.getAddressDetails(
                    process.env.ADMINISTRATOR_ADDRESS,
                ).paymentCredential.hash,
                rPid,
            ]),
        };
    };

    registerSubjects = async (subjectDetails, newRegistration, semester) => {
        // get student's semester
        const rUnit = this.getRToken(semester);
        const studentAddress = this.studentAddress(newRegistration);

        const tx = this.lucid
            .newTx()
            .addSigner(process.env.ADMINISTRATOR_ADDRESS)
            .mintAssets({ [rUnit]: 1n }, Data.void())
            .payToAddress(studentAddress, { [rUnit]: 1n })
            .attachMintingPolicy(this.registrationPolicy())
            .validFrom(this.emulator.now());

        for (const subject of subjectDetails) {
            const script = this.getSubject(subject);
            const gUnit = `${this.lucid.utils.mintingPolicyToId(subject.gToken)}${fromText(subject.sName)}`;
            const address = this.lucid.utils.validatorToAddress(script);
            const utxo = (await this.lucid.utxosAtWithUnit(address, gUnit))[0];

            const currDatum = Data.from(utxo.datum, this.SubjectDatum);
            currDatum.registrations.push(fromText(newRegistration));
            tx.collectFrom([utxo], this.SubjectRedeemer["register"])
                .payToContract(
                    address,
                    { inline: Data.to(currDatum, this.SubjectDatum) },
                    { [gUnit]: utxo.assets[gUnit] },
                )
                .attachSpendingValidator(script);
        }

        await this.submit(await tx.complete());
    };

    getSubjectDetails = async (subject) => {
        const script = this.getSubject(subject);

        const gUnit = `${this.lucid.utils.mintingPolicyToId(subject.gToken)}${fromText(subject.sName)}`;
        const address = this.lucid.utils.validatorToAddress(script);
        return Data.from(
            (await this.lucid.utxosAtWithUnit(address, gUnit))[0].datum,
            this.SubjectDatum,
        );
    };

    updateSubject = async (subject, properties) => {
        const script = this.getSubject(subject);
        const address = this.lucid.utils.validatorToAddress(script);
        const gUnit = `${this.lucid.utils.mintingPolicyToId(subject.gToken)}${fromText(subject.sName)}`;

        const utxo = (await this.lucid.utxosAtWithUnit(address, gUnit))[0];
        const currDatum = Data.from(utxo.datum, this.SubjectDatum);

        if ("register_until" in properties) {
            currDatum.register_until = properties.register_until;
        }
        if ("teacher" in properties) {
            currDatum.teacher = properties.teacher;
        }

        const tx = await this.lucid
            .newTx()
            .collectFrom([utxo], this.SubjectRedeemer["update"])
            .payToContract(
                address,
                { inline: Data.to(currDatum, this.SubjectDatum) },
                { [gUnit]: utxo.assets[gUnit] },
            )
            .attachSpendingValidator(script)
            .addSigner(process.env.ADMINISTRATOR_ADDRESS)
            .complete();
        await this.submit(tx);
        return currDatum;
    };

    updateRegisterUntil = async (subjectDetails, register_until) => {
        const registerUntil = BigInt(register_until);
        const tx = this.lucid
            .newTx()
            .addSigner(process.env.ADMINISTRATOR_ADDRESS);

        for (const subject of subjectDetails) {
            const script = this.getSubject(subject);
            const address = this.lucid.utils.validatorToAddress(script);
            const gUnit = `${this.lucid.utils.mintingPolicyToId(subject.gToken)}${fromText(subject.sName)}`;

            const utxo = (await this.lucid.utxosAtWithUnit(address, gUnit))[0];
            const currDatum = Data.from(utxo.datum, this.SubjectDatum);

            currDatum.register_until = registerUntil;

            tx.collectFrom([utxo], this.SubjectRedeemer["update"])
                .payToContract(
                    address,
                    { inline: Data.to(currDatum, this.SubjectDatum) },
                    { [gUnit]: utxo.assets[gUnit] },
                )
                .attachSpendingValidator(script);
        }
        await this.submit(await tx.complete());
    };

    grade = async (students, grades, subject) => {
        const subjectScript = this.getSubject(subject);
        const subject_address = this.lucid.utils.validatorToAddress(subjectScript);
        const gUnit = `${this.lucid.utils.mintingPolicyToId(subject.gToken)}${fromText(subject.sName)}`;
        const subject_utxo = (
            await this.lucid.utxosAtWithUnit(subject_address, gUnit)
        )[0];

        const all_grades = grades.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);

        const datum = Data.from(subject_utxo.datum, this.SubjectDatum);
        if (datum.reset) {
            datum.registrations = [];
        }
        datum.reset = !datum.reset;

        const tx = this.lucid
            .newTx()
            .collectFrom([subject_utxo], this.SubjectRedeemer["grade"])
            .attachSpendingValidator(subjectScript)
            .addSigner(await this.lucid.wallet.address())
            .payToContract(
                subject_address,
                { inline: Data.to(datum, this.SubjectDatum) },
                { [gUnit]: subject_utxo.assets[gUnit] - BigInt(all_grades) },
            );

        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            const rToken = this.getRToken(student);
            const studentAddress = this.lucid.utils.validatorToAddress(
                this.getStudentValidator(student),
            );
            const ref_utxo = (
                await this.lucid.utxosAtWithUnit(studentAddress, rToken)
            )[0];
            tx.readFrom([ref_utxo]).payToAddress(studentAddress, {
                [gUnit]: BigInt(grades[i]),
            });
        }

        await this.submit(await tx.complete());
    };

    /*
        Student Contract Calls 
    */
    getStudentValidator = (studentId) => {
        const rid = this.lucid.utils.mintingPolicyToId(
            this.registrationPolicy(),
        );
        return {
            type: "PlutusV2",
            script: applyParamsToScript(studentScriptCode, [
                fromText(studentId),
                rid,
            ]),
        };
    };

    studentAddress = (studentId) => {
        return this.lucid.utils.validatorToAddress(
            this.getStudentValidator(studentId),
        );
    };

    registerStudent = async (studentId) => {
        const rPolicy = this.registrationPolicy();
        const rUnit = `${this.lucid.utils.mintingPolicyToId(rPolicy)}${fromText(studentId)}`;

        const address = this.studentAddress(studentId);

        const tx = await this.lucid
            .newTx()
            .mintAssets({ [rUnit]: 1n }, Data.void())
            .payToContract(address, { inline: Data.void() }, { [rUnit]: 1n })
            .attachMintingPolicy(rPolicy)
            .addSigner(process.env.ADMINISTRATOR_ADDRESS)
            .complete();
        await this.submit(tx);
        return address;
    };

    getGrades = async (student) => {
        const policies = (await this.getPolicies()).subjects;
        const address = this.studentAddress(student);

        const utxos = await this.lucid.utxosAt(address);

        const degreeUtxo = await this.lucid.utxosAtWithUnit(address, `${this.lucid.utils.mintingPolicyToId(this.degreePolicy())}${fromText(student)}`);


        const grades = { "degree": (degreeUtxo.length == 0) };
        for (const utxo of utxos) {
            for (const subject of policies) {
                const unit = `${subject.policy}${subject.name}`;
                if (unit in utxo.assets) {
                    const sName = toText(subject.name);
                    if (!grades[sName] || grades[sName] < utxo.assets[unit])
                        grades[sName] = utxo.assets[unit];
                }
            }
        }

        if (grades["degree"])
            for (const subject of policies) {
                const n = toText(subject.name);
                if (!grades[n] || grades[n] < 5n || grades[n] > 10n) {
                    grades["degree"] = false;
                    break;
                }
            }

        return grades;
    };

    passedSubjects = async (student) => {
        const policies = (await this.getPolicies()).subjects;
        const address = this.studentAddress(student);

        const utxos = await this.lucid.utxosAt(address);
        const passed = new Set();
        for (const utxo of utxos) {
            for (const subject of policies) {
                const unit = `${subject.policy}${subject.name}`;
                if (unit in utxo.assets && utxo.assets[unit] >= 5n) {
                    passed.add(toText(subject.name));
                }
            }
        }
        return passed;
    };

    isRegistered = async (student, semester) => {
        const address = this.studentAddress(student);
        const rPolicy = this.lucid.utils.mintingPolicyToId(
            this.registrationPolicy(),
        );
        if (semester == "0") {
            return (
                (
                    await this.lucid.utxosAtWithUnit(
                        address,
                        `${rPolicy}${fromText(student)}`,
                    )
                ).length > 0
            );
        }
        const rUnit = this.getRToken(semester);

        return (await this.lucid.utxosAtWithUnit(address, rUnit)).length > 0;
    };

    /*
     Degree Minting Functions
    */
    degreePolicy = () => {
        const rPolicy = this.lucid.utils.mintingPolicyToId(
            this.registrationPolicy(),
        );
        return {
            type: "PlutusV2",
            script: applyParamsToScript(degreeMintingPolicy
                , [
                    rPolicy,
                    fromUnit(this.vUnit()).policyId,
                    this.lucid.utils.getAddressDetails(
                        process.env.ADMINISTRATOR_ADDRESS,
                    ).paymentCredential.hash,
                ]),
        };
    };

    mintDegree = async (student, degreeReceiver, degreeGrade) => {
        const pAddress = this.lucid.utils.validatorToAddress(
            this.policyScript(),
        );

        const policies = (
            await this.lucid.utxosAtWithUnit(pAddress, this.vUnit())
        )[0];

        const subjects = Data.from(policies.datum, this.PoliciesDatum).subjects;

        const address = this.studentAddress(student);

        const utxos = await this.lucid.utxosAt(address);
        const rToken = this.getRToken(student);

        const rTokenUtxo = (await this.lucid.utxosAtWithUnit(address, rToken))[0];

        const policy = this.degreePolicy(this.vUnit());
        const unit = `${this.lucid.utils.mintingPolicyToId(policy)}${fromText(student)}`;


        const tx = this.lucid
            .newTx()
            .readFrom([rTokenUtxo])
            .readFrom([policies])
            .mintAssets({ [unit]: 2n }, Data.void())
            .attachMintingPolicy(policy)
            .addSigner(process.env.ADMINISTRATOR_ADDRESS)
            .payToAddress(degreeReceiver, { [unit]: 1n })
            .payToContract(address, { inline: Data.void() }, { [unit]: 1n })
            .attachMetadata(0, { "Degree Grade": degreeGrade });

        for (const utxo of utxos) {
            for (const subject of subjects) {
                const unit = `${subject.policy}${subject.name}`;
                if (
                    unit in utxo.assets && utxo.assets[unit] >= 5n
                ) {
                    tx.readFrom([utxo]);
                }
            }
        }

        await this.submit(await tx.complete());
    };

    getDPolicy = () => {
        return this.lucid.mintingPolicyToId(this.degreePolicy());
    }
}

export default CardanoRepository;
