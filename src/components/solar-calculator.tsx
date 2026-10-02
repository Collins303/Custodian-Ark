'use client';

import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { products } from '@/lib/site-data';

const baseAppliances = [
  { id: 'refrigerator', label: 'Refrigerator', wattage: 150, hours: 12 },
  { id: 'fan', label: 'Fan', wattage: 80, hours: 8 },
  { id: 'tv', label: 'TV', wattage: 120, hours: 6 },
  { id: 'lights', label: 'Lights', wattage: 40, hours: 6 },
  { id: 'air-conditioner', label: 'Air Conditioner', wattage: 1200, hours: 6 },
  { id: 'washing-machine', label: 'Washing Machine', wattage: 450, hours: 1 },
  { id: 'water-pump', label: 'Water Pump', wattage: 500, hours: 3 },
  { id: 'computer', label: 'Computer', wattage: 180, hours: 6 },
  { id: 'microwave', label: 'Microwave', wattage: 900, hours: 0.5 },
  { id: 'iron', label: 'Iron', wattage: 1000, hours: 1 },
];

type ApplianceState = {
  id: string;
  label: string;
  quantity: number;
  wattage: number;
  hours: number;
};

const defaultAppliances = baseAppliances.map((item) => ({ ...item, quantity: 1 }));

export function SolarCalculator() {
  const [appliances, setAppliances] = useState<ApplianceState[]>(defaultAppliances);

  const results = useMemo(() => {
    const dailyConsumption = appliances.reduce((sum, item) => {
      const usage = item.quantity * item.wattage * item.hours;
      return sum + usage;
    }, 0);

    const peakLoad = appliances.reduce((sum, item) => sum + item.quantity * item.wattage, 0);
    const inverterSize = Math.max(1.5, peakLoad * 1.25 / 1000);
    const batteryCapacity = Math.max(3, (dailyConsumption / 1000) * 0.8);
    const solarArray = Math.max(1.5, (dailyConsumption / 1000) / 4.5);

    return {
      dailyConsumption,
      peakLoad,
      inverterSize,
      batteryCapacity,
      solarArray,
    };
  }, [appliances]);

  const recommendedProducts = useMemo(() => {
    return products.filter((product) => ['Solar Panels', 'Inverters', 'Batteries & Energy Storage'].includes(product.category)).slice(0, 3);
  }, []);

  const updateAppliance = (id: string, field: 'quantity' | 'wattage' | 'hours', value: number) => {
    setAppliances((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: Math.max(0, value),
            }
          : item,
      ),
    );
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Sizing estimate</p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">Solar system calculator</h3>
          </div>
          <div className="rounded-full bg-emerald-50 p-3 text-emerald-700">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-4">
          {appliances.map((appliance) => (
            <div key={appliance.id} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-800">{appliance.label}</p>
              </div>
              <label className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                Quantity
                <input
                  type="number"
                  min={0}
                  value={appliance.quantity}
                  onChange={(event) => updateAppliance(appliance.id, 'quantity', Number(event.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-emerald-400"
                />
              </label>
              <label className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                Wattage
                <input
                  type="number"
                  min={0}
                  value={appliance.wattage}
                  onChange={(event) => updateAppliance(appliance.id, 'wattage', Number(event.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-emerald-400"
                />
              </label>
              <label className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                Hours/day
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={appliance.hours}
                  onChange={(event) => updateAppliance(appliance.id, 'hours', Number(event.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-emerald-400"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Preliminary estimate</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Estimated daily consumption</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{Math.round(results.dailyConsumption)} Wh</div>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Estimated peak load</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{Math.round(results.peakLoad)} W</div>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Recommended inverter</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{results.inverterSize.toFixed(1)} kW</div>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Recommended battery</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{results.batteryCapacity.toFixed(1)} kWh</div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Recommended solar array</div>
            <div className="mt-2 text-2xl font-black text-slate-900">{results.solarArray.toFixed(1)} kW</div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            This calculator provides a preliminary estimate based on the information provided. Final system sizing should be confirmed by a qualified solar professional after assessing actual usage, site conditions and equipment requirements.
          </p>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recommended products</p>
          <div className="mt-4 space-y-3">
            {recommendedProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 p-3">
                <img src={product.image} alt={product.name} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">{product.name}</div>
                  <div className="text-sm text-slate-500">{product.category}</div>
                </div>
                <div className="text-sm font-bold text-emerald-700">₦{product.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Shop recommended products</button>
            <button className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800">Request professional assessment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
