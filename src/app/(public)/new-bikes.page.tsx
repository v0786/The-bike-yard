// New Vehicles Catalogue Page
// Follows FEATURES.md F-CAT-01 to F-CAT-08, PRD.md, and DESIGN.md

import type { Metadata } from '@/types/metadata';

type BikeCardProps = {
  id: string;
  brand: 'Suzuki' | 'Honda' | 'TVS';
  model: string;
  variant: string;
  colour: string;
  price: number;
  exShowroom: number;
  image: string;
  available: boolean;
};

export const metadata: Metadata = {
  title: 'The Bike Yard — New Motorcycles and Scooters',
  description:
    'New motorcycles and scooters at The Bike Yard, Khopat, Thane. Suzuki, Honda, TVS latest models with ex-showroom pricing.',
};

export function NewBikesPage() {
  // Sample new bikes data - in production this comes from DATABASE.md Variant + Colour queries
  const newBikes = [
    {
      id: '1',
      brand: 'Suzuki',
      model: 'Intruder',
      variant: '150cc Standard',
      colour: 'Black',
      price: 1250000,
      exShowroom: 1100000,
      image: '/placeholder-new.svg',
      available: true,
    },
    {
      id: '2',
      brand: 'Honda',
      model: 'CB350',
      variant: '350cc Standard',
      colour: 'Silver',
      price: 1850000,
      exShowroom: 1650000,
      image: '/placeholder-new.svg',
      available: true,
    },
    {
      id: '3',
      brand: 'TVS',
      model: 'Jupiter',
      variant: '110cc SmartXONCE',
      colour: 'White',
      price: 95000,
      exShowroom: 85000,
      image: '/placeholder-new.svg',
      available: true,
    },
    {
      id: '4',
      brand: 'Suzuki',
      model: 'Access 125',
      variant: '125cc Smart',
      colour: 'Red',
      price: 105000,
      exShowroom: 95000,
      image: '/placeholder-new.svg',
      available: true,
    },
    {
      id: '5',
      brand: 'TVS',
      model: 'Rider',
      variant: '110cc',
      colour: 'Blue',
      price: 85000,
      exShowroom: 75000,
      image: '/placeholder-new.svg',
      available: false,
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-bg-secondary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
            New Vehicles
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
            New Motorcycles & Scooters
          </h2>
          <p className="text-brand-secondary/60 text-lg max-w-2xl mx-auto">
            Latest Suzuki, Honda and TVS models. Available now at The Bike Yard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newBikes.map((bike) => (
            <article
              key={bike.id}
              className={`border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow ${!bike.available ? 'opacity-50' : ''}`}
            >
              <div className="relative h-64">
                <div className="absolute inset-0">
                  <div className="w-full h-full bg-gradient-to-br from-brand-secondary/30 to-brand-primary/30 rounded-t-lg overflow-hidden">
                    <img
                      src={bike.image}
                      alt={`${bike.brand} ${bike.model} ${bike.variant} - ${bike.colour}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                {/* Availability badge */}
                {!bike.available && (
                  <div className="absolute top-2 right-2 bg-brand-accent text-xs font-medium px-2 py-1">
                    Unavailable
                  </div>
                )}
                {bike.available && (
                  <div className="absolute top-2 right-2 bg-brand-success text-xs font-medium px-2 py-1">
                    Available
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-brand-secondary/20 text-xs font-medium text-brand-secondary rounded">
                    New
                  </span>
                </div>

                <h3 className="font-semibold text-brand-primary hover:text-brand-accent transition-colors">
                  {bike.brand} {bike.model}
                </h3>

                <p className="text-sm text-brand-secondary/60 mb-3">{bike.variant}</p>

                <div className="flex items-end justify-between">
                  <div className="flex items-end gap-2">
                    <p className="font-medium">₹ {bike.price.toLocaleString()}</p>
                    <p className="text-xs text-brand-secondary">
                      Ex-showroom: ₹ {bike.exShowroom.toLocaleString()}
                    </p>
                  </div>
                  <button className="text-sm font-medium text-brand-primary hover:text-brand-accent transition-colors w-full">
                    Enquire Now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Filter controls */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-sm mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-brand-primary mb-2">Brand</label>
              <select className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-2 pl-3">
                <option value="">All Brands</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Honda">Honda</option>
                <option value="TVS">TVS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-brand-primary mb-2">Price Range</label>
              <input
                type="range"
                className="w-full rounded-border border-border h-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                min="80000"
                max="2000000"
                step="50000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-brand-primary mb-2">Colour</label>
              <select className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-2 pl-3">
                <option value="">All Colours</option>
                <option value="Black">Black</option>
                <option value="Silver">Silver</option>
                <option value="White">White</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-brand-primary mb-2">Variant</label>
              <select className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-2 pl-3">
                <option value="">All Variants</option>
                <option value="150cc Standard">150cc Standard</option>
                <option value="350cc Standard">350cc Standard</option>
                <option value="110cc SmartXONCE">110cc SmartXONCE</option>
                <option value="125cc Smart">125cc Smart</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
