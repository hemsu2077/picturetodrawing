"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCreditModal({
  isOpen,
  onClose,
  onSuccess,
}: AddCreditModalProps) {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [credits, setCredits] = useState("");
  const [validMonths, setValidMonths] = useState("12");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState<{
    uuid: string;
    email: string;
    nickname?: string;
  } | null>(null);

  const handleCheckUser = async () => {
    if (!userIdentifier.trim()) {
      setError("Please enter email or UUID");
      return;
    }

    setError("");
    setChecking(true);
    setUserInfo(null);

    try {
      const response = await fetch("/api/admin/credits/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIdentifier: userIdentifier.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "User not found");
      }

      setUserInfo(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInfo) {
      setError("Please check user first");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/credits/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIdentifier: userInfo.uuid,
          credits: parseInt(credits),
          validMonths: parseInt(validMonths),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add credit");
      }

      // Reset form
      setUserIdentifier("");
      setCredits("");
      setValidMonths("12");
      setUserInfo(null);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Credit to User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userIdentifier">User Email or UUID</Label>
            <div className="flex gap-2">
              <Input
                id="userIdentifier"
                placeholder="user@example.com or user-uuid"
                value={userIdentifier}
                onChange={(e) => {
                  setUserIdentifier(e.target.value);
                  setUserInfo(null);
                }}
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCheckUser}
                disabled={checking || !userIdentifier.trim()}
              >
                {checking ? "Checking..." : "Check"}
              </Button>
            </div>
            {userInfo && (
              <div className="text-sm bg-green-50 border border-green-200 p-3 rounded space-y-1">
                <div className="text-green-800 font-medium">✓ User Found</div>
                <div className="text-gray-700">
                  <span className="font-medium">Email:</span> {userInfo.email}
                </div>
                <div className="text-gray-700">
                  <span className="font-medium">UUID:</span> {userInfo.uuid}
                </div>
                {userInfo.nickname && (
                  <div className="text-gray-700">
                    <span className="font-medium">Name:</span> {userInfo.nickname}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="credits">Credits Amount</Label>
            <Input
              id="credits"
              type="number"
              min="1"
              placeholder="100"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validMonths">Valid Months</Label>
            <Input
              id="validMonths"
              type="number"
              min="1"
              placeholder="12"
              value={validMonths}
              onChange={(e) => setValidMonths(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !userInfo}>
              {loading ? "Adding..." : "Add Credit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
