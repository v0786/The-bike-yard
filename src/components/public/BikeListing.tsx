'use client';

// Client-side bike listing that fetches from public API
import * as React from 'react';
import { BikeCard } from '@/components/public/BikeCard';
import { formatInr } from '@/lib/currency';

interface Bike {
  id: string;
  brand: string;
  model: string;
  variant: string;
  colour: string;
  exShowroomPrice: number;
  onRoadPrice: number;
  availabilityStatus: string;
  imageUrl?: string;
}

export function BikeListing() {
  const [bikes, setBikes] = React.useState<Bike[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/public/bikes?status=available&pageSize=12')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load bikes');
        return res.json();
      })
      .then((data) => {
        const units = data.data || [];
        setBikes(
          units.map((u: any) => ({
            id: u.id,
            brand: u.variant?.brand?.name || 'Unknown',
            model: u.variant?.model?.name || 'Unknown',
            variant: u.variant?.name || 'Standard',
            colour: u.colour?.name || 'Unknown',
            exShowroomPrice: Number(u.exShowroomPrice || u.purchasePrice || 0),
            onRoadPrice: Number(u.onRoadPrice || u.purchasePrice || 0),
            availabilityStatus: u.availabilityStatus || u.currentStatus || 'available',
            imageUrl: u.colour?.imageUrl || undefined,
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="col-span-3 flex flex-col items-center justify-center py-12">
        <p className="text-brand-secondary/60">Loading available bikes…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-3 flex flex-col items-center justify-center py-12">
        <p className="text-brand-secondary/60">{error}</p>
      </div>
    );
  }

  if (bikes.length === 0) {
    return (
      <div className="col-span-3 flex flex-col items-center justify-center py-12">
        <p className="text-brand-secondary/60">No bikes available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      {bikes.map((bike) => (
        <BikeCard
          key={bike.id}
          id={bike.id}
          brand={bike.brand}
          model={bike.model}
          variant={bike.variant}
          colour={bike.colour}
          exShowroomPrice={bike.exShowroomPrice}
          onRoadPrice={bike.onRoadPrice}
          availabilityStatus={bike.availabilityStatus}
          imageUrl={bike.imageUrl}
        />
      ))}
    </>
  );
}
