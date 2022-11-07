import { Form, useActionData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import type { ActionFunction } from "@remix-run/node";
import { categories } from "~/utils/categories";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    concept: string | undefined;
    amount: string | undefined;
    category: string | undefined;
  };
  fields?: {
    concept: string;
    amount: string;
    category: string;
  };
};

function validateConcept(concept: string) {
  if (concept.length < 3 ) return "Write a longer concept";
}

function validateAmount(amount: string) {
  if (amount.length === 0 || parseInt(amount) <= 0) return "Amount cannot be 0 or a negative number";
}

function validateCategory(category: string) {
  if (category.length < 3) return "Category is too short";
}

const badRequest = (data: ActionData) =>
  json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  try {
    const formValues = await request.formData();
    const concept = formValues.get("concept") as string;
    const amount = formValues.get("amount") as string;
    const category = formValues.get("category") as string;

    const fieldErrors = {
      concept: validateConcept(concept),
      amount: validateAmount(amount),
      category: validateCategory(category),
    };
    const fields = { concept, amount, category };

    if (Object.values(fieldErrors).some(Boolean)) return badRequest({ fieldErrors, fields });

    await db.bills.create({
      data: { concept, quantity: parseFloat(amount), category },
    });

    return redirect("/");
  } catch (error) {
    return badRequest({
      formError: "Something went wrong",
    });
  }
}

export default function AddBillPage() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="flex w-100 h-screen items-center justify-center bg-slate-700">
      <Form
        method="post"
        className="flex flex-col w-64 bg-zinc-200 mr-9 py-3 px-2 rounded-md"
      >
        <span className="self-center mb-3">
          New Bill
        </span>

        <span>Concept:</span>
        <input
          type="text"
          name="concept"
          className="mb-3 px-2 border border-gray-400 rounded-md h-9"
          defaultValue={actionData?.fields?.concept}
          aria-invalid={
            Boolean(actionData?.fieldErrors?.concept) ||
            undefined
          }
          aria-errormessage={
            actionData?.fieldErrors?.concept
              ? "concept-error"
              : undefined
          }
        />
        
        <span>Amount:</span>
        <input
          type="text"
          name="amount"
          className="mb-4 px-2 border border-gray-400 rounded-md h-9"
          placeholder="$"
          defaultValue={actionData?.fields?.amount}
          aria-invalid={
            Boolean(actionData?.fieldErrors?.amount) ||
            undefined
          }
          aria-errormessage={
            actionData?.fieldErrors?.amount
              ? "concept-error"
              : undefined
          }
        />
        
        <span>Category:</span>
        <select
          name="category"
          className="mb-4 px-2 border border-gray-400 rounded-md h-9"
          defaultValue={actionData?.fields?.category}
          aria-invalid={
            Boolean(actionData?.fieldErrors?.category) ||
            undefined
          }
          aria-errormessage={
            actionData?.fieldErrors?.category
              ? "concept-error"
              : undefined
          }
        >
          {categories.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
        
        {actionData?.formError ? (
          <p
            className="form-validation-error"
            role="alert"
          >
            {actionData.formError}
          </p>
        ) : null}
        <button
          type="submit"
          className="flex items-center justify-center mt-4 self-center rounded
            w-4/5 h-9 bg-slate-800 text-white"
        >
          Add
        </button>
      </Form>
    </div>
  )
}