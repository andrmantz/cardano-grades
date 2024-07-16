use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{Output, ScriptContext, Spend, Transaction}
use aiken/transaction/credential.{Address, VerificationKey}
use aiken/transaction/value.{AssetName, PolicyId, Value}

type Datum {
  subjects: List<GradeToken>,
}

type GradeToken {
  policy: PolicyId,
  name: AssetName,
}

type VerificationKeyHash =
  Hash<Blake2b_224, VerificationKey>

validator(secreta: VerificationKeyHash) {
  fn change_subjects(_datum: Datum, _redeemer: Void, ctx: ScriptContext) -> Bool {
    expect Spend(my_output_reference) = ctx.purpose

    let Transaction { inputs, outputs, .. } = ctx.transaction
    expect Some(self_input) =
      inputs
        |> transaction.find_input(my_output_reference)

    let self_output = get_self_output(outputs, self_input.output.address)
    and {
      signed_by(ctx.transaction, secreta),
      same_values(self_input.output.value, self_output.value),
    }
  }
}

fn signed_by(transaction: Transaction, vk: VerificationKeyHash) -> Bool {
  list.at(transaction.extra_signatories, 0) == Some(vk)
}

fn get_self_output(outputs: List<Output>, self: Address) -> Output {
  expect [self_output] = list.filter(outputs, fn(o) { o.address == self })
  self_output
}

fn same_values(input_values: Value, output_values: Value) -> Bool {
  list.is_empty(
    list.difference(
      value.flatten(value.without_lovelace(input_values)),
      value.flatten(value.without_lovelace(output_values)),
    ),
  )
}
