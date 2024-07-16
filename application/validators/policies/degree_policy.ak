use aiken/dict
use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{InlineDatum, Input, ScriptContext, Transaction} as tx
use aiken/transaction/credential.{Address, VerificationKey}
use aiken/transaction/value.{AssetName, PolicyId}

type VerificationKeyHash =
  Hash<Blake2b_224, VerificationKey>

type RefDatum {
  subjects: List<GradeToken>,
}

type GradeToken {
  policy: PolicyId,
  name: AssetName,
}

validator(
  register_policy: PolicyId,
  validity_policy: PolicyId,
  secreta: VerificationKeyHash,
) {
  fn policy(_: Void, ctx: ScriptContext) -> Bool {
    let ScriptContext { transaction, purpose } = ctx
    expect tx.Mint(policy_id) = purpose
    let Transaction { mint, reference_inputs, outputs, .. } = transaction
    expect [(asset_name, amount)] =
      mint
        |> value.from_minted_value
        |> value.tokens(policy_id)
        |> dict.to_list()

    expect Some(student_input) =
      list.find(
        reference_inputs,
        fn(i) {
          value.quantity_of(i.output.value, register_policy, asset_name) == 1
        },
      )

    let student_address = student_input.output.address
    expect Some(ref_input) =
      list.find(
        reference_inputs,
        fn(i) {
          value.quantity_of(
            i.output.value,
            validity_policy,
            #"56616c6964697479",
          ) == 1
        },
      )

    expect InlineDatum(ref_data) = ref_input.output.datum
    expect RefDatum { subjects }: RefDatum = ref_data

    and {
      signed_by(ctx.transaction, secreta),
      amount == 2,
      validate_grades(subjects, reference_inputs, student_address),
      list.any(
        outputs,
        fn(o) {
          o.address == student_address && value.quantity_of(
            o.value,
            policy_id,
            asset_name,
          ) == 1
        },
      ),
    }
  }
}

fn validate_grades(
  policies: List<GradeToken>,
  grade_inputs: List<Input>,
  student_address: Address,
) -> Bool {
  let values =
    list.foldr(
      grade_inputs,
      value.zero(),
      fn(i, v) {
        if i.output.address == student_address {
          value.merge(v, i.output.value)
        } else {
          v
        }
      },
    )

  list.all(policies, fn(p) { value.quantity_of(values, p.policy, p.name) >= 5 })
}

fn signed_by(transaction: Transaction, vk: VerificationKeyHash) {
  list.at(transaction.extra_signatories, 0) == Some(vk)
}
