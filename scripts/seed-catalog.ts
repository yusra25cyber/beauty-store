import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

function loadEnvFile(filePath: string): Record<string, string> {
  const env: Record<string, string> = {};
  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    env[key] = value;
  }
  return env;
}

function pexelUrl(id: string, w = 800, h = 1000): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;
}

function img(photoId: string, w = 800, h = 1000): { url: string; publicId: string; format: string; width: number; height: number } {
  return { url: pexelUrl(photoId, w, h), publicId: photoId.replace(/[^a-zA-Z0-9]/g, "_"), format: "jpg", width: w, height: h };
}

const N1 = "31450892", N2 = "36742656", N3 = "20672197", N4 = "33540659", N5 = "33540663";
const B1 = "36215325", B2 = "30332318", B3 = "34161627", B4 = "33432275";
const W1 = "32041692", W2 = "33453053", W3 = "36325185", W4 = "33432286";
const O1 = "7163357", O2 = "7163348";
const T1 = "4173214", T2 = "32176084";
const E1 = "34701350", E2 = "30750371";
const C1 = "25440692", C2 = "11863093", C3 = "19386093", C4 = "30700705";

const IMG_SETS: Record<string, string[]> = {
  linen:      [pexelUrl(N1,800,1000), pexelUrl(N2,600,800), pexelUrl(N3,800,1000), pexelUrl(N4,600,800)],
  linenHover: [pexelUrl(N1,400,600),  pexelUrl(N2,400,600), pexelUrl(N3,400,600),  pexelUrl(N4,400,600)],
  linenLife:  [pexelUrl(N1,1000,700), pexelUrl(N2,1000,700), pexelUrl(N3,1000,700), pexelUrl(N4,1000,700)],
  daily:      [pexelUrl(N3,800,1000), pexelUrl(N5,800,1000), pexelUrl(N4,800,1000), pexelUrl(N1,800,1000)],
  dailyHover: [pexelUrl(N3,400,600),  pexelUrl(N5,400,600),  pexelUrl(N4,400,600),  pexelUrl(N1,400,600)],
  tailored:      [pexelUrl(B1,800,1000), pexelUrl(B2,800,1000), pexelUrl(B3,800,1000), pexelUrl(B4,800,1000)],
  tailoredHover: [pexelUrl(B1,400,600),  pexelUrl(B2,400,600),  pexelUrl(B3,400,600),  pexelUrl(B4,400,600)],
  whites:      [pexelUrl(W1,800,1000), pexelUrl(W2,800,1000), pexelUrl(W3,800,1000), pexelUrl(W4,800,1000)],
  whitesHover: [pexelUrl(W1,400,600),  pexelUrl(W2,400,600),  pexelUrl(W3,400,600),  pexelUrl(W4,400,600)],
  black:      [pexelUrl(B1,800,1000), pexelUrl(B2,800,1000), pexelUrl(B3,800,1000), pexelUrl(B4,800,1000)],
  blackHover: [pexelUrl(B1,400,600),  pexelUrl(B2,400,600),  pexelUrl(B3,400,600),  pexelUrl(B4,400,600)],
  office:      [pexelUrl(O1,800,1000), pexelUrl(O1,600,800), pexelUrl(O2,800,1000), pexelUrl(O2,600,800)],
  officeHover: [pexelUrl(O1,400,600),  pexelUrl(O1,300,400), pexelUrl(O2,400,600),  pexelUrl(O2,300,400)],
  occasion:      [pexelUrl(E1,800,1000), pexelUrl(E1,600,800), pexelUrl(E2,800,1000), pexelUrl(E2,600,800)],
  occasionHover:[pexelUrl(E1,400,600),  pexelUrl(E1,300,400), pexelUrl(E2,400,600),  pexelUrl(E2,300,400)],
  travel:      [pexelUrl(T1,800,1000), pexelUrl(T1,600,800), pexelUrl(T2,800,1000), pexelUrl(T2,600,800)],
  travelHover: [pexelUrl(T1,400,600),  pexelUrl(T1,300,400), pexelUrl(T2,400,600),  pexelUrl(T2,300,400)],
  mono:      [pexelUrl(B1,800,1000), pexelUrl(N1,800,1000), pexelUrl(B2,800,1000), pexelUrl(N2,800,1000)],
  monoHover: [pexelUrl(B1,400,600),  pexelUrl(N1,400,600),  pexelUrl(B2,400,600),  pexelUrl(N2,400,600)],
  neutral:      [pexelUrl(N1,800,1000), pexelUrl(N2,800,1000), pexelUrl(N3,800,1000), pexelUrl(N4,800,1000)],
  neutralHover: [pexelUrl(N1,400,600),  pexelUrl(N2,400,600),  pexelUrl(N3,400,600),  pexelUrl(N4,400,600)],
  evening:      [pexelUrl(E1,800,1000), pexelUrl(E1,600,800), pexelUrl(E2,800,1000), pexelUrl(E2,600,800)],
  eveningHover:[pexelUrl(E1,400,600),  pexelUrl(E1,300,400), pexelUrl(E2,400,600),  pexelUrl(E2,300,400)],
  kebayaSet:    [pexelUrl(N3,800,1000), pexelUrl(N4,800,1000), pexelUrl(N5,800,1000), pexelUrl(N2,800,1000)],
  kebayaHover:  [pexelUrl(N3,400,600),  pexelUrl(N4,400,600),  pexelUrl(N5,400,600),  pexelUrl(N2,400,600)],
};

const categories = [
  { name: "New Arrivals", slug: "new-arrivals", image: pexelUrl(N1), description: "The latest additions to our collection" },
  { name: "Kurung & Sets", slug: "kurung-sets", image: pexelUrl(N3), description: "Modern baju kurung sets for the contemporary woman" },
  { name: "Kebaya", slug: "kebaya", image: pexelUrl(N4), description: "Refined kebaya silhouettes - from classic to contemporary" },
  { name: "Tops & Blouses", slug: "tops", image: pexelUrl(B1), description: "Structured tops, blouses, and layering pieces" },
  { name: "Bottoms", slug: "bottoms", image: pexelUrl(B3), description: "Trousers, skirts, and palazzos" },
  { name: "Outerwear", slug: "outerwear", image: pexelUrl(O1), description: "Blazers, cardigans, and lightweight jackets" },
  { name: "Dresses", slug: "dresses", image: pexelUrl(E1), description: "Minimal dresses for every occasion" },
  { name: "Accessories", slug: "accessories", image: pexelUrl(B4), description: "Finishing pieces - belts, brooches, bags" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const FREE_SIZES = ["One Size"];

function sizeVariants(name: string, colors: string[], price: number, sku: string, sizes: string[], stockFn: (color: string, size: string) => number) {
  return colors.flatMap((c) => sizes.map((s) => ({ name: c+" / "+s, sku: sku+"-"+c.replace(/\s+/g,"").toUpperCase()+"-"+s.replace(/\s+/g,""), price, stock: stockFn(c, s), images: [] })));
}

function varList(name: string, variants: { name: string; price: number; stock: number }[], skuPrefix: string) {
  return variants.map((v) => ({ name: v.name, sku: skuPrefix+"-"+v.name.replace(/[^a-zA-Z0-9]/g,"_").toUpperCase(), price: v.price, stock: v.stock, images: [] }));
}

function createProducts(catMap: Record<string, string>) {
  const NA = catMap["new-arrivals"];
  const KS = catMap["kurung-sets"];
  const KB = catMap["kebaya"];
  const TP = catMap["tops"];
  const BT = catMap["bottoms"];
  const OW = catMap["outerwear"];
  const DR = catMap["dresses"];
  const AC = catMap["accessories"];

  const s = SIZES;
  function stk(c: string, sz: string) { return [5,12,18,10,6,3][s.indexOf(sz)]||4; }
  function lwk(c: string, sz: string) { return [2,5,8,4,2,1][s.indexOf(sz)]||2; }

  return [
    { name: "Linen Relaxed Blazer", description: "Unlined linen blazer with relaxed unstructured silhouette. Notched lapel, patch pockets, single-button closure. Develops soft drape with every wash.", price: 789, images: IMG_SETS.linen, category: OW, featured: true, tags: ["linen","blazer","outerwear","collection:linen-edit"], inStock: true, stockQuantity: 35, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Linen Relaxed Blazer",["Ivory","Sand","Sage"],789,"LRB",s,(c,sz)=>{if(c==="Sage"&&sz==="XS")return 0;return stk(c,sz);}) },
    { name: "Linen Wide-Leg Trouser", description: "High-waisted wide-leg trousers in breathable European linen. Pleated front, side pockets, relaxed fit. Linen creases beautifully.", price: 459, images: IMG_SETS.linen, category: BT, featured: false, tags: ["linen","trousers","bottoms","collection:linen-edit"], inStock: true, stockQuantity: 45, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Linen Wide-Leg Trouser",["Ivory","Sand","Sage"],459,"LWT",s,stk) },
    { name: "Linen Button-Front Shirt", description: "Relaxed linen button-front shirt with camp collar and rollable sleeves. Slightly oversized with curved hem.", price: 389, images: IMG_SETS.linen, category: TP, featured: false, tags: ["linen","shirt","tops","collection:linen-edit"], inStock: true, stockQuantity: 50, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Linen Button-Front Shirt",["Ivory","Sand","Sage","White"],389,"LBS",s,(c,sz)=>{if(c==="Sage"&&sz==="XXL")return 0;return stk(c,sz);}) },
    { name: "Linen Midi Shirt Dress", description: "Shirt dress in lightweight linen with self-belt. Classic collar, chest pocket, midi hem with side slit.", price: 689, images: IMG_SETS.linen, category: DR, featured: true, tags: ["linen","shirt dress","dresses","collection:linen-edit"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Linen Midi Shirt Dress",["Ivory","Sand","Sage"],689,"LMSD",s,(c,sz)=>{if(c==="Sage"&&sz==="XS")return 0;if(c==="Sand"&&sz==="XL")return 0;return stk(c,sz);}) },
    { name: "Linen Relaxed Kurung Set", description: "Modern kurung set in breathable linen - relaxed tunic with Mandarin collar and matching wide-leg pants. Hidden pockets.", price: 879, images: IMG_SETS.linen, category: KS, featured: false, tags: ["linen","kurung","set","collection:linen-edit"], inStock: true, stockQuantity: 25, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Linen Relaxed Kurung Set",["Ivory","Sand","Sage"],879,"LRKS",s,(c,sz)=>{if(c==="Ivory"&&sz==="XS")return 0;if(c==="Sand"&&sz==="XL")return 0;return lwk(c,sz);}) },
    { name: "Linen Draped Vest", description: "Sleeveless linen vest with draped open front and waterfall hem. Layer over the Button-Front Shirt or wear alone.", price: 329, images: IMG_SETS.linen, category: TP, featured: false, tags: ["linen","vest","tops","collection:linen-edit"], inStock: true, stockQuantity: 40, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Linen Draped Vest",["Ivory","Sand"],329,"LDV",s,stk) },

    { name: "Kurung Moden Crepe Set", description: "Modern baju kurung in high-twist crepe that resists wrinkles. Clean-lined top with hidden snap buttons and straight-cut skirt.", price: 589, images: IMG_SETS.daily, category: KS, featured: false, tags: ["kurung","crepe","collection:everyday-kurung"], inStock: true, stockQuantity: 50, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Kurung Moden Crepe Set",["Navy","Dusty Rose","Sage"],589,"KMCS",s,stk) },
    { name: "Kurung Moden Jersey Set", description: "Everyday kurung in soft cotton-jersey. Stretchy, breathable, easy care. Round neckline, elbow sleeves, elastic-waist skirt.", price: 459, images: IMG_SETS.daily, category: KS, featured: false, tags: ["kurung","jersey","collection:everyday-kurung"], inStock: true, stockQuantity: 70, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Kurung Moden Jersey Set",["Navy","Black","Sage","Dusty Rose"],459,"KMJS",s,(c,sz)=>{if(c==="Sage"&&sz==="XS")return 0;if(c==="Dusty Rose"&&sz==="XXL")return 0;return[8,15,22,14,8,3][s.indexOf(sz)]; }) },
    { name: "Kurung Moden Peplum Set", description: "Kurung with peplum top - fitted bodice with feminine waist flare. Three-quarter bell sleeves, matching pencil-cut skirt.", price: 649, images: IMG_SETS.daily, category: KS, featured: true, tags: ["kurung","peplum","collection:everyday-kurung"], inStock: true, stockQuantity: 35, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Kurung Moden Peplum Set",["Navy","Dusty Rose","Sage"],649,"KMPS",s,stk) },
    { name: "Kurung Moden Lace Set", description: "Romantic kurung with semi-sheer lace overlay. Sheer lace sleeves, lace insert at neckline. Fully lined with matching skirt.", price: 749, images: IMG_SETS.kebayaSet, category: KS, featured: false, tags: ["kebaya","lace","set","collection:kebaya-collection"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Kurung Moden Lace Set",["Ivory","Dusty Rose","Black"],749,"KMLS",s,(c,sz)=>{if(c==="Dusty Rose"&&sz==="XS")return 0;return[3,7,10,5,2,1][s.indexOf(sz)]; }) },
    { name: "Kurung Moden Palazzo Set", description: "Contemporary kurung with wide-leg palazzo pants. Longer tunic with side slits, Mandarin collar, three-quarter sleeves.", price: 599, images: IMG_SETS.daily, category: KS, featured: false, tags: ["kurung","palazzo","collection:everyday-kurung"], inStock: true, stockQuantity: 40, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Kurung Moden Palazzo Set",["Navy","Black","Dusty Rose"],599,"KMPS",s,stk) },
    { name: "Kurung Moden Linen Set", description: "Kurung set in breathable European linen. Relaxed tunic with Mandarin collar and A-line skirt. Hidden zip and side pockets.", price: 699, images: IMG_SETS.daily, category: KS, featured: false, tags: ["kurung","linen","collection:everyday-kurung"], inStock: true, stockQuantity: 35, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Kurung Moden Linen Set",["Ivory","Dusty Rose","Sage"],699,"KMLS",s,(c,sz)=>{if(c==="Sage"&&sz==="XS")return 0;if(c==="Dusty Rose"&&sz==="XXL")return 0;return stk(c,sz);}) },

    { name: "Tailored Single-Breasted Blazer", description: "Sharply tailored blazer in cotton-silk. Notched lapels, structured shoulders, two-button closure, flap pockets.", price: 849, images: IMG_SETS.tailored, category: OW, featured: true, tags: ["tailored","blazer","outerwear","collection:tailored-essentials"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Tailored Single-Breasted Blazer",["Black","Navy","Charcoal"],849,"TSBB",s,(c,sz)=>{if(c==="Charcoal"&&sz==="XS")return 0;return stk(c,sz);}) },
    { name: "Structured Wide-Leg Pant", description: "High-waisted trousers with sharp front pleats and structured wide leg. Wool-blend suiting with centre crease.", price: 489, images: IMG_SETS.tailored, category: BT, featured: false, tags: ["tailored","trousers","bottoms","collection:tailored-essentials"], inStock: true, stockQuantity: 40, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Structured Wide-Leg Pant",["Black","Navy","Charcoal"],489,"SWLP",s,stk) },
    { name: "Tailored Sleeveless Vest", description: "Sleeveless tailored vest with V-neckline and sharp lapels. Wear buttoned or open as a layering piece.", price: 329, images: IMG_SETS.tailored, category: TP, featured: false, tags: ["tailored","vest","tops","collection:tailored-essentials"], inStock: true, stockQuantity: 45, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Tailored Sleeveless Vest",["Black","Navy","Charcoal"],329,"TSV",s,stk) },
    { name: "Pencil Midi Skirt", description: "Classic pencil skirt in stretch-cotton sateen with back vent. Sits at natural waist, falls to mid-calf.", price: 389, images: IMG_SETS.tailored, category: BT, featured: false, tags: ["tailored","skirt","bottoms","collection:tailored-essentials"], inStock: true, stockQuantity: 40, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Pencil Midi Skirt",["Black","Navy","Charcoal"],389,"PMS",s,(c,sz)=>{if(c==="Navy"&&sz==="XS")return 0;return stk(c,sz);}) },
    { name: "Structured Jumpsuit", description: "One-piece jumpsuit with tailored bodice, wide leg, and self-fabric belt. Concealed zip back, side pockets, flattering V-neck.", price: 749, images: IMG_SETS.tailored, category: DR, featured: true, tags: ["tailored","jumpsuit","dresses","collection:tailored-essentials"], inStock: true, stockQuantity: 25, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Structured Jumpsuit",["Black","Navy","Charcoal"],749,"SJ",s,(c,sz)=>{if(c==="Charcoal"&&sz==="XXL")return 0;return lwk(c,sz);}) },
    { name: "White Linen Button-Front Shirt", description: "Quintessential white linen shirt - relaxed through the body with camp collar and rollable sleeves.", price: 359, images: IMG_SETS.whites, category: TP, featured: false, tags: ["white","linen","shirt","collection:weekend-whites"], inStock: true, stockQuantity: 60, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("White Linen Button-Front Shirt",["White","Ivory","Off-White"],359,"WLBS",s,stk) },
    { name: "White Wide-Leg Trouser", description: "Fluid wide-leg trouser in ivory crepe with elasticated back waist. Side pockets, gentle drape that skims without clinging.", price: 429, images: IMG_SETS.whites, category: BT, featured: false, tags: ["white","trousers","bottoms","collection:weekend-whites"], inStock: true, stockQuantity: 45, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("White Wide-Leg Trouser",["White","Ivory","Off-White"],429,"WWLT",s,(c,sz)=>{if(c==="Off-White"&&sz==="XS")return 0;return stk(c,sz);}) },
    { name: "White Cotton Midi Dress", description: "Midi dress in heavyweight cotton poplin. Button-front, self-belt, side pockets. Simple and endlessly wearable.", price: 659, images: IMG_SETS.whites, category: DR, featured: true, tags: ["white","cotton","dress","collection:weekend-whites"], inStock: true, stockQuantity: 35, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("White Cotton Midi Dress",["White","Ivory"],659,"WCMD",s,stk) },
    { name: "White Relaxed Blazer", description: "Unlined white blazer in cotton-linen. Notched lapels, patch pockets, single-button closure. Throw it over anything.", price: 789, images: IMG_SETS.whites, category: OW, featured: false, tags: ["white","blazer","outerwear","collection:weekend-whites"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("White Relaxed Blazer",["White","Ivory"],789,"WRB",s,lwk) },
    { name: "White Kurung Moden Set", description: "White kurung moden set in crisp cotton-sateen. Clean lines, Mandarin collar, three-quarter sleeves, A-line skirt.", price: 669, images: IMG_SETS.whites, category: KS, featured: false, tags: ["white","kurung","set","collection:weekend-whites"], inStock: true, stockQuantity: 35, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("White Kurung Moden Set",["White","Ivory"],669,"WKMS",s,stk) },
    { name: "Ivory Kaftan Dress", description: "Easy kaftan dress in ivory cotton voile. Side pockets, bell sleeves, keyhole back. Falls to mid-calf.", price: 549, images: IMG_SETS.whites, category: DR, featured: false, tags: ["white","kaftan","dress","collection:weekend-whites"], inStock: true, stockQuantity: 40, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Ivory Kaftan Dress",["Ivory","White"],549,"IKD",s,(c,sz)=>{if(c==="Ivory"&&sz==="XS")return 0;return stk(c,sz);}) },

    { name: "Black Structured Blazer", description: "Sharp black blazer in cotton-silk with structured shoulders and nipped waist. Peak lapels, flap pockets.", price: 849, images: IMG_SETS.black, category: OW, featured: true, tags: ["black","blazer","outerwear","collection:black-collection"], inStock: true, stockQuantity: 35, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Black Structured Blazer",["Black"],849,"BJB",s,stk) },
    { name: "Black Wide-Leg Trouser", description: "Black wide-leg trouser in fluid viscose-crepe. High-waisted, side pockets, centre crease. Liquid and lengthening.", price: 459, images: IMG_SETS.black, category: BT, featured: false, tags: ["black","trousers","bottoms","collection:black-collection"], inStock: true, stockQuantity: 50, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Black Wide-Leg Trouser",["Black"],459,"BWLT",s,stk) },
    { name: "Black Silk Blouse", description: "Black silk blouse with relaxed fit, hidden button placket, and delicate self-tie neck. Pure silk charmeuse.", price: 389, images: IMG_SETS.black, category: TP, featured: false, tags: ["black","silk","blouse","collection:black-collection"], inStock: true, stockQuantity: 40, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Black Silk Blouse",["Black"],389,"BSB",s,(c,sz)=>{if(sz==="XS")return 0;return stk(c,sz);}) },
    { name: "Black Midi Dress", description: "Black midi dress in stretch-jersey. Mock neck, long sleeves, gentle A-line skirt. Simple and sophisticated.", price: 689, images: IMG_SETS.black, category: DR, featured: true, tags: ["black","dress","midi","collection:black-collection"], inStock: true, stockQuantity: 35, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Black Midi Dress",["Black"],689,"BMD",s,(c,sz)=>{if(sz==="XS"||sz==="XXL")return 0;return stk(c,sz);}) },
    { name: "Black Kurung Moden Set", description: "Modern black kurung set in cotton-crepe. Mandarin collar, A-line skirt. The little black dress of modest dressing.", price: 619, images: IMG_SETS.black, category: KS, featured: false, tags: ["black","kurung","set","collection:black-collection"], inStock: true, stockQuantity: 40, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Black Kurung Moden Set",["Black"],619,"BKMS",s,stk) },
    { name: "Black Jumpsuit", description: "Black jumpsuit in crepe-back satin. Deep V-neck, wide leg, detachable waist tie, zip back.", price: 729, images: IMG_SETS.black, category: DR, featured: false, tags: ["black","jumpsuit","evening","collection:black-collection"], inStock: true, stockQuantity: 25, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Black Jumpsuit",["Black"],729,"BJ",s,lwk) },

    { name: "Office Blazer", description: "Lightweight office blazer in stretch-crepe. Notched lapels, two-button closure, relaxed polished fit. Wrinkle-resistant.", price: 799, images: IMG_SETS.office, category: OW, featured: true, tags: ["office","blazer","outerwear","collection:office-capsule"], inStock: true, stockQuantity: 35, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Office Blazer",["Black","Navy","Ivory"],799,"OB",s,stk) },
    { name: "Straight-Leg Trouser", description: "Tailored straight-leg trouser in wool-blend suiting. Flat front, side pockets, cropped ankle hem.", price: 429, images: IMG_SETS.office, category: BT, featured: false, tags: ["office","trousers","bottoms","collection:office-capsule"], inStock: true, stockQuantity: 45, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Straight-Leg Trouser",["Black","Navy","Ivory"],429,"SLT",s,stk) },
    { name: "Silk Shell Top", description: "Silk shell top with scoop neck and slim fit. Pure silk crepe de chine. Tucks seamlessly into any trouser or skirt.", price: 339, images: IMG_SETS.office, category: TP, featured: false, tags: ["office","silk","top","collection:office-capsule"], inStock: true, stockQuantity: 50, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Silk Shell Top",["Ivory","Black","Blush"],339,"SST",s,stk) },
    { name: "Pencil Midi Dress", description: "Fitted pencil dress in stretch-crepe. Mock neck, back zip, hem slit at back knee. Pairs with the Office Blazer.", price: 659, images: IMG_SETS.office, category: DR, featured: false, tags: ["office","dress","midi","collection:office-capsule"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Pencil Midi Dress",["Black","Navy"],659,"PMD",s,lwk) },
    { name: "Button-Front Poplin Shirt", description: "Classic button-front shirt in crisp poplin. Spread collar, chest pocket, relaxed fit through the body.", price: 359, images: IMG_SETS.office, category: TP, featured: false, tags: ["office","shirt","poplin","collection:office-capsule"], inStock: true, stockQuantity: 55, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Button-Front Poplin Shirt",["White","Ivory","Black"],359,"BFPS",s,stk) },
    { name: "A-Line Midi Skirt", description: "A-line midi skirt in stretch-crepe with elastic waistband. Side pockets. Easy, flattering, endlessly wearable.", price: 389, images: IMG_SETS.office, category: BT, featured: false, tags: ["office","skirt","bottoms","collection:office-capsule"], inStock: true, stockQuantity: 40, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("A-Line Midi Skirt",["Black","Navy","Ivory"],389,"AMS",s,stk) },

    { name: "Floor-Length Evening Gown", description: "Floor-length gown in liquid satin crepe. Cowl neck, concealed side zip, gentle train at back. Minimal, dramatic, unforgettable.", price: 1249, images: IMG_SETS.occasion, category: DR, featured: true, tags: ["occasion","gown","dresses","collection:minimal-occasion-wear"], inStock: true, stockQuantity: 15, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Floor-Length Evening Gown",["Black","Champagne","Navy"],1249,"FLEG",s,lwk) },
    { name: "Sequin Midi Dress", description: "Midi dress with all-over sequins on nude tulle base. Round neck, elbow sleeves, concealed back zip. Subtle shimmer.", price: 899, images: IMG_SETS.occasion, category: DR, featured: false, tags: ["occasion","sequin","dress","collection:minimal-occasion-wear"], inStock: true, stockQuantity: 20, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Sequin Midi Dress",["Black","Champagne","Navy"],899,"SMD",s,(c,sz)=>{if(c==="Champagne"&&sz==="XS")return 0;return lwk(c,sz);}) },
    { name: "Silk Cowl-Neck Dress", description: "Silk charmeuse dress with draped cowl neck and bias-cut skirt. Long sleeves with button cuffs. Pure liquid luxury.", price: 749, images: IMG_SETS.occasion, category: DR, featured: false, tags: ["occasion","silk","dress","collection:minimal-occasion-wear"], inStock: true, stockQuantity: 25, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Silk Cowl-Neck Dress",["Black","Champagne","Navy"],749,"SCND",s,(c,sz)=>{if(c==="Champagne"&&sz==="XS")return 0;return lwk(c,sz);}) },
    { name: "Evening Cape", description: "Dramatic evening cape in double-faced satin. Open front, floor-length, with arm slits. Drapes over bare shoulders or a gown.", price: 659, images: IMG_SETS.occasion, category: OW, featured: true, tags: ["occasion","cape","outerwear","collection:minimal-occasion-wear"], inStock: true, stockQuantity: 20, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Evening Cape",["Black","Champagne"],659,"EC",s,(c,sz)=>{if(sz==="XS"||sz==="XXL")return 0;return[3,6,8,5,2,0][s.indexOf(sz)];}) },
    { name: "Draped Satin Blouse", description: "Satin blouse with draped neckline and blouson sleeves. Hidden button placket. Tucks into skirts or trousers for events.", price: 489, images: IMG_SETS.occasion, category: TP, featured: false, tags: ["occasion","satin","blouse","collection:minimal-occasion-wear"], inStock: true, stockQuantity: 35, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Draped Satin Blouse",["Black","Champagne","Navy"],489,"DSB",s,stk) },
    { name: "Maxi Skirt", description: "Floor-length maxi skirt in crepe-back satin. Elastic waist, side slit. Pairs with the Draped Satin Blouse.", price: 599, images: IMG_SETS.occasion, category: BT, featured: false, tags: ["occasion","skirt","bottoms","collection:minimal-occasion-wear"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Maxi Skirt",["Black","Champagne","Navy"],599,"MSS",s,stk) },

    { name: "Travel Jumpsuit", description: "Wrinkle-resistant jumpsuit in stretch-crepe. Wrap-style bodice, wide leg, elastic waist. Packs flat, wears effortlessly.", price: 679, images: IMG_SETS.travel, category: DR, featured: true, tags: ["travel","jumpsuit","dresses","collection:travel-edit"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Travel Jumpsuit",["Black","Navy","Khaki"],679,"TJ",s,stk) },
    { name: "Wrinkle-Resistant Shirt", description: "Travel-ready shirt in performance cotton with wrinkle-resistant finish. Classic collar, hidden button placket, rollable sleeves.", price: 349, images: IMG_SETS.travel, category: TP, featured: false, tags: ["travel","shirt","tops","collection:travel-edit"], inStock: true, stockQuantity: 55, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Wrinkle-Resistant Shirt",["White","Navy","Camel"],349,"WRS",s,stk) },
    { name: "Packable Trench Coat", description: "Lightweight trench coat in water-repellent cotton. Double-breasted, removable belt, folds into its own carry pouch.", price: 799, images: IMG_SETS.travel, category: OW, featured: false, tags: ["travel","trench","outerwear","collection:travel-edit"], inStock: true, stockQuantity: 25, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Packable Trench Coat",["Khaki","Black","Navy"],799,"PTC",s,(c,sz)=>{if(c==="Navy"&&sz==="XS")return 0;return lwk(c,sz);}) },
    { name: "Comfort Pull-On Pant", description: "Pull-on pant in stretch-crepe with elastic waist, side pockets, straight leg. No zip, no fuss - perfect for travel.", price: 389, images: IMG_SETS.travel, category: BT, featured: false, tags: ["travel","pants","bottoms","collection:travel-edit"], inStock: true, stockQuantity: 50, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Comfort Pull-On Pant",["Black","Navy","Khaki","Camel"],389,"CPOP",s,stk) },
    { name: "Travel Kurung Set", description: "Wrinkle-resist kurung set in stretch-crepe. Mandarin collar top with matching straight-leg pants. Packable and polished.", price: 729, images: IMG_SETS.travel, category: KS, featured: false, tags: ["travel","kurung","set","collection:travel-edit"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Travel Kurung Set",["Black","Navy","Khaki"],729,"TKS",s,stk) },
    { name: "Crossbody Bag", description: "Compact leather crossbody bag with adjustable strap and multiple interior pockets. Fits passport, phone, and essentials.", price: 289, images: IMG_SETS.travel, category: AC, featured: false, tags: ["travel","bag","accessories","collection:travel-edit"], inStock: true, stockQuantity: 40, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: varList("Crossbody Bag",[{name:"Black",price:289,stock:15},{name:"Tan",price:289,stock:12},{name:"Navy",price:289,stock:10}],"CB") },
    { name: "Monochrome Blazer", description: "Blazer in black-and-white houndstooth weave. Notched lapels, structured shoulders, two-button closure. Graphic and timeless.", price: 849, images: IMG_SETS.mono, category: OW, featured: true, tags: ["monochrome","blazer","outerwear","collection:monochrome-series"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Monochrome Blazer",["Black/Ivory"],849,"MB",s,lwk) },
    { name: "Monochrome Trousers", description: "High-waisted trousers in black-and-white checked wool-blend. Wide leg, centre crease, side pockets. Pairs with the Monochrome Blazer.", price: 459, images: IMG_SETS.mono, category: BT, featured: false, tags: ["monochrome","trousers","bottoms","collection:monochrome-series"], inStock: true, stockQuantity: 40, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Monochrome Trousers",["Black/Ivory"],459,"MT",s,stk) },
    { name: "Monochrome Knit Top", description: "Fine-gauge knit top in black and ivory stripes. Boat neck, three-quarter sleeves, relaxed fit. The perfect layering piece.", price: 359, images: IMG_SETS.mono, category: TP, featured: false, tags: ["monochrome","knit","top","collection:monochrome-series"], inStock: true, stockQuantity: 50, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Monochrome Knit Top",["Black/Ivory"],359,"MKT",s,stk) },
    { name: "Monochrome Midi Dress", description: "Midi dress in black-and-white abstract print. Fitted bodice, flared skirt, three-quarter sleeves. A statement in black and white.", price: 699, images: IMG_SETS.mono, category: DR, featured: true, tags: ["monochrome","dress","midi","collection:monochrome-series"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Monochrome Midi Dress",["Black/Ivory"],699,"MMD",s,lwk) },
    { name: "Monochrome Kurung Set", description: "Kurung set in black-and-white woven fabric. Mandarin collar top with A-line skirt. Modern modest dressing in monochrome.", price: 649, images: IMG_SETS.mono, category: KS, featured: false, tags: ["monochrome","kurung","set","collection:monochrome-series"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Monochrome Kurung Set",["Black/Ivory"],649,"MKS",s,stk) },
    { name: "Monochrome Scarf", description: "Lightweight scarf in black and ivory geometric print. 180cm x 70cm. Wear as shawl, tudung styling, or neck accessory.", price: 189, images: IMG_SETS.mono, category: AC, featured: false, tags: ["monochrome","scarf","accessories","collection:monochrome-series"], inStock: true, stockQuantity: 60, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: varList("Monochrome Scarf",[{name:"Black/Ivory",price:189,stock:25},{name:"Black/White",price:189,stock:20}],"MS") },

    { name: "Modern Lace Kebaya Top", description: "Modern kebaya top in delicate French lace over nude satin underlay. Sheer three-quarter sleeves with scalloped edges.", price: 589, images: IMG_SETS.kebayaSet, category: TP, featured: true, tags: ["kebaya","lace","top","collection:kebaya-collection"], inStock: true, stockQuantity: 35, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Modern Lace Kebaya Top",["Ivory","Black","Dusty Rose"],589,"MLKT",s,(c,sz)=>{if(c==="Dusty Rose"&&sz==="XS")return 0;return stk(c,sz);}) },
    { name: "Kebaya Kurung Moden Set", description: "Hybrid of kebaya and kurung - fitted lace kebaya top with full A-line kurung skirt. Sheer lace sleeves. Best of both worlds.", price: 749, images: IMG_SETS.kebayaSet, category: KS, featured: false, tags: ["kebaya","kurung","set","collection:kebaya-collection"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Kebaya Kurung Moden Set",["Ivory","Dusty Rose","Sage"],749,"KKMS",s,stk) },
    { name: "Kebaya Satin Blouse", description: "Sleek kebaya blouse in lustrous satin. Concealed front placket, elbow sleeves, relaxed fit. Drapes elegantly day to night.", price: 479, images: IMG_SETS.kebayaSet, category: TP, featured: false, tags: ["kebaya","satin","blouse","collection:kebaya-collection"], inStock: true, stockQuantity: 40, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Kebaya Satin Blouse",["Ivory","Black","Sage"],479,"KSB",s,stk) },
    { name: "Kebaya Lace Dress", description: "Midi dress in French lace with silk underlay. Fitted bodice, A-line skirt, three-quarter sheer sleeves. Romantic and refined.", price: 1099, images: IMG_SETS.kebayaSet, category: DR, featured: true, tags: ["kebaya","lace","dress","collection:kebaya-collection"], inStock: true, stockQuantity: 20, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Kebaya Lace Dress",["Ivory","Black","Dusty Rose"],1099,"KLD",s,(c,sz)=>{if(c==="Dusty Rose"&&sz==="XS")return 0;return lwk(c,sz);}) },
    { name: "Kebaya Outer Cardigan", description: "Lightweight open-front cardigan in cotton-lace knit. Falls to mid-thigh. Layer over the Kebaya Satin Blouse.", price: 529, images: IMG_SETS.kebayaSet, category: OW, featured: false, tags: ["kebaya","cardigan","outerwear","collection:kebaya-collection"], inStock: true, stockQuantity: 35, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Kebaya Outer Cardigan",["Ivory","Black","Sage"],529,"KOC",s,stk) },
    { name: "Kebaya Peplum Set", description: "Kebaya-inspired peplum set - fitted lace bodice with peplum flare, sheer sleeves, and matching satin skirt.", price: 849, images: IMG_SETS.kebayaSet, category: KS, featured: false, tags: ["kebaya","peplum","set","collection:kebaya-collection"], inStock: true, stockQuantity: 25, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Kebaya Peplum Set",["Ivory","Black","Dusty Rose"],849,"KPS",s,(c,sz)=>{if(c==="Dusty Rose"&&sz==="XS")return 0;return lwk(c,sz);}) },

    { name: "Cashmere-Blend Cardigan", description: "Luxuriously soft cardigan in cashmere-cotton blend. Open front, ribbed trim, relaxed fit. The layer you never want to take off.", price: 689, images: IMG_SETS.neutral, category: OW, featured: true, tags: ["neutral","cashmere","cardigan","collection:soft-neutrals"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Cashmere-Blend Cardigan",["Ivory","Beige","Taupe"],689,"CBC",s,(c,sz)=>{if(c==="Taupe"&&sz==="XS")return 0;return stk(c,sz);}) },
    { name: "Soft Pleated Midi Skirt", description: "Midi skirt with soft knife pleats in fluid crepe. Elastic waist, falls to mid-calf. Moves beautifully with every step.", price: 359, images: IMG_SETS.neutral, category: BT, featured: false, tags: ["neutral","pleated","skirt","collection:soft-neutrals"], inStock: true, stockQuantity: 45, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Soft Pleated Midi Skirt",["Ivory","Beige","Taupe"],359,"SPMS",s,stk) },
    { name: "Neutral Silk Blouse", description: "Silk crepe de chine blouse with hidden button placket and self-tie neck. Relaxed fit. Quiet luxury your wardrobe needs.", price: 329, images: IMG_SETS.neutral, category: TP, featured: false, tags: ["neutral","silk","blouse","collection:soft-neutrals"], inStock: true, stockQuantity: 50, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Neutral Silk Blouse",["Ivory","Beige","Taupe"],329,"NSB",s,stk) },
    { name: "Jersey Maxi Dress", description: "Maxi dress in soft modal-jersey. Round neck, long sleeves, gentle A-line. Falls to the ankle. Dress it up or down.", price: 549, images: IMG_SETS.neutral, category: DR, featured: false, tags: ["neutral","jersey","dress","collection:soft-neutrals"], inStock: true, stockQuantity: 35, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Jersey Maxi Dress",["Ivory","Beige","Taupe"],549,"JMD",s,stk) },
    { name: "Relaxed Trousers", description: "Relaxed-fit trouser in soft crepe with elastic waist and tapered leg. Side pockets. Comfort meets polish.", price: 389, images: IMG_SETS.neutral, category: BT, featured: false, tags: ["neutral","trousers","bottoms","collection:soft-neutrals"], inStock: true, stockQuantity: 45, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Relaxed Trousers",["Ivory","Beige","Taupe"],389,"RT",s,stk) },
    { name: "Neutral Kurung Set", description: "Kurung set in soft ivory crepe. Simple round neckline, three-quarter sleeves, A-line skirt. The foundation piece of your wardrobe.", price: 599, images: IMG_SETS.neutral, category: KS, featured: false, tags: ["neutral","kurung","set","collection:soft-neutrals"], inStock: true, stockQuantity: 35, brand: "Cloudnin3", bestseller: true, newArrival: true, variants: sizeVariants("Neutral Kurung Set",["Ivory","Beige","Taupe"],599,"NKS",s,stk) },

    { name: "Velvet Blazer", description: "Luxurious velvet blazer with relaxed fit. Notched satin lapels, patch pockets, single-button closure. The ultimate evening layer.", price: 899, images: IMG_SETS.evening, category: OW, featured: true, tags: ["evening","velvet","blazer","collection:evening-layering"], inStock: true, stockQuantity: 25, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Velvet Blazer",["Black","Ivory","Navy"],899,"VB",s,(c,sz)=>{if(c==="Ivory"&&sz==="XS")return 0;return lwk(c,sz);}) },
    { name: "Lace Camisole", description: "Delicate camisole in French lace with silk charmeuse underlay. Adjustable spaghetti straps. Wear under the Velvet Blazer or alone.", price: 349, images: IMG_SETS.evening, category: TP, featured: false, tags: ["evening","lace","camisole","collection:evening-layering"], inStock: true, stockQuantity: 40, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Lace Camisole",["Black","Champagne","Navy"],349,"LC",s,stk) },
    { name: "Sequin Wrap Skirt", description: "Wrap-style mini skirt in all-over sequins. Side tie closure, concealed shorts underneath. Party-ready with the Lace Camisole.", price: 529, images: IMG_SETS.evening, category: BT, featured: false, tags: ["evening","sequin","skirt","collection:evening-layering"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Sequin Wrap Skirt",["Black","Champagne"],529,"SWS",s,(c,sz)=>{if(sz==="XS"||sz==="XXL")return 0;return[3,6,8,5,2,0][s.indexOf(sz)];}) },
    { name: "Sheer Duster Coat", description: "Floor-length duster coat in sheer organza. Open front, wide sleeves, falls to ankle. Layer over everything for instant drama.", price: 689, images: IMG_SETS.evening, category: OW, featured: true, tags: ["evening","duster","outerwear","collection:evening-layering"], inStock: true, stockQuantity: 20, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: sizeVariants("Sheer Duster Coat",["Black","Champagne"],689,"SDC",s,(c,sz)=>{if(sz==="XS"||sz==="XXL")return 0;return[3,6,8,4,2,0][s.indexOf(sz)];}) },
    { name: "Embellished Clutch", description: "Evening clutch bag with crystal embellishment on satin. Hard-shell frame, gold-tone chain strap, velvet interior. Fits phone and lipstick.", price: 349, images: IMG_SETS.evening, category: AC, featured: false, tags: ["evening","clutch","accessories","collection:evening-layering"], inStock: true, stockQuantity: 30, brand: "Cloudnin3", bestseller: false, newArrival: true, variants: varList("Embellished Clutch",[{name:"Black Crystal",price:349,stock:10},{name:"Champagne Crystal",price:349,stock:8},{name:"Navy Crystal",price:349,stock:6}],"EC") },
  ]; }

async function main() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) { console.error("Error: .env.local not found"); process.exit(1); }
  const env = loadEnvFile(envPath);
  const uri = env.MONGODB_URI;
  if (!uri) { console.error("Error: MONGODB_URI not set"); process.exit(1); }

  console.log("Connecting to MongoDB...");
  try { await mongoose.connect(uri, { bufferCommands: false }); } catch (err) { console.error("Failed to connect:", err); process.exit(1); }
  console.log("Connected:", mongoose.connection.host);

  const imageMetaSchema = new mongoose.Schema({ url: { type: String, required: true, maxlength: 2000 }, publicId: { type: String, required: true, maxlength: 500 }, format: { type: String, required: true, maxlength: 10 }, width: { type: Number, required: true, min: 0 }, height: { type: Number, required: true, min: 0 }, alt: { type: String, maxlength: 500 } }, { _id: false });
  const variantSchema = new mongoose.Schema({ name: { type: String, required: true, maxlength: 200, trim: true }, sku: { type: String, required: true, maxlength: 200, trim: true }, price: { type: Number, required: true, min: 0.01, max: 999999 }, stock: { type: Number, required: true, min: 0, default: 0 }, images: { type: [imageMetaSchema], default: [] } }, { _id: true });

  const CategoryModel = mongoose.models.Category || mongoose.model("Category", new mongoose.Schema({ name: { type: String, required: true, maxlength: 200, trim: true }, slug: { type: String, required: true, unique: true, maxlength: 200, trim: true }, image: { type: String, default: "", maxlength: 1000 }, description: { type: String, default: "", maxlength: 2000 } }));
  const ProductModel = mongoose.models.Product || mongoose.model("Product", new mongoose.Schema({ name: { type: String, required: true, maxlength: 200, trim: true }, description: { type: String, required: true, maxlength: 5000, trim: true }, price: { type: Number, required: true, min: 0.01, max: 999999 }, category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, images: { type: [String], default: [] }, inStock: { type: Boolean, default: true }, stockQuantity: { type: Number, default: 0, min: 0 }, featured: { type: Boolean, default: false }, tags: { type: [String], default: [] }, variants: { type: [variantSchema], default: [] }, brand: { type: String, default: "", maxlength: 200, trim: true }, ingredients: { type: String, default: "", maxlength: 5000, trim: true }, howToUse: { type: String, default: "", maxlength: 5000, trim: true }, bestseller: { type: Boolean, default: false }, newArrival: { type: Boolean, default: false } }, { timestamps: true }));

  console.log("Clearing existing data...");
  await CategoryModel.deleteMany({});
  await ProductModel.deleteMany({});

  console.log("Creating categories...");
  const catDocs = await CategoryModel.insertMany(categories);
  const catMap: Record<string, string> = {};
  for (const cat of catDocs) { catMap[cat.slug] = cat._id.toString(); console.log("  v "+cat.name); }

  console.log("\nCreating products...");
  const productDatas = createProducts(catMap).map(p => ({...p, variants: p.variants.map(v => ({...v, images: v.images.length ? v.images : p.images.map(u => ({url:u, publicId:u.replace(/[^a-zA-Z0-9]/g,"_"), format:"jpg", width:800, height:1000})) }))}));
  const productDocs = await ProductModel.insertMany(productDatas);

  const totalVariants = productDocs.reduce((s: number, p: any) => s + (p.variants?.length || 0), 0);
  const soldOutVariants = productDocs.reduce((s: number, p: any) => s + (p.variants?.filter((v: any) => v.stock === 0).length || 0), 0);

  console.log("\n=============== CATALOG SUMMARY ===============");
  console.log("Categories:     "+catDocs.length);
  console.log("Products:       "+productDocs.length);
  console.log("Total variants: "+totalVariants);
  console.log("Sold-out vars:  "+soldOutVariants);
  console.log("Featured:       "+productDocs.filter((p: any) => p.featured).length);
  console.log("Bestsellers:    "+productDocs.filter((p: any) => p.bestseller).length);
  console.log("New Arrivals:   "+productDocs.filter((p: any) => p.newArrival).length);

  const collectionTags = [
    "collection:linen-edit","collection:everyday-kurung","collection:tailored-essentials",
    "collection:weekend-whites","collection:black-collection","collection:office-capsule",
    "collection:minimal-occasion-wear","collection:travel-edit","collection:monochrome-series",
    "collection:kebaya-collection","collection:soft-neutrals","collection:evening-layering",
  ];
  console.log("\nCollection breakdown:");
  for (const tag of collectionTags) {
    const count = productDocs.filter((p: any) => p.tags?.includes(tag)).length;
    console.log("  "+tag.replace("collection:","")+": "+count);
  }

  console.log("\nCategory breakdown:");
  for (const cat of catDocs) {
    const count = productDocs.filter((p: any) => p.category.toString() === cat._id.toString()).length;
    console.log("  "+cat.name+": "+count);
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

main().catch((err) => { console.error("Fatal:", err); process.exit(1); });
