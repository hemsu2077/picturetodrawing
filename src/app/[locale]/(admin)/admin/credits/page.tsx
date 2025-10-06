"use client";

import { TableColumn } from "@/types/blocks/table";
import TableSlot from "@/components/dashboard/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import moment from "moment";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import AddCreditModal from "./add-credit-modal";

export default function CreditsPage() {
  const [credits, setCredits] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCredits = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/credits");
      const result = await response.json();
      setCredits(result.data?.credits || []);
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  const columns: TableColumn[] = [
    { name: "trans_no", title: "Trans No" },
    { name: "user_uuid", title: "User UUID" },
    {
      name: "credits",
      title: "Credits",
      callback: (row) => (
        <span className="text-green-600 font-medium">
          +{row.credits}
        </span>
      ),
    },
    {
      name: "expired_at",
      title: "Expired At",
      callback: (row) =>
        row.expired_at
          ? moment(row.expired_at).format("YYYY-MM-DD HH:mm:ss")
          : "-",
    },
    {
      name: "created_at",
      title: "Created At",
      callback: (row) => moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  const table: TableSlotType = {
    title: "Credits Management",
    columns,
    data: credits,
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="w-full px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium">Credits Management</h1>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Icon name="RiAddLine" className="w-4 h-4 mr-1" />
          Add Credit
        </Button>
      </div>
      <TableSlot {...table} title="" />
      <AddCreditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchCredits();
        }}
      />
    </div>
  );
}
