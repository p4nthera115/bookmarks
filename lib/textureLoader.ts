import * as THREE from "three"
import { RGBELoader } from "three/examples/jsm/Addons.js"

export interface LoadingProgress {
  loaded: number
  total: number
  progress: number
}

type ProgressCallback = (progress: LoadingProgress) => void

// Singleton texture cache to avoid reloading
const textureCache = new Map<string, THREE.Texture>()
const hdrCache = new Map<string, THREE.DataTexture>()
const loadingPromises = new Map<
  string,
  Promise<THREE.Texture | THREE.DataTexture>
>()

// Create loaders
const textureLoader = new THREE.TextureLoader()
const rgbeLoader = new RGBELoader()

/**
 * Load a single texture with caching
 */
export function loadTexture(url: string): Promise<THREE.Texture> {
  // Return cached texture if available
  if (textureCache.has(url)) {
    return Promise.resolve(textureCache.get(url)!)
  }

  // Return existing loading promise if already loading
  if (loadingPromises.has(url)) {
    return loadingPromises.get(url) as Promise<THREE.Texture>
  }

  const promise = new Promise<THREE.Texture>((resolve, reject) => {
    textureLoader.load(
      url,
      (texture) => {
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.anisotropy = 16
        texture.generateMipmaps = true
        textureCache.set(url, texture)
        loadingPromises.delete(url)
        resolve(texture)
      },
      undefined,
      (error) => {
        loadingPromises.delete(url)
        reject(error)
      }
    )
  })

  loadingPromises.set(url, promise)
  return promise
}

/**
 * Load an HDR texture with caching
 */
export function loadHDR(url: string): Promise<THREE.DataTexture> {
  // Return cached HDR if available
  if (hdrCache.has(url)) {
    return Promise.resolve(hdrCache.get(url)!)
  }

  // Return existing loading promise if already loading
  if (loadingPromises.has(url)) {
    return loadingPromises.get(url) as Promise<THREE.DataTexture>
  }

  const promise = new Promise<THREE.DataTexture>((resolve, reject) => {
    rgbeLoader.load(
      url,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        hdrCache.set(url, texture)
        loadingPromises.delete(url)
        resolve(texture)
      },
      undefined,
      (error) => {
        loadingPromises.delete(url)
        reject(error)
      }
    )
  })

  loadingPromises.set(url, promise)
  return promise
}

/**
 * Get a cached texture synchronously (returns null if not loaded)
 */
export function getCachedTexture(url: string): THREE.Texture | null {
  return textureCache.get(url) ?? null
}

/**
 * Get a cached HDR texture synchronously (returns null if not loaded)
 */
export function getCachedHDR(url: string): THREE.DataTexture | null {
  return hdrCache.get(url) ?? null
}

/**
 * Check if a texture is already cached
 */
export function isTextureCached(url: string): boolean {
  return textureCache.has(url) || hdrCache.has(url)
}

/**
 * Preload multiple textures with progress tracking
 */
export async function preloadTextures(
  urls: string[],
  onProgress?: ProgressCallback
): Promise<void> {
  // Filter out already cached textures and empty strings
  const urlsToLoad = urls.filter((url) => url && !isTextureCached(url))

  if (urlsToLoad.length === 0) {
    onProgress?.({ loaded: urls.length, total: urls.length, progress: 100 })
    return
  }

  const total = urlsToLoad.length
  let loaded = 0

  const reportProgress = () => {
    loaded++
    const progress = Math.round((loaded / total) * 100)
    onProgress?.({ loaded, total, progress })
  }

  await Promise.all(
    urlsToLoad.map(async (url) => {
      try {
        if (url.endsWith(".hdr")) {
          await loadHDR(url)
        } else {
          await loadTexture(url)
        }
        reportProgress()
      } catch (error) {
        console.warn(`Failed to load texture: ${url}`, error)
        reportProgress() // Still count as "loaded" to not block progress
      }
    })
  )
}

/**
 * Get all texture URLs needed for the initial load (HDRs + first few cards)
 */
export function getEssentialTextureUrls(
  cardArr: CardData[],
  cardsToPreload = 3
): string[] {
  const urls: string[] = []

  // HDR environment maps (essential for foil materials)
  urls.push("/pretville_cinema_1k.hdr")
  urls.push("/st_peters_square_night_1k.hdr")

  // First N cards' textures (only the selected variant)
  const cardsToLoad = cardArr.slice(0, cardsToPreload)

  for (const card of cardsToLoad) {
    const variant = card.colorVariations[card.selectedVariantIndex]

    // Add illustration textures
    if (variant.illustration.front) urls.push(variant.illustration.front)
    if (variant.illustration.back) urls.push(variant.illustration.back)

    // Add foil textures
    if (card.foil.front) urls.push(card.foil.front)
    if (card.foil.back) urls.push(card.foil.back)

    // Add normal map textures
    if (card.normalMap.front) urls.push(card.normalMap.front)
    if (card.normalMap.back) urls.push(card.normalMap.back)
  }

  // Remove duplicates
  return Array.from(new Set(urls))
}

/**
 * Get texture URLs for a specific card
 */
export function getCardTextureUrls(card: CardData): string[] {
  const urls: string[] = []
  const variant = card.colorVariations[card.selectedVariantIndex]

  if (variant.illustration.front) urls.push(variant.illustration.front)
  if (variant.illustration.back) urls.push(variant.illustration.back)
  if (card.foil.front) urls.push(card.foil.front)
  if (card.foil.back) urls.push(card.foil.back)
  if (card.normalMap.front) urls.push(card.normalMap.front)
  if (card.normalMap.back) urls.push(card.normalMap.back)

  return urls.filter(Boolean)
}

// Type for card data (matches CardType from definitions)
interface CardData {
  colorVariations: Array<{
    illustration: { front: string; back: string }
  }>
  foil: { front: string; back: string }
  normalMap: { front: string; back: string }
  selectedVariantIndex: number
}
