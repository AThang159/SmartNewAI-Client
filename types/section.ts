import { ChildSection } from "./child-section"

export interface Section {
  label: string
  href?: string
  childSection?: ChildSection[]
}