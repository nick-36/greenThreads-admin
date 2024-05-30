import React from "react";
import ServerPageWrapper from "../serverPageWrapper";
import TransactionList from "@/components/shared/Listing/TransactionList";

const page = () => {
  const data = [
    {
      id: "728ed52f",
      name: "Noah Williams",
      type: "Sale",
      status: "pending",
      email: "m@example.com",
      amount: 100,
      date: "2023-06-23",
    },
    {
      id: "728ed52f",
      name: "Noah Williams",
      type: "Sale",
      status: "pending",
      email: "m@example.com",
      amount: 100,
      date: "2023-06-23",
    },
    {
      id: "728ed52f",
      name: "Noah Williams",
      type: "Refund",
      status: "pending",
      email: "m@example.com",
      amount: 1100,
      date: "2023-06-23",
    },
    {
      id: "728ed52f",
      name: "Noah Williams",
      type: "Sale",
      status: "pending",
      email: "olivia@example.com",
      amount: 200,
      date: "2023-06-23",
    },
    {
      id: "728ed52f",
      name: "Noah Williams",
      type: "Sale",
      status: "Declined",
      email: "m@example.com",
      amount: 200,
      date: "2023-06-23",
    },
    {
      id: "728ed52f",
      name: "Noah Williams",
      type: "Sale",
      status: "Refund",
      email: "m@example.com",
      amount: 200,
      date: "2023-06-23",
    },
    {
      id: "728ed52f",
      name: "Noah Williams",
      type: "Sale",
      status: "Fulfilled",
      email: "m@example.com",
      amount: 200,
      date: "2023-06-23",
    },
  ];

  return (
    <ServerPageWrapper headerProps={{ headerTitle: "Revenue" }}>
      <TransactionList />
    </ServerPageWrapper>
  );
};

export default page;
