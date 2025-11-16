/**
 * Generic data loading interface for Aetheria site
 *
 * This module provides a unified interface for loading data that can work with:
 * - Local JSON files (development/static)
 * - Remote APIs (production/dynamic)
 * - Any HTTP endpoint returning JSON
 *
 * Configuration:
 * - VITE_DATA_ENDPOINT: Override the data endpoint URL (defaults to '/data')
 *
 * Features:
 * - Environment-configurable endpoint
 * - Service worker caching for offline support
 * - Full TypeScript support for all data structures
 * - Easy migration between static files and APIs
 * - Offline functionality with cached data
 *
 * Usage:
 *   const magicData = await fetchMagicData()    // GET ${DATA_ENDPOINT}/magic.json
 *   const classData = await fetchClassesData()  // GET ${DATA_ENDPOINT}/classes.json
 */

// Data types for better type safety

enum RegionType {
  Kingdom = 'Kingdom',
  State = 'State',
  City = 'City',
  Tribe = 'Tribe',
  Empire = 'Empire',
  Republic = 'Republic',
  Theocracy = 'Theocracy',
  Federation = 'Federation',
  Clan = 'Clan',
  Duchy = 'Duchy',
  Barony = 'Barony',
  Province = 'Province',
  Territory = 'Territory'
}

export interface RegionData {
  name: string,
  type: RegionType,
  description: string,
  leader?: string,
  system?: string,
  population?: string,
  climate?: string,
  races?: { [key: string]: number }
  regions?: { [key: string]: RegionData }
}

export interface RegionListData {
  regions: Record<string, RegionData>
}

export interface SkillData {
  name: string,
  trainingRequired: boolean,
  description: string,
}

export interface SkillListData {
  skills: Record<string, SkillData>
}

export interface MagicSchoolData {
  name: string,
  description: string,
  focus: string[],
  regulation: string,
  opposing_element: string
}

export interface MagicSpellData {
  name: string,
  min_rank: string,
  description: string,
  specialistOnly?: boolean
}

export interface MagicData {
  magic: {
    schools: Record<string, MagicSchoolData>
    spells: Record<string, Record<string, MagicSpellData>>
  }
}

export interface ClassesData {
  classes: {
    core: Record<string, any>
    specializations: Record<string, any>
  }
}

export interface EquipmentItemData {
  name: string
  type: string[]
  rarity?: string // For general items
  slot?: string // For general items
  function?: string // For general items
  damageType?: string[] // For Weapons
  description: string
  size?: string // For Shields
  protection?: Record<string, string> // For Armor & Shields
  alternateNames?: string[]
}

export interface EquipmentData {
  equipment: {
    weapons: Record<string, EquipmentItemData>
    armor_and_shields: Record<string, EquipmentItemData>
    miscellaneous: Record<string, EquipmentItemData>
  }
}

export interface OrganizationsData {
  organizations: Record<string, any>
}

// New entity data structures for character and creature cards

// Flexible rank system that supports:
// - Single values: "A"
// - Ranges: "C-A"
// - Percentage distributions: {"B": 90, "A": 10}
export type RankValue =
  | string  // Single rank like "A" or range like "C-A"
  | Record<string, number>  // Percentage distribution like {"B": 90, "A": 10}

export interface AlignmentFacet {
  value: string
  modifier?: string
  guidance?: string
}

export interface BaseEntity {
  name: string
  type: 'Character' | 'Creature'
  threatLevel: RankValue
  description: string
  fullDescription?: string
  imageUrl?: string | null
  alignment: {
    ideology: AlignmentFacet
    morality: AlignmentFacet
    methodology: AlignmentFacet
    temperament: AlignmentFacet
  }
  attributes: {
    strength: RankValue
    agility: RankValue
    constitution: RankValue
    intelligence: RankValue
    willpower: RankValue
    charisma: RankValue
  }
  skills: Record<string, RankValue>
  powers?: Record<string, string>
  tags?: string[]
}

export interface CharacterData extends BaseEntity {
  type: 'Character'
  class?: string
  race?: string
}

// Creature category (group) structure - has shared traits but no individual stats
export interface CreatureCategory {
  name: string
  description: string
  powers?: Record<string, string>  // Category-level powers inherited by all subtypes
  tags?: string[]  // Category-level tags inherited by all subtypes
  subtypes?: Record<string, CreatureData>
}

// Individual creature subtype - extends BaseEntity
export interface CreatureData extends BaseEntity {
  type: 'Creature'
}

export interface CharactersData {
  characters: Record<string, CharacterData>
}

// Update the main creatures data structure
export interface CreaturesData {
  _metadata?: {
    description: string
    version: string
    attribute_scaling_rules: {
      description: string
      example: string
      correlation: string
    }
    rank_system: string
    range_notation: string
  }
  creatures: Record<string, CreatureCategory>
}

export interface DeityData {
  name: string
  domains: string[]
  alignment: string
  description: string
}

export interface ReligionData {
  deities: DeityData[]
}

export interface SiteData {
  site: {
    title: string
    description: string
    base_url: string
  }
  navigation: Array<{
    name: string
    icon: string
    url: string
  }>
  data_types: Array<{
    name: string
    display: string
    icon: string
    description: string
  }>
  breadcrumbs: Record<string, any>
}

// Configurable data endpoint - can be overridden via environment variable
const DATA_ENDPOINT = import.meta.env.VITE_DATA_ENDPOINT || '/data'

// Generic data loader - works with local files or remote APIs
// Caching is now handled by the service worker for better offline support
async function loadJsonData<T>(filename: string): Promise<T> {
  try {
    // Fetch from configurable endpoint
    // Service worker will handle caching and offline functionality
    const response = await fetch(`${DATA_ENDPOINT}/${filename}.json`, {
      // Add cache-control headers for better service worker handling
      headers: {
        'Cache-Control': 'max-age=300' // 5 minutes for data freshness
      }
    })

    if (!response.ok) {
      // Check if this is an offline error from service worker
      if (response.status === 503) {
        const errorData = await response.json().catch(() => ({}))
        if (errorData.offline) {
          throw new OfflineError(`Data for ${filename} is not available offline`)
        }
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    console.error(`Failed to load ${filename}.json from ${DATA_ENDPOINT}:`, error)

    // Provide better error messages for offline scenarios
    if (error instanceof OfflineError) {
      throw error
    }

    // Check if we're offline
    if (!navigator.onLine) {
      throw new OfflineError(`Cannot load ${filename} while offline`)
    }

    throw new Error(`Failed to load data: ${filename}`)
  }
}

// Custom error for offline scenarios
export class OfflineError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OfflineError'
  }
}

// Public API functions for data access
export async function fetchMagicData(): Promise<MagicData> {
  return loadJsonData<MagicData>('magic')
}

export async function fetchClassesData(): Promise<ClassesData> {
  return loadJsonData<ClassesData>('classes')
}

export async function fetchEquipmentData(): Promise<EquipmentData> {
  return loadJsonData<EquipmentData>('equipment')
}

export async function fetchOrganizationsData(): Promise<OrganizationsData> {
  return loadJsonData<OrganizationsData>('organizations')
}

export async function fetchSiteData(): Promise<SiteData> {
  return loadJsonData<SiteData>('site')
}

export async function fetchSkillsData(): Promise<SkillListData> {
  return loadJsonData<SkillListData>('skills')
}

export async function fetchCharactersData(): Promise<CharactersData> {
  return loadJsonData<CharactersData>('characters')
}

export async function fetchCreaturesData(): Promise<CreaturesData> {
  return loadJsonData<CreaturesData>('creatures')
}

export async function fetchRegionsData(): Promise<RegionListData> {
  return loadJsonData<RegionListData>('regions')
}

export async function fetchReligionData(): Promise<ReligionData> {
  return loadJsonData<ReligionData>('religion')
}

// Helper function to merge category-level powers and tags with creature-level ones
export function mergeCategoryAndCreatureData(category: CreatureCategory, creature: CreatureData): CreatureData {
  if (!category || !creature) return creature

  const mergedCreature = { ...creature }

  // Merge powers: category powers + creature powers, with creature taking precedence
  if (category.powers || creature.powers) {
    mergedCreature.powers = {
      ...(category.powers || {}),
      ...(creature.powers || {})
    }
  }

  // Merge tags: unique combination of category tags + creature tags
  if (category.tags || creature.tags) {
    const categoryTags = category.tags || []
    const creatureTags = creature.tags || []
    // Remove duplicates and combine
    mergedCreature.tags = [...new Set([...categoryTags, ...creatureTags])]
  }

  return mergedCreature
}

// Configuration helpers
export function getDataEndpoint(): string {
  return DATA_ENDPOINT
}

// Clear cache via PWA plugin (handled automatically by Workbox)
export async function clearDataCache(filename?: string): Promise<void> {
  // With vite-plugin-pwa, cache clearing is handled automatically
  // by Workbox based on the configuration. Manual clearing not typically needed.
  console.log('[Data] Cache clearing handled automatically by PWA plugin')

  // If manual clearing is needed, it would require accessing the Workbox instance
  // For now, we'll log that this is handled by the plugin
  if (filename) {
    console.log(`[Data] Would clear cache for: ${filename}`)
  } else {
    console.log('[Data] Would clear all data cache')
  }
}

// Helper function to resolve image URLs with the correct base path
export function resolveImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null

  // If it's already an absolute URL (http/https), return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  // Get the base path from Vite's import.meta.env
  const basePath = import.meta.env.BASE_URL || '/'

  // Remove leading slash from imageUrl if present, then combine with base path
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl

  // Ensure base path ends with slash
  const cleanBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`

  return `${cleanBasePath}${cleanImageUrl}`
}

// Check if we're currently offline
export function isOffline(): boolean {
  return !navigator.onLine
}

// Get offline status and PWA information
export async function getOfflineStatus() {
  const { pwaManager } = await import('../sw-manager')

  return {
    online: navigator.onLine,
    serviceWorkerActive: !!navigator.serviceWorker.controller,
    updateAvailable: pwaManager.updateAvailable,
    offlineReady: pwaManager.offlineReady,
    isPWA: window.matchMedia('(display-mode: standalone)').matches
  }
}/*
ENVIRONMENT CONFIGURATION:

Local development (default):
VITE_DATA_ENDPOINT=/data (serves from public/data/)

Remote API:
VITE_DATA_ENDPOINT=https://api.example.com/aetheria/data

Custom endpoint:
VITE_DATA_ENDPOINT=http://localhost:3000/api/v1/data

SOLID.JS INTEGRATION EXAMPLE:

import { createResource } from 'solid-js'
import { fetchMagicData } from '@data/index'

function MagicComponent() {
  const [magicData] = createResource(fetchMagicData)

  return (
    <div>
      <Show when={magicData()} fallback={<div>Loading...</div>}>
        {(data) => {
          const schools = Object.entries(data().magic.schools)
          return (
            <div>
              {schools.map(([key, school]) => (
                <div key={key}>{school.name}</div>
              ))}
            </div>
          )
        }}
      </Show>
    </div>
  )
}

Benefits:
- Environment-configurable data source
- Zero compile-time dependencies on data files
- Easy migration from static to dynamic
- Automatic caching and error handling
- Full TypeScript support
*/

// Utility functions for working with RankValue

/**
 * Check if a rank value is a percentage distribution
 */
export const isPercentageDistribution = (rank: RankValue): rank is Record<string, number> => {
  return typeof rank === 'object' && rank !== null && !Array.isArray(rank)
}

/**
 * Check if a rank value is a simple string (single value or range)
 */
export const isSimpleRank = (rank: RankValue): rank is string => {
  return typeof rank === 'string'
}

/**
 * Get percentage entries sorted by percentage (descending)
 */
export const getPercentageEntries = (rank: Record<string, number>) => {
  return Object.entries(rank)
    .map(([level, percent]) => ({
      level,
      percent: typeof percent === 'number' ? percent : parseFloat(String(percent).replace('%', ''))
    }))
    .sort((a, b) => b.percent - a.percent)
}

/**
 * Get the most common rank from a percentage distribution
 */
export const getMostCommonRank = (rank: RankValue): string => {
  if (isSimpleRank(rank)) return rank

  const entries = getPercentageEntries(rank)
  return entries.length > 0 ? entries[0].level : 'Unknown'
}

/**
 * Format a rank value for display (single line)
 */
export const formatRankForDisplay = (rank: RankValue): string => {
  if (isSimpleRank(rank)) return rank

  const entries = getPercentageEntries(rank)
  return entries.length > 0 ? `${entries[0].level} (${entries[0].percent}%)` : 'Unknown'
}

// Threat Level Interpolation System

/**
 * Rank order for interpolation (F = 0, E = 1, ..., SSS = 8)
 */
const RANK_ORDER = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS']

/**
 * Convert a rank string to numeric value for interpolation
 */
export const rankToNumber = (rank: string): number => {
  const index = RANK_ORDER.indexOf(rank.toUpperCase())
  return index >= 0 ? index : 0
}

/**
 * Convert numeric value back to rank string
 */
export const numberToRank = (num: number): string => {
  const index = Math.round(Math.max(0, Math.min(RANK_ORDER.length - 1, num)))
  return RANK_ORDER[index]
}

/**
 * Parse a rank string into min/max values
 * Examples: "A" → {min: 5, max: 5}, "C-A" → {min: 3, max: 5}
 */
export const parseRankRange = (rankStr: string): { min: number; max: number } => {
  if (rankStr.includes('-')) {
    const [minRank, maxRank] = rankStr.split('-').map(r => r.trim())
    return {
      min: rankToNumber(minRank),
      max: rankToNumber(maxRank)
    }
  }
  const value = rankToNumber(rankStr)
  return { min: value, max: value }
}

/**
 * Convert percentage distribution to effective range for interpolation
 * @param distribution Percentage distribution like {"B": 80, "A": 15, "S": 5}
 * @returns Range object with min/max ranks
 */
export const getEffectiveRangeFromDistribution = (distribution: Record<string, number>): { min: number; max: number } => {
  const ranks = Object.keys(distribution).map(rankToNumber).sort((a, b) => a - b)
  return {
    min: ranks[0],
    max: ranks[ranks.length - 1]
  }
}

/**
 * Interpolate an attribute based on threat level position
 * @param threatLevel The creature's threat level (e.g., "C-A")
 * @param attributeRange The attribute range (e.g., "B-S")
 * @param position Position within threat range (0.0 = min threat, 1.0 = max threat)
 * @returns Interpolated rank string
 */
export const interpolateAttributeByThreat = (
  threatLevel: RankValue,
  attributeRange: RankValue,
  position: number = 0.5
): string => {
  // Handle percentage distribution threat levels
  let threatRange: { min: number; max: number }

  if (isPercentageDistribution(threatLevel)) {
    threatRange = getEffectiveRangeFromDistribution(threatLevel)
  } else if (isSimpleRank(threatLevel)) {
    threatRange = parseRankRange(threatLevel)
  } else {
    return formatRankForDisplay(attributeRange)
  }

  // Attribute range must be a string for interpolation
  if (!isSimpleRank(attributeRange)) {
    return formatRankForDisplay(attributeRange)
  }

  const attrRange = parseRankRange(attributeRange)

  // If either is a single value, no interpolation needed
  if (threatRange.min === threatRange.max || attrRange.min === attrRange.max) {
    return formatRankForDisplay(attributeRange)
  }

  // Clamp position to [0, 1]
  const clampedPosition = Math.max(0, Math.min(1, position))

  // Interpolate within the attribute range
  const interpolatedValue = attrRange.min + (attrRange.max - attrRange.min) * clampedPosition

  return numberToRank(interpolatedValue)
}

/**
 * Get suggested attribute values for different threat positions
 * @param creature Creature with threat level and attribute ranges
 * @returns Object with low/mid/high attribute suggestions
 */
export interface ThreatAttributeVariants {
  low: Record<string, string>    // Attributes at minimum threat
  mid: Record<string, string>    // Attributes at middle threat
  high: Record<string, string>   // Attributes at maximum threat
}

export const getThreatAttributeVariants = (creature: BaseEntity): ThreatAttributeVariants => {
  const variants: ThreatAttributeVariants = {
    low: {},
    mid: {},
    high: {}
  }

  // Process each attribute
  Object.entries(creature.attributes).forEach(([attr, value]) => {
    variants.low[attr] = interpolateAttributeByThreat(creature.threatLevel, value, 0.0)
    variants.mid[attr] = interpolateAttributeByThreat(creature.threatLevel, value, 0.5)
    variants.high[attr] = interpolateAttributeByThreat(creature.threatLevel, value, 1.0)
  })

  return variants
}

/**
 * Generate AI guidance text explaining threat-based attribute scaling
 */
export const generateThreatScalingGuidance = (creature: BaseEntity): string => {
  let threatRange: { min: number; max: number }
  let threatDisplay: string

  if (isPercentageDistribution(creature.threatLevel)) {
    threatRange = getEffectiveRangeFromDistribution(creature.threatLevel)
    const ranks = Object.keys(creature.threatLevel).sort((a, b) => rankToNumber(a) - rankToNumber(b))
    threatDisplay = `${ranks[0]} to ${ranks[ranks.length - 1]}`
  } else if (isSimpleRank(creature.threatLevel)) {
    threatRange = parseRankRange(creature.threatLevel)
    threatDisplay = creature.threatLevel
  } else {
    return `${creature.name} has variable threat levels. Attribute values may vary accordingly.`
  }

  if (threatRange.min === threatRange.max) {
    return `${creature.name} has a fixed threat level of ${threatDisplay}.`
  }

  const variants = getThreatAttributeVariants(creature)
  const threatMin = numberToRank(threatRange.min)
  const threatMax = numberToRank(threatRange.max)

  let guidance = `${creature.name} varies in power from ${threatMin} to ${threatMax} threat level. `
  guidance += `Attributes scale accordingly:\n\n`

  Object.entries(creature.attributes).forEach(([attr, range]) => {
    if (isSimpleRank(range) && range.includes('-')) {
      guidance += `• **${attr.charAt(0).toUpperCase() + attr.slice(1)}**: `
      guidance += `${variants.low[attr]} (weak) → ${variants.mid[attr]} (typical) → ${variants.high[attr]} (strong)\n`
    }
  })

  return guidance
}
