// Provider registry — resolves provider code to a MotorcycleDataProvider instance.
// New authorised providers only need to be registered here; the sync engine,
// API routes and admin dashboard are provider-agnostic.

import type { MotorcycleDataProvider } from './types';
import { MockBikeProvider } from './providers/mock.provider';
import { BikeWaleProvider } from './providers/bikewale.provider';

const registry = new Map<string, MotorcycleDataProvider>();

/** Providers shipped with the platform. */
const BUILT_IN: MotorcycleDataProvider[] = [
  new BikeWaleProvider(),
  new MockBikeProvider(),
];

function seedDefaultRegistry() {
  if (registry.size > 0) return;
  for (const provider of BUILT_IN) {
    registry.set(provider.code, provider);
  }
}

seedDefaultRegistry();

/** Register (or replace) a provider implementation. */
export function registerProvider(provider: MotorcycleDataProvider): void {
  registry.set(provider.code, provider);
}

/** Resolve a provider by code, or null when unknown. */
export function getProvider(code: string): MotorcycleDataProvider | null {
  seedDefaultRegistry();
  return registry.get(code) ?? null;
}

/** All registered providers. */
export function listProviders(): MotorcycleDataProvider[] {
  seedDefaultRegistry();
  return Array.from(registry.values());
}

/** Restore the built-in registry. Test helper. */
export function resetProviders(): void {
  registry.clear();
  for (const provider of BUILT_IN) {
    registry.set(provider.code, provider);
  }
}
