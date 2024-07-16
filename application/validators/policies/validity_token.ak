use aiken/dict
use aiken/list
use aiken/transaction.{OutputReference, ScriptContext, Transaction} as tx
use aiken/transaction/value

validator(utxo_ref: OutputReference) {
  fn policy(_datum: Void, ctx: ScriptContext) -> Bool {
    let ScriptContext { transaction, purpose } = ctx
    expect tx.Mint(policy_id) = purpose
    let Transaction { inputs, mint, .. } = transaction
    expect [(asset_name, amount)] =
      mint
        |> value.from_minted_value
        |> value.tokens(policy_id)
        |> dict.to_list()

    and {
      list.any(inputs, fn(input) { input.output_reference == utxo_ref }),
      asset_name == #"56616c6964697479",
      amount == 1,
    }
  }
}
