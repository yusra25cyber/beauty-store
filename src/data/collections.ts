export interface CollectionMeta {
  slug: string;
  name: string;
  tag: string;
  description: string;
  heroImage: string;
}

export const collections: CollectionMeta[] = [
  {
    slug: "linen-edit",
    name: "The Linen Edit",
    tag: "collection:linen-edit",
    description: "Breathable European linen that softens with every wash — relaxed tailoring for the tropical climate. Easy, effortless, enduring.",
    heroImage: "https://images.pexels.com/photos/31450892/pexels-photo-31450892.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
  },
  {
    slug: "everyday-kurung",
    name: "Everyday Kurung",
    tag: "collection:everyday-kurung",
    description: "Modern baju kurung silhouettes for daily grace. Comfortable cuts, breathable fabrics, and quiet confidence for the woman on the go.",
    heroImage: "https://images.pexels.com/photos/20672197/pexels-photo-20672197.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
  },
  {
    slug: "tailored-essentials",
    name: "Tailored Essentials",
    tag: "collection:tailored-essentials",
    description: "Architectural lines meet precise construction. Structured blazers, sharp trousers, andison pieces that anchor a confident wardrobe.",
    heroImage: "https://images.pexels.com/photos/36215325/pexels-photo-36215325.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
  },
  {
    slug: "weekend-whites",
    name: "Weekend Whites",
    tag: "collection:weekend-whites",
    description: "An ode to white in every shade — ivory, cream, chalk. Pure, serene, and endlessly versatile for sun-drenched weekends and lazy afternoons.",
    heroImage: "https://images.pexels.com/photos/32041692/pexels-photo-32041692.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
  },
  {
    slug: "black-collection",
    name: "The Black Collection",
    tag: "collection:black-collection",
    description: "Total black — a study in shade, texture, and silhouette. From matte jersey to liquid satin, black reimagined in every form.",
    heroImage: "https://images.pexels.com/photos/30332318/pexels-photo-30332318.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
  },
  {
    slug: "office-capsule",
    name: "Office Capsule",
    tag: "collection:office-capsule",
    description: "Polished professionalism without compromise. Sharp tailoring, refined fabrics, and versatile pieces that take you from desk to dinner.",
    heroImage: "https://images.pexels.com/photos/7163357/pexels-photo-7163357.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
  },
  {
    slug: "minimal-occasion-wear",
    name: "Minimal Occasion Wear",
    tag: "collection:minimal-occasion-wear",
    description: "Understated elegance for life's most memorable moments. Clean lines, subtle shimmer, and impeccable draping for weddings and celebrations.",
    heroImage: "https://images.pexels.com/photos/34701350/pexels-photo-34701350.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
  },
  {
    slug: "travel-edit",
    name: "The Travel Edit",
    tag: "collection:travel-edit",
    description: "Wrinkle-resistant, layer-friendly, endlessly packable. Curated for the woman who travels light but never compromises on style.",
    heroImage: "https://images.pexels.com/photos/4173214/pexels-photo-4173214.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
  },
  {
    slug: "monochrome-series",
    name: "Monochrome Series",
    tag: "collection:monochrome-series",
    description: "Black and white in dialogue — graphic, dramatic, timeless. A masterclass in contrast for those who think in monochrome.",
    heroImage: "https://images.pexels.com/photos/33540663/pexels-photo-33540663.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
  },
  {
    slug: "kebaya-collection",
    name: "The Kebaya Collection",
    tag: "collection:kebaya-collection",
    description: "The kebaya reimagined for the modern woman. Lace, silk, and sheer details honour tradition while embracing contemporary silhouettes.",
    heroImage: "https://images.pexels.com/photos/33540659/pexels-photo-33540659.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
  },
  {
    slug: "soft-neutrals",
    name: "Soft Neutrals",
    tag: "collection:soft-neutrals",
    description: "A palette of calm — ivory, beige, taupe, sand. Quietly luxurious pieces that form the foundation of an effortlessly elegant wardrobe.",
    heroImage: "https://images.pexels.com/photos/36742656/pexels-photo-36742656.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
  },
  {
    slug: "evening-layering",
    name: "Evening Layering",
    tag: "collection:evening-layering",
    description: "Velvet, lace, sequins, and sheer — pieces designed for the magic of evening. Layer them, mix them, own the night.",
    heroImage: "https://images.pexels.com/photos/34701350/pexels-photo-34701350.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80",
  },
];

export const collectionNavGroups = [
  {
    title: "Ready to Wear",
    items: collections.filter((c) =>
      ["linen-edit", "tailored-essentials", "weekend-whites", "soft-neutrals"].includes(c.slug)
    ),
  },
  {
    title: "Monochrome",
    items: collections.filter((c) =>
      ["black-collection", "monochrome-series"].includes(c.slug)
    ),
  },
  {
    title: "Modest Heritage",
    items: collections.filter((c) =>
      ["everyday-kurung", "kebaya-collection"].includes(c.slug)
    ),
  },
  {
    title: "Occasion & Travel",
    items: collections.filter((c) =>
      ["minimal-occasion-wear", "evening-layering", "office-capsule", "travel-edit"].includes(c.slug)
    ),
  },
];
