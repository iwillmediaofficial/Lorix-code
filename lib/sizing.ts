export type Appliance = { id: string; label: string; watts: number; duty: number; defaultQty: number };

/** Typical Indian household loads. duty = share of backup time the appliance actually draws power. */
export const appliances: Appliance[] = [
  { id: 'led', label: 'LED bulbs', watts: 10, duty: 1, defaultQty: 6 },
  { id: 'tube', label: 'LED tube lights', watts: 20, duty: 1, defaultQty: 2 },
  { id: 'fan', label: 'Ceiling fans', watts: 75, duty: 1, defaultQty: 3 },
  { id: 'tv', label: 'Television', watts: 100, duty: 0.6, defaultQty: 1 },
  { id: 'router', label: 'Wi-Fi router', watts: 15, duty: 1, defaultQty: 1 },
  { id: 'fridge', label: 'Refrigerator', watts: 200, duty: 0.4, defaultQty: 1 },
  { id: 'laptop', label: 'Laptop or desktop', watts: 100, duty: 0.7, defaultQty: 0 },
  { id: 'washer', label: 'Washing machine', watts: 500, duty: 0.25, defaultQty: 0 },
  { id: 'pump', label: 'Water pump (1 HP)', watts: 750, duty: 0.15, defaultQty: 0 },
  { id: 'ac', label: 'Air conditioner (1.5 ton)', watts: 1500, duty: 0.7, defaultQty: 0 },
];

export const inverterSizesKw = [3, 5, 10] as const;
export const batteryOptions = [
  { label: '5 kWh', kwh: 5.12 },
  { label: '10 kWh', kwh: 10.24 },
  { label: '16 kWh', kwh: 16.08 },
] as const;

const USABLE = 0.9; // depth of discharge used for sizing (rated 95%, kept conservative)
const EFFICIENCY = 0.93; // battery to AC conversion
const HEADROOM = 1.25; // inverter margin over running load (motor starts, future loads)

export type SizingResult = {
  runningW: number;
  energyKWh: number;
  inverterKw: number | null;
  battery: { label: string; count: number; totalKWh: number } | null;
};

export function sizeSystem(qty: Record<string, number>, backupHours: number): SizingResult {
  let runningW = 0;
  let energyWh = 0;
  for (const a of appliances) {
    const n = Math.max(0, Math.floor(qty[a.id] ?? 0));
    runningW += a.watts * n;
    energyWh += a.watts * n * a.duty * backupHours;
  }
  const energyKWh = Math.round((energyWh / 1000) * 100) / 100;
  if (runningW === 0) return { runningW, energyKWh: 0, inverterKw: null, battery: null };

  const inverterKw = inverterSizesKw.find((k) => k * 1000 >= runningW * HEADROOM) ?? null;

  const needed = energyWh / 1000 / (USABLE * EFFICIENCY);
  const single = batteryOptions.find((b) => b.kwh >= needed);
  const battery = single
    ? { label: single.label, count: 1, totalKWh: single.kwh }
    : (() => {
        const big = batteryOptions[batteryOptions.length - 1];
        const count = Math.ceil(needed / big.kwh);
        return { label: big.label, count, totalKWh: Math.round(big.kwh * count * 100) / 100 };
      })();

  return { runningW, energyKWh, inverterKw, battery };
}
