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
enum RankValue {
  F = 'F',
  E = 'E',
  D = 'D',
  C = 'C',
  B = 'B',
  A = 'A',
  S = 'S',
  SS = 'SS',
  SSS = 'SSS'
}

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
  tags?: string[]
}

export interface CharacterData extends BaseEntity {
  type: 'Character'
  class?: string
  race?: string
}

export interface CreatureData extends BaseEntity {
  type: 'Creature'
  threat_level?: string
}

export interface CharactersData {
  characters: Record<string, CharacterData>
}

export interface CreaturesData {
  creatures: Record<string, CreatureData>
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
