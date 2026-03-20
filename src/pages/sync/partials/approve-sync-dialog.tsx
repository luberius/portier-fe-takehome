import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { HistoryItem } from "@/types"
import { VersionTag } from "@/components/version-tag"
import { ManualReviewPreview } from "./manual-review-preview"

type ApproveSyncDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  approving: boolean
  hasSelection: boolean
  selectedCount: number
  applicationName: string
  nextVersion: string
  selectedManualReviewCount: number
  uncheckedManualReviewItems: HistoryItem[]
  onApprove: () => Promise<void>
}

export function ApproveSyncDialog({
  open,
  onOpenChange,
  approving,
  hasSelection,
  selectedCount,
  applicationName,
  nextVersion,
  selectedManualReviewCount,
  uncheckedManualReviewItems,
  onApprove,
}: ApproveSyncDialogProps) {
  const uncheckedManualReviewCount = uncheckedManualReviewItems.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>Approve selected sync changes</DialogTitle>
          <DialogDescription>
            This will store {selectedCount} approved change
            {selectedCount === 1 ? "" : "s"} as a new sync history entry for{" "}
            {applicationName} and move this integration to{" "}
            <VersionTag version={nextVersion} className="mx-1 align-middle" />.
            {uncheckedManualReviewCount > 0
              ? ` ${uncheckedManualReviewCount} manual review change${uncheckedManualReviewCount === 1 ? "" : "s"} remain unchecked and will not be included.`
              : selectedManualReviewCount > 0
                ? ` This approval includes ${selectedManualReviewCount} manual review change${selectedManualReviewCount === 1 ? "" : "s"}.`
                : ""}
          </DialogDescription>
        </DialogHeader>
        <ManualReviewPreview items={uncheckedManualReviewItems} />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={approving}
          >
            Cancel
          </Button>
          <Button
            onClick={onApprove}
            disabled={!hasSelection || approving}
          >
            {approving ? "Approving..." : "Approve sync"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
