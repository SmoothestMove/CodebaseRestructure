import type { CustomField } from "../lib/types"

interface CustomFieldCreatorProps {
  onCreateField: (field: CustomField) => void
  buttonText?: string
}

export function CustomFieldCreator({ onCreateField, buttonText = "Add New Field" }: CustomFieldCreatorProps) {}
