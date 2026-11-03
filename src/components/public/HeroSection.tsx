// Hero section for The Bike Yard homepage
// Cinematic motorcycle showroom hero

type HeroCTA = {
  href: string;
  label: string;
  variant: 'primary' | 'secondary';
};

const heroCTAs: HeroCTA[] = [
  { href: '/new-bikes', label: 'Explore New Bikes', variant: 'primary' },
  { href: '/used-bikes', label: 'Explore Used Bikes', variant: 'secondary' },
  { href: '/test-ride', label: 'Book a Test Ride', variant: 'primary' },
  { href: '/contact', label: 'Contact Showroom', variant: 'secondary' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[700px] bg-gradient-to-b from-brand-primary/90 via-brand-secondary/80 to-brand-primary/90 overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24">
      <div className="absolute inset-0">
        {/* Decorative overlay */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-30 rotate-6"></div>
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block mb-4 px-4 py-1.5 bg-brand-secondary/20 text-sm text-brand-secondary rounded-full">
            Premium Motorcycle Showroom
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            The Bike Yard
          </h1>
          <p className="text-brand-secondary/70 text-lg mb-8 leading-relaxed">
            Shop Number A/01, THE BIKE YARD, Mount Casa Building, Lal Bahadur Shastri Marg, Opposite
            Amar Gyan Industrial Estate, Khopat Signal, Thane, Maharashtra 400601.
          </p>

          <div className="space-y-4">
            {heroCTAs.map((cta, index) => (
              <a
                key={index}
                href={cta.href}
                className={`inline-block rounded-md font-medium transition-all ${cta.variant === 'primary' ? 'bg-brand-primary text-white hover:bg-brand-accent' : 'bg-white/10 text-brand-primary hover:bg-brand-secondary/20 px-6 py-3'}`}
              >
                {cta.label}
              </a>
            ))}
          </div>
        </div>

        {/* Hero motorcycle imagery - using placeholder with actual business context */}
        <div className="relative">
          {/* Motorcycle silhouette / hero image placeholder */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-brand-secondary/30 to-brand-primary/30">
            <svg
              className="absolute inset-0 w-full h-full object-cover"
              viewBox="0 0 800 600"
              fill="currentColor"
            >
              <path d="M100 100 C 200 50, 300 150, 400 100 C 500 50, 600 150, 700 100 L 700 500 L 100 500 Z" />
            </svg>
          </div>
          <div className="absolute -bottom-4 -right-4 bg-gradient-to-t from-brand-primary/80 to-transparent rounded-2xl p-4 shadow-xl">
            <h3 className="font-bold text-white">4.9⭐ | 267 reviews</h3>
            <p className="text-sm text-brand-secondary/70">Rated excellent by our customers</p>
          </div>
        </div>
      </div>
    </section>
  );
}
