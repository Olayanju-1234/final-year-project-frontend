import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface RequestViewingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPropertyId?: string;
  onSubmit: (data: { propertyId: string; requestedDate: string; requestedTime: string; notes?: string }) => Promise<void> | void;
  loading?: boolean;
}

export const RequestViewingModal = ({ open, onOpenChange, initialPropertyId = "", onSubmit, loading }: RequestViewingModalProps) => {
  const [propertyId, setPropertyId] = useState(initialPropertyId);
  const [requestedDate, setRequestedDate] = useState("");
  const [requestedTime, setRequestedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setPropertyId(initialPropertyId || "");
      setRequestedDate("");
      setRequestedTime("");
      setNotes("");
      setError("");
    }
  }, [open, initialPropertyId]);

  const handleSubmit = async () => {
    if (!propertyId || !requestedDate || !requestedTime) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    await onSubmit({ propertyId, requestedDate, requestedTime, notes });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Property Viewing</DialogTitle>
          <DialogDescription>Schedule a viewing for a property</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <Label htmlFor="propertyId">Property ID</Label>
            <Input
              id="propertyId"
              value={propertyId}
              onChange={e => setPropertyId(e.target.value)}
              placeholder="Enter property ID"
              disabled={!!initialPropertyId}
            />
          </div>
          <div>
            <Label htmlFor="requestedDate">Requested Date</Label>
            <Input
              id="requestedDate"
              type="date"
              value={requestedDate}
              onChange={e => setRequestedDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="requestedTime">Requested Time</Label>
            <Input
              id="requestedTime"
              value={requestedTime}
              onChange={e => setRequestedTime(e.target.value)}
              placeholder="e.g., 2:00 PM"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any additional notes"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Requesting..." : "Request Viewing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 