export type Spec = { label: string; values: string[] };
export type Product = {
  slug: 'lfp-battery' | 'hybrid-inverter' | 'sodium-ion-battery';
  name: string;
  short: string;
  tagline: string;
  range: string;
  image: string | null;
  status: 'available' | 'interest';
  /** Shown when specs are placeholders pending the final datasheet. */
  indicative?: boolean;
  models?: string[];
  specs?: Spec[];
};

export const lfpBattery: Product = {
  slug: 'lfp-battery',
  name: 'Solar LFP Battery',
  short: 'LFP Battery Energy Storage',
  tagline: 'Store solar energy. Power what matters.',
  range: '5 kWh · 10 kWh · 16 kWh',
  image: 'battery-room',
  status: 'available',
  models: ['51.2V 100Ah (5 kWh)', '51.2V 314Ah (16 kWh)'],
  specs: [
    { label: 'Nominal voltage', values: ['51.2 V', '51.2 V'] },
    { label: 'Capacity', values: ['100 Ah', '314 Ah'] },
    { label: 'Cell type and chemistry', values: ['Prismatic (LFP)', 'Prismatic (LFP)'] },
    { label: 'BMS type', values: ['Smart', 'Smart'] },
    { label: 'Maximum cut-off voltage', values: ['57.6 V (±1.5)', '57.6 V (±1.5)'] },
    { label: 'Minimum cut-off voltage', values: ['44.8 V (±1.5)', '44.8 V (±1.5)'] },
    { label: 'Charging voltage', values: ['56.0 V', '56.0 V'] },
    { label: 'Recommended charging current', values: ['30 A', '90 A'] },
    { label: 'Maximum charging current', values: ['50 A', '100 A'] },
    { label: 'Recommended discharging current', values: ['50 A', '100 A'] },
    { label: 'Maximum discharging current', values: ['100 A', '150 A'] },
    { label: 'Cycle life (95% DOD, 25 °C, 0.5C/0.5C)', values: ['6000', '6000'] },
    { label: 'Cell under / over voltage protection', values: ['Yes', 'Yes'] },
    { label: 'Over-current and short-circuit protection', values: ['Yes', 'Yes'] },
    { label: 'Temperature protection', values: ['Yes', 'Yes'] },
    { label: 'Working temperature', values: ['0 to 60 °C', '0 to 60 °C'] },
    { label: 'Storage temperature', values: ['0 to 45 °C', '0 to 45 °C'] },
    { label: 'Weight', values: ['57 kg (approx.)', 'To be confirmed'] },
    { label: 'Size (L × W × H)', values: ['400 × 183 × 653 mm', 'To be confirmed'] },
    { label: 'Communication', values: ['RS485', 'RS485'] },
    { label: 'Connector', values: ['Through-wall connector', 'Through-wall connector'] },
    { label: 'IP protection', values: ['IP20', 'IP20'] },
    { label: 'Display', values: ['Touch screen LCD', 'Touch screen LCD'] },
    { label: 'Installation', values: ['Wall mount', 'Ground mount'] },
    { label: 'Warranty', values: ['10 years', '10 years'] },
  ],
};

// DEMO CONTENT: indicative values typical of 48 V residential hybrid inverters.
// Replace with the LORIX datasheet before launch.
export const hybridInverter: Product = {
  slug: 'hybrid-inverter',
  name: 'Hybrid Solar Inverter',
  short: 'Hybrid Solar Inverters',
  tagline: 'Solar, battery and grid, managed as one.',
  range: '3 kW · 5 kW · 10 kW',
  image: 'inverter-wall',
  status: 'available',
  indicative: true,
  models: ['3 kW', '5 kW', '10 kW'],
  specs: [
    { label: 'Rated AC output', values: ['3,000 W', '5,000 W', '10,000 W'] },
    { label: 'Output voltage', values: ['230 V AC, 50 Hz', '230 V AC, 50 Hz', '230 V AC, 50 Hz'] },
    { label: 'Waveform', values: ['Pure sine wave', 'Pure sine wave', 'Pure sine wave'] },
    { label: 'Battery voltage', values: ['48 V', '48 V', '48 V'] },
    { label: 'Compatible batteries', values: ['LFP (CAN / RS485), lead-acid', 'LFP (CAN / RS485), lead-acid', 'LFP (CAN / RS485), lead-acid'] },
    { label: 'Max. PV input power', values: ['4,000 W', '6,500 W', '13,000 W'] },
    { label: 'MPPT trackers', values: ['1', '1', '2'] },
    { label: 'Backup transfer time', values: ['< 10 ms', '< 10 ms', '< 10 ms'] },
    { label: 'Monitoring', values: ['Wi-Fi app, data stored in India', 'Wi-Fi app, data stored in India', 'Wi-Fi app, data stored in India'] },
    { label: 'Operating modes', values: ['Self-use, backup, grid priority', 'Self-use, backup, grid priority', 'Self-use, backup, grid priority'] },
    { label: 'Installation', values: ['Wall mount', 'Wall mount', 'Wall mount'] },
  ],
};

export const sodiumIon: Product = {
  slug: 'sodium-ion-battery',
  name: 'Sodium-ion Battery',
  short: 'Sodium-ion Batteries',
  tagline: 'The next chemistry for home energy storage.',
  range: 'Coming soon',
  image: null,
  status: 'interest',
};

export const products = [lfpBattery, hybridInverter, sodiumIon];

export const productFaq = [
  {
    q: 'Which products does LORIX Energy offer?',
    a: 'Our planned core range includes hybrid solar inverters in 3 kW, 5 kW and 10 kW capacities and LFP batteries in 5 kWh, 10 kWh and 16 kWh capacities.',
  },
  {
    q: 'Can LORIX batteries work with other hybrid inverters?',
    a: 'Compatibility depends on battery voltage, BMS communication protocols, inverter firmware and approved integration requirements. Confirm compatibility before purchase.',
  },
  {
    q: 'How do I choose the right battery capacity?',
    a: 'The appropriate capacity depends on the loads you need to power, the number of backup hours required and the usable battery energy. Our team or your solar installer can help assess your requirements.',
  },
  {
    q: 'Are LORIX products available throughout India?',
    a: "LORIX Energy's business vision is to build a pan-India distribution and channel partner network. Please contact us to confirm current product availability and service coverage in your area.",
  },
];
