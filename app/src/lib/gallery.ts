/**
 * Galéria-manifeszt.
 *
 * A képek a szalon saját reklámfilmjéből vágott állóképek (1280×720),
 * a film idővonaláról kézzel válogatva. A film 29–30. másodperce eleve
 * fekete-fehér, azt szándékosan kihagytuk.
 *
 * ÚJ KÉP HOZZÁADÁSA: tedd a fájlt a `public/images/gallery/` mappába,
 * és vedd fel ide egy sorral. Az oldalon automatikusan megjelenik.
 */

export type GalleryImage = {
  src: string;
  alt: string;
};

const dir = "/images/gallery";

export const galleryImages: GalleryImage[] = [
  { src: `${dir}/09-ollo-vagas.jpg`, alt: "Precíz hajvágás ollóval és fésűvel" },
  { src: `${dir}/01-hajmosas-felulrol.jpg`, alt: "Hajmosás a mosdótálnál, felülnézetből" },
  { src: `${dir}/16-stilusozas.jpg`, alt: "Széman Dávid stílusozás közben a NOBLE névfala előtt" },
  { src: `${dir}/10-noble-felirat.jpg`, alt: "A NOBLE Barbershop névfala a szalonban" },
  { src: `${dir}/06-hajmosas-mosoly.jpg`, alt: "Elégedett vendég hajmosás közben" },
  { src: `${dir}/14-fade-profil.jpg`, alt: "Kész fade oldalnézetből" },
  { src: `${dir}/03-kezfogas-noble.jpg`, alt: "Kézfogás a vendéggel a NOBLE fal előtt" },
  { src: `${dir}/11-hajszaritas.jpg`, alt: "Hajszárítás és formázás" },
  { src: `${dir}/17-kesz-frizura.jpg`, alt: "A kész frizura profilból" },
  { src: `${dir}/05-hajmosas-vizsugar.jpg`, alt: "Hajmosás meleg vízzel" },
  { src: `${dir}/12-termekpolc.jpg`, alt: "Hajformázó termékek a szalon polcán" },
  { src: `${dir}/13-vendeg-a-szekben.jpg`, alt: "Vendég a barber székben, háttérben a NOBLE névfal" },
  { src: `${dir}/15-pomade.jpg`, alt: "Pomádé a formázáshoz" },
  { src: `${dir}/07-torolkozo.jpg`, alt: "Törölközős kezelés hajmosás után" },
  { src: `${dir}/02-vendeg-portre.jpg`, alt: "Vendég a szalon bejárata előtt" },
  { src: `${dir}/08-david-a-falnal.jpg`, alt: "Széman Dávid a szalonban" },
  { src: `${dir}/04-kave.jpg`, alt: "Kávé a vendégeknek a NOBLE-ben" },
  { src: `${dir}/18-utolso-igazitas.jpg`, alt: "Az utolsó igazítás a frizurán" },
];
