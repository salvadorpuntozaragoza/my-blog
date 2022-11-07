import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

import type { Bills, Earnings } from "@prisma/client";
import { db } from "~/utils/db.server";
import moment from "moment";

type LoaderData = {
  bills: Array<Bills>;
  earnings: Array<Earnings>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json({
    bills: await db.bills.findMany({ where: {
      updatedAt: {
        gte: moment().startOf('month').format(),
        lte: moment().endOf('month').format(),
      },
    }}),
    earnings: await db.earnings.findMany({
      where: {
        updatedAt: {
          gte: moment().startOf('month').format(),
          lte: moment().endOf('month').format(),
        },
      },
    }),
  })
}

export default function Index() {
  const loaderData = useLoaderData<LoaderData>();

  return (
    <div className="flex w-100 h-screen items-center justify-center bg-slate-700">
      <div className="flex flex-col w-64 bg-zinc-200 mr-9 py-3 px-2 rounded-md">
        <span>Earnings</span>

        {loaderData.earnings.map((earning) => (
          <span key={earning.id}>
            {earning.concept}
          </span>
        ))}

        <button
          className="flex items-center justify-center mt-4 self-center rounded
            w-4/5 h-9 bg-slate-800 text-white"
        >
          <Link className="flex justify-center items-center w-full h-full" to="/addearning">
            Add +
          </Link>
        </button>
      </div>

      <div className="flex flex-col w-64 bg-zinc-200 py-3 px-2 rounded-md">
        <span>Bills</span>

        {loaderData.bills.map((bill) => (
          <span key={bill.id}>
            {bill.concept}
          </span>
        ))}

        <button
          className="flex items-center justify-center mt-4 self-center rounded
            w-4/5 h-9 bg-slate-800 text-white"
        >
          <Link className="flex justify-center items-center w-full h-full" to="/addbill">
            Add +
          </Link>
        </button>
      </div>
    </div>
  );
}
