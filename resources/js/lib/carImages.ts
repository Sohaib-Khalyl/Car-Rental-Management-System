/**
 * Maps a car brand/model to a relevant Unsplash image URL.
 * Using a list of curated images to avoid showing the same car for every listing.
 */
export function getCarImage(brand: string, model: string): string {
  const b = (brand || '').toLowerCase();
  const m = (model || '').toLowerCase();

  if (b.includes('mercedes') || m.includes('c-class') || m.includes('e-class') || m.includes('s-class') || m.includes('g-class') || m.includes('glc') || m.includes('gle')) {
    return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('bmw') || m.includes('m3') || m.includes('m5') || m.includes('x5') || m.includes('x3') || m.includes('3 series') || m.includes('5 series')) {
    return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('audi') || m.includes('a4') || m.includes('a6') || m.includes('q5') || m.includes('q7') || m.includes('rs')) {
    return 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('porsche') || m.includes('911') || m.includes('cayenne') || m.includes('macan') || m.includes('panamera') || m.includes('taycan')) {
    return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('land rover') || b.includes('range rover') || m.includes('evoque') || m.includes('defender') || m.includes('discovery') || m.includes('sport')) {
    return 'https://images.unsplash.com/photo-1519003300449-424ad0405076?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('tesla') || m.includes('model s') || m.includes('model 3') || m.includes('model x') || m.includes('model y')) {
    return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('hyundai') || m.includes('tucson') || m.includes('sonata') || m.includes('elantra') || m.includes('santa fe')) {
    return 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('toyota') || m.includes('camry') || m.includes('corolla') || m.includes('land cruiser') || m.includes('rav4') || m.includes('yaris')) {
    return 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('dacia') || m.includes('duster') || m.includes('logan') || m.includes('sandero') || m.includes('jogger')) {
    return 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('renault') || m.includes('clio') || m.includes('megane') || m.includes('kadjar') || m.includes('koleos')) {
    return 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('volkswagen') || b.includes('vw') || m.includes('golf') || m.includes('passat') || m.includes('tiguan') || m.includes('polo')) {
    return 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('honda') || m.includes('civic') || m.includes('accord') || m.includes('cr-v') || m.includes('hrv')) {
    return 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('ford') || m.includes('mustang') || m.includes('f-150') || m.includes('focus') || m.includes('kuga') || m.includes('puma')) {
    return 'https://images.unsplash.com/photo-1612825173281-9a193378527e?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('peugeot') || m.includes('308') || m.includes('3008') || m.includes('5008') || m.includes('208')) {
    return 'https://images.unsplash.com/photo-1591293836027-e05b48473b67?auto=format&fit=crop&q=80&w=800';
  }
  if (b.includes('kia') || m.includes('sportage') || m.includes('sorento') || m.includes('stinger') || m.includes('cerato')) {
    return 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?auto=format&fit=crop&q=80&w=800';
  }

  // Default fallback
  return 'https://images.unsplash.com/photo-1503376760367-1b6121649f87?auto=format&fit=crop&q=80&w=800';
}
