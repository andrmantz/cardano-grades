# On-chain Components

## Tokens

-   _Grade Token_
    -   Policy:
        -   Mint: Minting can occur only once at an unlimited supply.
        -   Burn: Burning is unrestricted. Anyone can burn at any amount at any given time.
    -   There is only one token per School subject. The policy is the one specified above and the asset name is the subject’s name.
    -   The whole supply is locked in the `Subject` script and can only be distributed via it.
-   _Validity Token_
    -   Policy:
        -   Mint: Minting can occur only once and the supply is 1.
        -   Burn: Burning can never happen.
    -   Asset name is `Validity`.
    -   Purpose:
        -   It is included as value in the utxo containing the valid grade token policies. This way, our validators can always verify that the referenced input containing the valid policies data is always the “authorized” one.
-   _Registration Token_
    -   Policy:
        -   Mint: Can only be minted by the `Secretary` at any given time and at any supply.
        -   Burn: Unrestricted
    -   Purpose:
        -   This token takes 2 forms:
            1. University registration. This is a `School registration` token. It’s supply is 1, the Asset name will be the student’s ID and is used to “decorate” the UTXO in the `Student` address which contains the student’s grades. All the grade tokens are part of a single UTXO.
            2. Semester registration. It is used to prevent a student from registering twice in the same semester. The asset name is `{S/W}YEAR` to denote Spring or Winter semester of year `YEAR`.
-   _Degree Token_
    -   Policy:
        -   Mint:
            -   It has to contain as `input` the Student’s UTXO which contains all his grade (we will refer to it as `Grade UTXO` from now on) tokens. For each grade token, the quantity must be more than 5.
            -   It has to contain as `reference_input` the UTXO containing the `Validity Token`, which denotes which grade tokens are required to pursue a degree. This is used to ensure all the grades are sufficient to get the Degree.
            -   The asset name must be equal to the Student’s ID. This is verified as follows: The `Grade UTXO` has to contain a `School registration` token with Asset name the asset name of the Degree token being minted.
            -   To prevent double minting, all the Grade tokens must be burned. So, the minting policy expects the outputs to only contain either `Lovelace` or the token being minted.
            -   The amount of the `Degree Token` is the Degree’s grade with 2 decimal places. For example, if the amount is 678, it corresponds to a degree of 6.78. The minting policy expects the amount being minted to be equal to the average of all the grade token amounts in the `Grade UTXO`.
        -   Burn: Degree tokens cannot be burned.

## Validators

-   _Subject Script_
    -   Contains locked the total supply of the equivalent Grade Token. It’s purpose is to keep track of students registered in the Subject and distribute the Grade tokens upon grading.
    -   Datum:
        -   _teacher_: The PublicKey hash of the teacher.
        -   _registations_: A List containing the IDs of the registered students
        -   _register_until_: The date until new students can be registered.
        -   _reset_: For each registration, a student can get grade twice( regular and additional). When initialised, it is set to `False`. When teacher grades the students, if it is `False`, it is set to `True`, otherwise, the script is expected to be fully reset (registrations back to `[]` ) to be ready for the next school year.
    -   Other parameters:
        -   _policy_ and _asset_name_: The PolicyId and the Asset Name of the grade token of this subject.
        -   _secreta_: The Secretary’s PublicKey hash.
    -   Redeemer actions:
        -   Register:
            -   Can only be called by `secreta` before `register_until`. Adds a new student in the `registrations` List.
        -   Update:
            -   Can only be called by `secreta`. It can be used to update `teacher` or `register_until` datum fields.
        -   Grade:
            -   Can only be called by `datum.teacher`. It is used to distribute the Grade Tokens.
            -   Checks:
                -   All the students getting Grade tokens must be registered in the Subject as seen in the `registrations` list.
                -   We only keep track of “passed” grades, so all the grades must be in range `[5,10]`.
                -   The UTXO holds a big number of Grade tokens. It expects that a number, let’s say `N` of the tokens is distributed among the student’s UTXOs, while the remaining number of tokens is re-locked in a UTXO at the same address as the `Subject` validator.
                -   2 outputs containing `Grade Tokens` can’t end up in the same address.
            -   If `reset`
                -   `False`, then the `registration` array of the new Subject UTXO must remain unmodified and the `datum.reset` variable must be `True`.
                -   `True` , then the `registration` array must be emptied and `datum.reset` must be set back to `False`.
-   _Student Script_
    -   It is the `Student` address, that contains the `Grade UTXO` and the conditions under which this utxo can be consumed.
    -   Does not contain datum.
    -   Parameters:
        -   _student_: The student’s ID. It is used as a “barrier” so different student’s Scripts end up in different addresses.
        -   _validity_policy_: The policy of the validity token so the validity token can be identified.
        -   _degree_policy_: The degree token’s policyId.
    -   Redeemer actions:
        -   Grade:
            -   Expects a new grade UTXO to be present at the same address, which satisfies one the following properties:
                1. It contains the exact same grade tokens as the old grade UTXO, except for 1, which is a new grade. This new grade has to:
                    1. Be a valid grade token. This means that the PolicyId and the Asset name must be present in the `Grade Token Policies` data.
                    2. The amount, which is the grade, must be in range `[5,10]`.
                2. It contains the exact same policies, but **only one** amount is different. This means that there was a “regrade” in an additional exam, so the new amount must be greater than the old amount.
            -   Security note:
                -   All the `Grade tokens` are locked either in `Subject` validator or in a `Grade UTXO`. Upon Graduating, the `Degree Policy` forces those to be burned. So, when grade tokens are added, we know for sure that it is a result of a `Subject` script interaction.
                -   If a student attempts to use his grade UTXO along with a friend’s grade UTXO to “exchange grades”, it will fail because the `Student validator` expect the total final grades to always grow. Since the total supply of each grade is limited to `n`, where `n == student1_grade + student2_grade`, there can’t be a case where both students end up with different grades, since one student’s grade would fail to grow and it would cause failure.
        -   Graduate:
            -   Expects an output to be created during the transaction that contains `Degree Token`, with asset name equal to `student`. This ensures that in the same transaction, the `Degree Token` minting policy is attached and inherits it’s security guarantees regarding the grade UTXO. That is, all the tokens will be burned according to the policy.
-   Grade token policies script
    -   It’s purpose is to contain `datum` which show the valid grade tokens required for one to get his degree. In order to avoid malicious actors from re-generating this script with fake data, the one and only valid UTXO contains the `Validity NFT`.
    -   Datum:
        -   Contains a single datum named `subjects` which is a List of tuples `(PolicyId, AssetName)`.
    -   Parameters:
        -   _secreta_: The PublicKey hash of the Secretary.
    -   Redeemer actions:
        -   Can only be consumed by `secreta` . The purpose of such consume is to include more Grade tokens in `subjects` list, or to remove old subjects.
        -   Checks:
            -   There must be an output at the same address, containing the `Validity NFT` with a non-empty `subjects` list.
