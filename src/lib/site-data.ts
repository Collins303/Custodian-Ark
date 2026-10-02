export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  shortDescription: string;
  description: string;
  tags: string[];
  image: string;
  gallery: string[];
  features: string[];
  specs: Record<string, string>;
};

export type Category = {
  name: string;
  description: string;
};

export type Solution = {
  title: string;
  audience: string;
  summary: string;
  benefits: string[];
  components: string[];
  process: string[];
};

export type Service = {
  title: string;
  summary: string;
  benefit: string;
  audience: string;
};

export const categories: Category[] = [
  { name: 'Solar Panels', description: 'High-output PV modules for homes, commercial rooftops and hybrid systems.' },
  { name: 'Inverters', description: 'Reliable conversion and smart power management for grid and backup systems.' },
  { name: 'Batteries & Energy Storage', description: 'Lithium and deep-cycle storage systems for resilience and energy autonomy.' },
  { name: 'Transformers', description: 'Distribution and power conditioning equipment for large project deployment.' },
  { name: 'Cables', description: 'Power, control and installation cable solutions with certified performance.' },
  { name: 'Solar Lighting', description: 'Outdoor, security and high-efficiency lighting for solar-ready estates.' },
  { name: 'Charge Controllers', description: 'PWM and MPPT regulators for battery charge stability.' },
  { name: 'Accessories', description: 'Mounting, protection and installation components for complete systems.' },
  { name: 'Electrical Equipment', description: 'Distribution boards, breakers and necessary power infrastructure.' },
  { name: 'Power Protection', description: 'Surge and power management protection for sensitive loads.' },
];

export const products: Product[] = [
  {
    id: 'p-001',
    name: 'SunVolt 500W Monocrystalline Panel',
    slug: 'sunvolt-500w-monocrystalline-panel',
    brand: 'SunVolt',
    category: 'Solar Panels',
    price: 145000,
    compareAtPrice: 180000,
    rating: 4.8,
    reviews: 214,
    stock: 68,
    shortDescription: 'High-efficiency rooftop solar panel for residential and light commercial installations.',
    description: 'The SunVolt 500W monocrystalline panel is designed for reliability in hot climates and long daylight cycles. With optimized cell architecture and robust frame construction, it delivers premium output across Nigerian weather conditions.',
    tags: ['Residential', 'High Efficiency', 'Mono'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=900&q=80',
    ],
    features: ['500W output', 'High efficiency cell array', 'Weather-resistant frame', 'Low degradation warranty'],
    specs: {
      'Power Rating': '500W',
      'Efficiency': '21.3%',
      'Cell Type': 'Monocrystalline',
      'Voltage': '41.5V',
      'Current': '12.05A',
      'Warranty': '25 years performance',
    },
  },
  {
    id: 'p-002',
    name: 'ArkHybrid 5kW Inverter',
    slug: 'arkhybrid-5kw-inverter',
    brand: 'ArkHybrid',
    category: 'Inverters',
    price: 620000,
    compareAtPrice: 760000,
    rating: 4.9,
    reviews: 132,
    stock: 36,
    shortDescription: 'Hybrid inverter for smart solar and backup power integration.',
    description: 'The ArkHybrid 5kW inverter combines efficient AC conversion with battery management, solar input optimization, and load prioritization for homes and SMEs.',
    tags: ['Hybrid', 'Smart Control', 'Backup'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1555618562-802a03f4c9f6?auto=format&fit=crop&w=900&q=80',
    ],
    features: ['5kW hybrid output', 'MPPT charge control', 'Smart load transfer', 'Wi-Fi monitoring'],
    specs: {
      'Power Rating': '5kW',
      'Phase': 'Single',
      'Battery Compatibility': '48V lithium',
      'Max PV Input': '5000W',
      'Efficiency': '97.5%',
      'Warranty': '3 years',
    },
  },
  {
    id: 'p-003',
    name: 'VoltCore 10kWh Lithium Battery',
    slug: 'voltcore-10kwh-lithium-battery',
    brand: 'VoltCore',
    category: 'Batteries & Energy Storage',
    price: 990000,
    compareAtPrice: 1200000,
    rating: 4.8,
    reviews: 96,
    stock: 21,
    shortDescription: 'Modular storage bank for continuous reliability and off-grid resilience.',
    description: 'Designed for long cycle life and stable output, the VoltCore lithium battery supports homes, clinics and commercial facilities requiring dependable backup power.',
    tags: ['Lithium', '10kWh', 'Storage'],
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a6a6?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581092921461-eab62e97a6a6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80',
    ],
    features: ['10kWh nominal capacity', 'Long deep-cycle life', 'Smart BMS', 'Scalable design'],
    specs: {
      'Capacity': '10kWh',
      'Voltage': '48V',
      'Battery Chemistry': 'Lithium Iron Phosphate',
      'Cycle Life': '6000 cycles',
      'Depth of Discharge': '90%',
      'Warranty': '10 years',
    },
  },
  {
    id: 'p-004',
    name: 'GridSafe 25kVA Transformer',
    slug: 'gridsafe-25kva-transformer',
    brand: 'GridSafe',
    category: 'Transformers',
    price: 3850000,
    compareAtPrice: 4300000,
    rating: 4.7,
    reviews: 41,
    stock: 10,
    shortDescription: 'Three-phase transformer for commercial, utility and industrial power deployment.',
    description: 'The GridSafe 25kVA transformer ensures stable distribution for larger power loads and project infrastructure. It is built for robust operation and voltage consistency.',
    tags: ['Commercial', 'Transformer', 'Three Phase'],
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1497366858526-0766b9a5927b?auto=format&fit=crop&w=900&q=80',
    ],
    features: ['25kVA distribution capacity', 'Three-phase output', 'Low losses design', 'Industrial-grade insulation'],
    specs: {
      'Capacity': '25kVA',
      'Input Voltage': '415V',
      'Output Voltage': '230V',
      'Phase': '3 phase',
      'Cooling Type': 'Oil cooled',
      'Warranty': '2 years',
    },
  },
  {
    id: 'p-005',
    name: 'Slade 16mm Solar Cable',
    slug: 'slade-16mm-solar-cable',
    brand: 'Slade',
    category: 'Cables',
    price: 28000,
    compareAtPrice: 34500,
    rating: 4.6,
    reviews: 284,
    stock: 150,
    shortDescription: 'Flexible dc cable rated for solar installations and power distribution.',
    description: 'This 16mm solar cable offers robust insulation and proven durability for long cable runs, rooftop systems and industrial power projects.',
    tags: ['Solar Cable', '16mm', 'PV'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
    ],
    features: ['16mm conductor', 'UV and temperature resistant', 'Low voltage drop', 'Installation ready'],
    specs: {
      'Size': '16mm²',
      'Core': 'Single core',
      'Material': 'Copper',
      'Length': '100m drum',
      'Voltage Rating': '1000V DC',
      'Insulation': 'XLPE',
    },
  },
  {
    id: 'p-006',
    name: 'NovaLite Solar Street Light',
    slug: 'novalite-solar-street-light',
    brand: 'NovaLite',
    category: 'Solar Lighting',
    price: 295000,
    compareAtPrice: 350000,
    rating: 4.7,
    reviews: 88,
    stock: 42,
    shortDescription: 'Smart solar lighting for roads, compounds and perimeter security.',
    description: 'The NovaLite solar street light combines battery storage and efficient LEDs to provide dependable illumination with minimal grid dependency.',
    tags: ['Lighting', 'Security', 'Solar'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
    ],
    features: ['Automatic dusk activation', 'Robust weatherproof body', 'High-efficiency LEDs', 'Battery backup'],
    specs: {
      'Wattage': '50W',
      'Battery': 'Lithium',
      'Material': 'Aluminum',
      'Working Time': '10-12 hours',
      'IP Rating': 'IP65',
      'Warranty': '2 years',
    },
  },
  {
    id: 'p-007',
    name: 'OrbitMax MPPT Controller',
    slug: 'orbitmax-mppt-controller',
    brand: 'OrbitMax',
    category: 'Charge Controllers',
    price: 168000,
    compareAtPrice: 205000,
    rating: 4.5,
    reviews: 62,
    stock: 55,
    shortDescription: 'Charge controller for maximizing energy harvesting and battery protection.',
    description: 'OrbitMax MPPT controllers dynamically optimize panel input and deliver efficient charging for off-grid and hybrid systems.',
    tags: ['MPPT', 'Battery', 'Control'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1558494949-b8ae4d01b5c6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80',
    ],
    features: ['MPPT tracking', 'Wide voltage range', 'Battery temperature protection', 'LCD display'],
    specs: {
      'Power Rating': '40A',
      'Voltage': '12V/24V/48V',
      'Efficiency': '98%',
      'Protection': 'Overload and short circuit',
      'Warranty': '2 years',
    },
  },
  {
    id: 'p-008',
    name: 'ZenMount Roof Rail Kit',
    slug: 'zenmount-roof-rail-kit',
    brand: 'ZenMount',
    category: 'Accessories',
    price: 76000,
    compareAtPrice: 93000,
    rating: 4.6,
    reviews: 74,
    stock: 90,
    shortDescription: 'Durable mounting system for secure solar panel installation on rooftops.',
    description: 'The ZenMount rail kit is engineered for corrosion resistance, wind loading tolerance and quick installation across roof profiles.',
    tags: ['Mounting', 'Roof', 'Solar'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80',
    ],
    features: ['Corrosion-resistant rails', 'Quick install hardware', 'Wind rated design', 'Works with varied roof types'],
    specs: {
      'Material': 'Aluminum',
      'Finish': 'Anodized',
      'Compatibility': 'Tilt and flush mount',
      'Warranty': '10 years',
    },
  },
];

export const solutions: Solution[] = [
  {
    title: 'Home Solar Systems',
    audience: 'Homeowners seeking lower bills and dependable backup.',
    summary: 'Turn your home into a resilient, low-cost solar-powered property with a design matched to real household loads.',
    benefits: ['Lower energy costs', 'Reliable backup during outages', 'Clean, modern roof integration'],
    components: ['Solar panels', 'Hybrid inverter', 'Battery bank', 'Monitoring system'],
    process: ['Energy audit', 'System design', 'Installation', 'Commissioning and support'],
  },
  {
    title: 'Small Business Solar',
    audience: 'Retailers, offices and service businesses.',
    summary: 'Keep operations running through the day with resilient solar power and practical savings on your electricity bill.',
    benefits: ['Stable power quality', 'Reduced operational costs', 'Improved business continuity'],
    components: ['Commercial panels', 'Three-phase inverter', 'Battery support', 'Load management'],
    process: ['Load analysis', 'Layout planning', 'Procurement', 'Project execution'],
  },
  {
    title: 'Commercial Solar',
    audience: 'Schools, factories and large facilities.',
    summary: 'Large-scale solar delivery for higher energy demand, lower emissions and stronger long-term ROI.',
    benefits: ['Substantial savings', 'Sustainable footprint', 'Scalable project growth'],
    components: ['Large array', 'Transformer set', 'Energy monitoring', 'Protection equipment'],
    process: ['Feasibility study', 'Engineering design', 'Construction', 'Testing and handover'],
  },
  {
    title: 'Backup Power',
    audience: 'Homes and businesses that need dependable uninterrupted power.',
    summary: 'Protect critical appliances and services with a fast-switching backup system suited to your load profile.',
    benefits: ['Power continuity', 'Reduced downtime', 'Safer load management'],
    components: ['Battery bank', 'Inverter', 'Automatic transfer switch', 'Protection panel'],
    process: ['Load review', 'System sizing', 'Installation', 'Ongoing maintenance'],
  },
];

export const services: Service[] = [
  { title: 'Solar Installation', summary: 'Professional rooftop, ground and commercial installation.', benefit: 'Precision deployment by trained solar technicians.', audience: 'Homeowners and businesses' },
  { title: 'Solar System Design', summary: 'Custom sizing and engineering for every project type.', benefit: 'Systems aligned with real energy demand and site conditions.', audience: 'New and retrofitted installations' },
  { title: 'Energy Consultation', summary: 'Load analysis and strategic recommendations for efficient energy use.', benefit: 'Actionable advice backed by technical expertise.', audience: 'Developers and facility managers' },
  { title: 'Battery Installation', summary: 'Safe integration of storage systems into existing infrastructure.', benefit: 'Consistent power availability for critical loads.', audience: 'Homes, clinics and offices' },
  { title: 'Commercial Solar Installation', summary: 'Turnkey commercial deployment from design to commissioning.', benefit: 'A dependable project partner from concept to handover.', audience: 'Commercial operations' },
  { title: 'System Maintenance', summary: 'Inspection, health checks and performance tuning.', benefit: 'Higher uptime and maximum system performance.', audience: 'All active solar installations' },
];

export const testimonials = [
  { name: 'Ada Okafor', role: 'Homeowner, Lekki', quote: 'Our power reliability improved immediately. The team designed a solution that matched our actual household loads and explained every detail clearly.' },
  { name: 'Michael Adebayo', role: 'Operations Manager', quote: 'Custodian Ark handled our commercial backup and solar upgrade with professionalism, quick communication and dependable execution.' },
  { name: 'Chidinma Eze', role: 'Facility Lead', quote: 'The battery and inverter system has kept our essential equipment running through outages without stress or downtime.' },
];

export const blogPosts = [
  { title: 'How solar works in Nigeria', category: 'Energy Insights', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=900&q=80' },
  { title: 'How to choose the right inverter', category: 'Power Systems', readTime: '4 min read', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80' },
  { title: 'How many panels do I need?', category: 'Sizing', readTime: '6 min read', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=900&q=80' },
];

export const featuredMetrics = [
  { label: 'Projects delivered', value: '2.4K+' },
  { label: 'Energy saved', value: '18.6 GWh' },
  { label: 'Customer satisfaction', value: '98%' },
  { label: 'Response time', value: '< 24 hrs' },
];

export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Solar Solutions', href: '/solar-solutions' },
  { label: 'Services', href: '/services' },
  { label: 'Energy Insights', href: '/energy-insights' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
