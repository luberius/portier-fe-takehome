import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VersionTag } from "@/components/version-tag"

type MergeConflictsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  merging: boolean
  applicationName: string
  version: string
  localCount: number
  externalCount: number
  onConfirm: () => Promise<void>
}

export function MergeConflictsDialog({
  open,
  onOpenChange,
  merging,
  applicationName,
  version,
  localCount,
  externalCount,
  onConfirm,
}: MergeConflictsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>Merge resolved conflicts</DialogTitle>
          <DialogDescription>
            This will store {externalCount} external and {localCount} local
            conflict decision{externalCount + localCount === 1 ? "" : "s"} for{" "}
            {applicationName} as a new history entry for{" "}
            <VersionTag version={version} className="mx-1 align-middle" />.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={merging}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={merging}>
            {merging ? "Merging..." : "Merge conflicts"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
