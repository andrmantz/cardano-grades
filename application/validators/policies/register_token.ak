use aiken/dict
use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{ScriptContext, Transaction} as tx
use aiken/transaction/credential.{VerificationKey}
use aiken/transaction/value

type VerificationKeyHash =
  Hash<Blake2b_224, VerificationKey>

validator(secreta: VerificationKeyHash) {
  fn policy(_datum: Void, ctx: ScriptContext) -> Bool {
    let ScriptContext { transaction, purpose } = ctx
    expect tx.Mint(policy_id) = purpose
    let Transaction { mint, .. } = transaction
    expect [(_, amount)] =
      mint
        |> value.from_minted_value
        |> value.tokens(policy_id)
        |> dict.to_list()

    if amount > 0 {
      signed_by(ctx.transaction, secreta)
    } else {
      True
    }
  }
}

fn signed_by(transaction: Transaction, vk: VerificationKeyHash) {
  list.at(transaction.extra_signatories, 0) == Some(vk)
}
