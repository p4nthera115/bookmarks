import { ReactElement } from "react";

export type CardType = {
  id: number;
  name: string
  info: ReactElement
  colorVariations: ColorVariant[]
  foil: {
    front: string
    back: string
  }
  normalMap: {
    front: string
    back: string
  }
  link: string
  inStock: boolean
  isFlipped: boolean
  selectedVariantIndex: number;
}

type ColorVariant = {
  colorName: string
  cardColor: string
  bgColor: string
  foilColor: "gold" | "silver"
  illustration: {
    front: string
    back: string
  }
}