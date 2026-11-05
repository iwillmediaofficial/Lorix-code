import { describe, expect, it } from 'vitest';
import { sizeSystem } from '@/lib/sizing';

describe('sizeSystem', () => {
  it('returns nothing for an empty home', () => {
    expect(sizeSystem({}, 4)).toEqual({ runningW: 0, energyKWh: 0, inverterKw: null, battery: null });
  });

  it('sizes a typical 2BHK essential-load backup', () => {
    const r = sizeSystem({ led: 6, tube: 2, fan: 3, tv: 1, router: 1, fridge: 1 }, 4);
    expect(r.runningW).toBe(60 + 40 + 225 + 100 + 15 + 200);
    expect(r.inverterKw).toBe(3);
    expect(r.battery?.label).toBe('5 kWh');
    expect(r.battery?.count).toBe(1);
  });

  it('steps up the inverter when an AC is added', () => {
    const r = sizeSystem({ fan: 3, ac: 1, fridge: 1 }, 4);
    expect(r.inverterKw).toBe(3);
    const r2 = sizeSystem({ fan: 4, ac: 2, fridge: 1 }, 4);
    expect(r2.inverterKw).toBe(5);
  });

  it('uses multiple 16 kWh packs for very long backup', () => {
    const r = sizeSystem({ ac: 2, fridge: 1, fan: 4 }, 12);
    expect(r.battery?.label).toBe('16 kWh');
    expect(r.battery!.count).toBeGreaterThan(1);
  });

  it('flags loads above 10 kW for a custom design', () => {
    expect(sizeSystem({ ac: 6 }, 2).inverterKw).toBeNull();
  });

  it('ignores negative and fractional quantities', () => {
    expect(sizeSystem({ led: -3, fan: 1.7 }, 1).runningW).toBe(75);
  });
});
