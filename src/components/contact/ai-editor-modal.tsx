"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TextEditorOperation } from "@/lib/text-editor/schemas";
import {
  Briefcase,
  Check,
  FileText,
  Loader2,
  Maximize2,
  Minimize2,
  Smile,
  Sparkles,
  Type,
  Wand2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AIEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  onApply: (editedText: string) => void;
}

type OperationButton = {
  operation: TextEditorOperation;
  label: string;
  icon: React.ElementType;
  description: string;
};

const OPERATION_BUTTONS: OperationButton[] = [
  {
    operation: "fix_grammar",
    label: "Proofread",
    icon: Check,
    description: "Fix grammar",
  },
  {
    operation: "shorten",
    label: "Shorten",
    icon: Minimize2,
    description: "More concise",
  },
  {
    operation: "lengthen",
    label: "Lengthen",
    icon: Maximize2,
    description: "Add detail",
  },
  {
    operation: "friendly",
    label: "Friendly",
    icon: Smile,
    description: "Conversational",
  },
  {
    operation: "professional",
    label: "Professional",
    icon: Briefcase,
    description: "Business tone",
  },
  {
    operation: "concise",
    label: "Concise",
    icon: FileText,
    description: "Ultra-brief",
  },
];

export function AIEditorModal({
  isOpen,
  onClose,
  originalText,
  onApply,
}: AIEditorModalProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editedText, setEditedText] = useState<string | null>(null);

  // Reset state when modal closes
  const handleClose = () => {
    setCustomPrompt("");
    setEditedText(null);
    setIsLoading(false);
    onClose();
  };

  // Call AI Editor API
  const handleEdit = async (
    operation: TextEditorOperation,
    prompt?: string
  ) => {
    setIsLoading(true);
    setEditedText(null);

    try {
      const response = await fetch("/api/text-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: originalText,
          operation,
          ...(operation === "custom" && prompt ? { customPrompt: prompt } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to edit text");
      }

      setEditedText(data.data.edited);
      toast.success("Text edited successfully");
    } catch (error) {
      console.error("AI Editor Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to edit text"
      );
      setEditedText(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle custom prompt submission
  const handleCustomEdit = () => {
    if (!customPrompt.trim()) {
      toast.error("Please describe what you want to change");
      return;
    }
    handleEdit("custom", customPrompt);
  };

  // Apply edited text
  const handleApplyChanges = () => {
    if (editedText) {
      onApply(editedText);
      toast.success("Changes applied");
      handleClose();
    }
  };

  // Revert to original
  const handleRevert = () => {
    setEditedText(null);
    toast.info("Reverted to original");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            AI Editor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Custom Prompt Input */}
          <div className="space-y-2">
            <label htmlFor="custom-prompt" className="text-sm text-text-2">
              Describe your change (optional)
            </label>
            <div className="flex gap-2">
              <Input
                id="custom-prompt"
                placeholder="e.g., Make it more enthusiastic..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCustomEdit();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleCustomEdit}
                disabled={isLoading || !customPrompt.trim()}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Compose
              </Button>
            </div>
          </div>

          {/* Operation Buttons Grid */}
          <div className="space-y-2">
            <p className="text-sm text-text-2">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {OPERATION_BUTTONS.map(
                ({ operation, label, icon: Icon, description }) => (
                  <Button
                    key={operation}
                    type="button"
                    variant="outline"
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => handleEdit(operation)}
                    disabled={isLoading}
                  >
                    <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-xs text-text-3">{description}</div>
                    </div>
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
              <span className="ml-3 text-sm text-text-2">
                Editing your text...
              </span>
            </div>
          )}

          {/* Diff View */}
          {editedText && !isLoading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text-1">
                  Review Changes
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRevert}
                >
                  <Type className="w-4 h-4 mr-2" />
                  Revert
                </Button>
              </div>

              {/* Original Text */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-text-3">Original</p>
                <div className="p-3 rounded-lg bg-surf-1 border border-border-line max-h-24 overflow-y-auto">
                  <p className="text-sm text-text-2 whitespace-pre-wrap">
                    {originalText}
                  </p>
                </div>
              </div>

              {/* Edited Text */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-brand-primary">Edited</p>
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={10}
                  className="resize-none"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleApplyChanges}
            disabled={!editedText || isLoading}
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
