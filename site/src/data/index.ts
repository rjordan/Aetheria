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
 * - Automatic caching to prevent repeated requests
 * - Full TypeScript support for all data structures
 * - Easy migration between static files and APIs
 *
 * Usage:
 *   const magicData = await fetchMagicData()    // GET ${DATA_ENDPOINT}/magic.json
 *   const classData = await fetchClassesData()  // GET ${DATA_ENDPOINT}/classes.json
 */

// Data types for better type safety

export interface MagicSchoolData {
  name: string,
  description: string,
  focus: string[],
  regulation: string,
  opposing_element: string
}

export interface MagicData {
  magic: {
    schools: Record<string, MagicSchoolData>
    spells: Record<string, any>
  }
}

export interface ClassesData {
  classes: {
    primary: Record<string, any>
    specialized: Record<string, any>
  }
}

export interface EquipmentData {
  equipment: Record<string, any>
}

export interface OrganizationsData {
  organizations: Record<string, any>
}

export interface CreaturesData {
  creatures: Record<string, any>
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

// Private cache to avoid repeated loads
const dataCache = new Map<string, any>()

// Generic data loader - works with local files or remote APIs
async function loadJsonData<T>(filename: string): Promise<T> {
  // Check cache first
  if (dataCache.has(filename)) {
    return dataCache.get(filename)
  }

  try {
    // Fetch from configurable endpoint
    const response = await fetch(`${DATA_ENDPOINT}/${filename}.json`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Cache the result
    dataCache.set(filename, data)
    return data as T
  } catch (error) {
    console.error(`Failed to load ${filename}.json from ${DATA_ENDPOINT}:`, error)
    throw new Error(`Failed to load data: ${filename}`)
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

export async function fetchCreaturesData(): Promise<CreaturesData> {
  return loadJsonData<CreaturesData>('creatures')
}

export async function fetchSiteData(): Promise<SiteData> {
  return loadJsonData<SiteData>('site')
}

// Helper function to fetch all data at once if needed
export async function fetchAllData() {
  const [magic, classes, equipment, organizations, creatures, site] = await Promise.all([
    fetchMagicData(),
    fetchClassesData(),
    fetchEquipmentData(),
    fetchOrganizationsData(),
    fetchCreaturesData(),
    fetchSiteData(),
  ])

  return {
    magic,
    classes,
    equipment,
    organizations,
    creatures,
    site,
  }
}

// Configuration helpers
export function getDataEndpoint(): string {
  return DATA_ENDPOINT
}

export function clearDataCache(): void {
  dataCache.clear()
}

/*
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
