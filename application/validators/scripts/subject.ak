use aiken/dict
use aiken/hash.{Blake2b_224, Hash}
use aiken/interval.{Finite}
use aiken/list
use aiken/time.{PosixTime}
use aiken/transaction.{
  InlineDatum, Input, Output, ScriptContext, Spend, Transaction, ValidityRange,
}
use aiken/transaction/credential.{Address, VerificationKey}
use aiken/transaction/value.{AssetName, PolicyId, Value}

type Datum {
  teacher: VerificationKeyHash,
  registrations: List<StudentId>,
  register_until: PosixTime,
  reset: Bool,
}

type Action {
  Register
  Update
  Grade
}

type StudentId =
  ByteArray

type VerificationKeyHash =
  Hash<Blake2b_224, VerificationKey>

validator(
  policy: PolicyId,
  asset_name: AssetName,
  secreta: VerificationKeyHash,
  registration_policy: PolicyId,
) {
  fn spend(datum: Datum, redeemer: Action, ctx: ScriptContext) {
    expect Spend(my_output_reference) = ctx.purpose

    let Transaction { inputs, outputs, reference_inputs, .. } = ctx.transaction
    expect Some(self_input) =
      inputs
        |> transaction.find_input(my_output_reference)

    let self_output = get_self_output(outputs, self_input.output.address)
    expect InlineDatum(d) = self_output.datum
    expect Datum { teacher, registrations, register_until, reset }: Datum = d
    when redeemer is {
      // Can only register a new student. Everything has to remain unchanged, except for the registrations list
      Register -> and {
          datum.reset == False,
          // is_period_valid(ctx.transaction.validity_range, datum.register_until),
          signed_by(ctx.transaction, secreta),
          teacher == datum.teacher,
          reset == datum.reset,
          register_until == datum.register_until,
          are_equal_except_last(datum.registrations, registrations),
          same_values(self_input.output.value, self_output.value),
        }
      // Can only update teacher or extend registration period
      Update -> and {
          signed_by(ctx.transaction, secreta),
          reset == datum.reset,
          datum.registrations == registrations,
          same_values(self_input.output.value, self_output.value),
        }
      Grade -> and {
          signed_by(ctx.transaction, datum.teacher),
          if datum.reset {
            and {
              list.is_empty(registrations),
              reset == False,
              register_until == datum.register_until,
            }
          } else {
            and {
              registrations == datum.registrations,
              register_until == datum.register_until,
              reset == True,
            }
          },
          validate_grade_outputs(
            outputs,
            reference_inputs,
            self_input.output,
            self_output,
            datum.registrations,
            policy,
            asset_name,
            registration_policy,
          ),
        }
    }
  }
}

/// Validate outputs
fn validate_grade_outputs(
  outputs: List<Output>,
  ref_inputs: List<Input>,
  self_input: Output,
  self_output: Output,
  registrations: List<ByteArray>,
  grade_policy: PolicyId,
  grade_asset: AssetName,
  registration_policy: PolicyId,
) -> Bool {
  let grades =
    list.filter_map(
      outputs,
      fn(o) {
        let grade = value.quantity_of(o.value, grade_policy, grade_asset)
        if and {
          grade >= 5,
          grade <= 10,
        } {
          expect Some(student_ref_input) =
            list.find(ref_inputs, fn(i) { i.output.address == o.address })
          expect [(student, _)] =
            student_ref_input.output.value
              |> value.tokens(registration_policy)
              |> dict.to_list()

          expect list.has(registrations, student)
          Some(grade)
        } else if grade != 0 {
          // if the grade is not 0, but neither in [5,10] range, then it has to be the self_output
          expect o == self_output
          Some(grade)
        } else {
          None
        }
      },
    )

  list.foldr(grades, 0, fn(sum, total) { sum + total }) == value.quantity_of(
    self_input.value,
    grade_policy,
    grade_asset,
  )
}

/// Get the output that has the same address as this validator
fn get_self_output(outputs: List<Output>, self: Address) -> Output {
  expect [self_output] = list.filter(outputs, fn(o) { o.address == self })
  self_output
}

/// Check if 2 Value objects are identical, except for the lovelace amount
fn same_values(input_values: Value, output_values: Value) -> Bool {
  list.is_empty(
    list.difference(
      value.flatten(value.without_lovelace(input_values)),
      value.flatten(value.without_lovelace(output_values)),
    ),
  )
}

/// Check if signer[0] == vk
fn signed_by(transaction: Transaction, vk: VerificationKeyHash) -> Bool {
  list.at(transaction.extra_signatories, 0) == Some(vk)
}

/// Checks if 2 arrays are equal except for the last element of the second array
fn are_equal_except_last(input_list: List<a>, output_list: List<a>) -> Bool {
  expect Some(output_) = list.init(output_list)
  input_list == output_
}

/// Check if registration period has not expired
fn is_period_valid(range: ValidityRange, target_time: PosixTime) -> Bool {
  when range.lower_bound.bound_type is {
    Finite(tx_earliest_time) -> tx_earliest_time <= target_time
    _ -> False
  }
}
