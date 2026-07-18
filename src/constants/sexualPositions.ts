export type PositionDifficulty = 'łatwa' | 'średnia' | 'zaawansowana';

export interface SexualPosition {
  id: string;
  name: string;
  description: string;
  difficulty: PositionDifficulty;
  /** Ścieżka do wycinka z arkusza kamasutra-pozycje.jpg */
  image: string;
}

function img(index: number): string {
  return `/pozycje/${String(index).padStart(2, '0')}.png`;
}

/** 35 pozycji = 5 kolumn × 7 wierszy z public/kamasutra-pozycje.jpg */
export const SEXUAL_POSITIONS: SexualPosition[] = [
  {
    id: 'p00',
    name: 'Oralna na stojąco',
    description: 'Jedna osoba stoi, druga klęczy przed nią i stymuluje ustami — ręce na biodrach.',
    difficulty: 'łatwa',
    image: img(0),
  },
  {
    id: 'p01',
    name: 'Oralna leżąca',
    description: 'Osoba na dole leży na plecach z jedną nogą uniesioną; partner/ka klęczy i stymuluje ustami.',
    difficulty: 'łatwa',
    image: img(1),
  },
  {
    id: 'p02',
    name: 'Oralna na czworakach',
    description: 'Jedna osoba klęczy wyprostowana, druga jest na czworakach przed nią twarzą w biodra.',
    difficulty: 'łatwa',
    image: img(2),
  },
  {
    id: 'p03',
    name: 'Pług od tyłu',
    description: 'Osoba na dole ma nogi za głową (jak pług); partner/ka wsuwa się od tyłu na kolanach.',
    difficulty: 'zaawansowana',
    image: img(3),
  },
  {
    id: 'p04',
    name: 'Na brzuchu',
    description: 'Osoba na dole leży płasko na brzuchu; partner/ka klęczy z tyłu i nachyla się nad nią.',
    difficulty: 'łatwa',
    image: img(4),
  },
  {
    id: 'p05',
    name: 'Misjonarska płaska',
    description: 'Oboje leżą: jedna osoba na plecach, druga na niej twarzą w twarz — klasyczna bliskość.',
    difficulty: 'łatwa',
    image: img(5),
  },
  {
    id: 'p06',
    name: 'Na jeźdźca',
    description: 'Osoba na dole leży; partner/ka siedzi na biodrach twarzą do twarzy i prowadzi rytm.',
    difficulty: 'łatwa',
    image: img(6),
  },
  {
    id: 'p07',
    name: 'Nogi w górę',
    description: 'Osoba na dole leży z wysoko uniesionymi nogami; partner/ka klęczy między nimi twarzą w twarz.',
    difficulty: 'średnia',
    image: img(7),
  },
  {
    id: 'p08',
    name: 'Od tyłu (piesek)',
    description: 'Jedna osoba na czworakach, druga klęczy za nią — klasyczna pozycja od tyłu.',
    difficulty: 'łatwa',
    image: img(8),
  },
  {
    id: 'p09',
    name: 'Amazonka odchylona',
    description: 'Osoba na górze tyłem do partnera/ki, odchylona do tyłu z rękami opartymi o nogi.',
    difficulty: 'średnia',
    image: img(9),
  },
  {
    id: 'p10',
    name: 'Amazonka',
    description: 'Osoba na dole leży z ugiętymi kolanami; partner/ka siedzi na biodrach tyłem do twarzy.',
    difficulty: 'średnia',
    image: img(10),
  },
  {
    id: 'p11',
    name: 'Jeździec pochylony',
    description: 'Jak na jeźdźca, ale osoba na górze pochyla tułów do przodu, opierając ręce o klatkę.',
    difficulty: 'łatwa',
    image: img(11),
  },
  {
    id: 'p12',
    name: 'Jeździec z ugiętymi nogami',
    description: 'Osoba na dole ma ugięte kolana; partner/ka siedzi przodem i opiera się rękami.',
    difficulty: 'łatwa',
    image: img(12),
  },
  {
    id: 'p13',
    name: 'Leniwy piesek',
    description: 'Osoba na dole leży na brzuchu; partner/ka klęczy nad nią i wchodzi od tyłu.',
    difficulty: 'łatwa',
    image: img(13),
  },
  {
    id: 'p14',
    name: 'Misjonarska z ugięciem',
    description: 'Misjonarska: osoba na dole ma ugięte kolana, partner/ka leży na niej twarzą w twarz.',
    difficulty: 'łatwa',
    image: img(14),
  },
  {
    id: 'p15',
    name: 'Od tyłu na brzuchu',
    description: 'Osoba na dole leży na brzuchu z ugiętymi nogami; partner/ka klęczy za nią.',
    difficulty: 'łatwa',
    image: img(15),
  },
  {
    id: 'p16',
    name: 'Od tyłu z wyprostem',
    description: 'Jedna osoba na czworakach nisko; druga stoi lub klęczy z tyłu, opierając się o plecy.',
    difficulty: 'średnia',
    image: img(16),
  },
  {
    id: 'p17',
    name: 'Głęboki piesek',
    description: 'Osoba z przodu obniżona na przedramionach; partner/ka nachyla się z tyłu.',
    difficulty: 'średnia',
    image: img(17),
  },
  {
    id: 'p18',
    name: 'Piesek na łokciach',
    description: 'Osoba z przodu na kolanach i łokciach (biodra wyżej); partner/ka klęczy za nią.',
    difficulty: 'łatwa',
    image: img(18),
  },
  {
    id: 'p19',
    name: 'Prone bone',
    description: 'Osoba na dole płasko na brzuchu; partner/ka klęczy z tyłu z tułowiem uniesionym.',
    difficulty: 'łatwa',
    image: img(19),
  },
  {
    id: 'p20',
    name: 'Stojąca od tyłu',
    description: 'Oboje stoją: jedna osoba pochylona w biodrach, druga stoi za nią.',
    difficulty: 'średnia',
    image: img(20),
  },
  {
    id: 'p21',
    name: 'Pochylenie 90°',
    description: 'Stojąca od tyłu z tułowiem zgiętym pod kątem prostym — ręce luźno w dół.',
    difficulty: 'średnia',
    image: img(21),
  },
  {
    id: 'p22',
    name: 'Stojąca z oparciem',
    description: 'Pochylenie na stojąco; partner/ka z tyłu trzyma biodra lub plecy.',
    difficulty: 'średnia',
    image: img(22),
  },
  {
    id: 'p23',
    name: 'Od tyłu stojąco + czworaki',
    description: 'Jedna osoba na czworakach, druga stoi za nią z rękami na biodrach.',
    difficulty: 'średnia',
    image: img(23),
  },
  {
    id: 'p24',
    name: 'Na brzegu',
    description: 'Osoba leży (np. na brzegu łóżka) z nogami w górę; partner/ka stoi między nimi.',
    difficulty: 'średnia',
    image: img(24),
  },
  {
    id: 'p25',
    name: 'Pochylenie stojące',
    description: 'Głębokie pochylenie w biodrach na stojąco; partner/ka stoi blisko z tyłu.',
    difficulty: 'średnia',
    image: img(25),
  },
  {
    id: 'p26',
    name: 'Jeździec wyprostowany',
    description: 'Osoba na górze siedzi prosto na biodrach partnera/ki, twarzą do twarzy.',
    difficulty: 'łatwa',
    image: img(26),
  },
  {
    id: 'p27',
    name: 'Misjonarska z nogą',
    description: 'Misjonarska: jedna noga osoby na dole uniesiona, partner/ka między biodrami.',
    difficulty: 'średnia',
    image: img(27),
  },
  {
    id: 'p28',
    name: 'Nogi na ramionach',
    description: 'Osoba na dole z nogami podciągniętymi wysoko; partner/ka klęczy i trzyma nogi.',
    difficulty: 'zaawansowana',
    image: img(28),
  },
  {
    id: 'p29',
    name: 'Amazonka wyprostowana',
    description: 'Osoba na górze siedzi prosto tyłem do twarzy partnera/ki (odwrócony jeździec).',
    difficulty: 'średnia',
    image: img(29),
  },
  {
    id: 'p30',
    name: 'Odwrócona (stójka)',
    description: 'Jedna osoba w pozycji głową w dół; partner/ka klęczy i podtrzymuje biodra.',
    difficulty: 'zaawansowana',
    image: img(30),
  },
  {
    id: 'p31',
    name: 'Lotos',
    description: 'Oboje siedzą twarzą w twarz, splatając nogi — bliski uścisk i wspólny rytm.',
    difficulty: 'średnia',
    image: img(31),
  },
  {
    id: 'p32',
    name: 'Misjonarska klęcząca',
    description: 'Osoba na dole leży; partner/ka klęczy między nogami i nachyla się twarzą w twarz.',
    difficulty: 'łatwa',
    image: img(32),
  },
  {
    id: 'p33',
    name: 'Misjonarska z kolanami',
    description: 'Osoba na dole ma kolana podciągnięte do klatki; partner/ka klęczy nad nią.',
    difficulty: 'średnia',
    image: img(33),
  },
  {
    id: 'p34',
    name: 'Taczka',
    description: 'Jedna osoba oparta na rękach (jak taczka); partner/ka stoi z tyłu i trzyma biodra.',
    difficulty: 'zaawansowana',
    image: img(34),
  },
];

export function pickRandomPosition(excludeIds: Set<string> = new Set()): SexualPosition {
  const pool = SEXUAL_POSITIONS.filter((p) => !excludeIds.has(p.id));
  const source = pool.length > 0 ? pool : SEXUAL_POSITIONS;
  return source[Math.floor(Math.random() * source.length)];
}

export function shufflePositions(excludeWinnerId?: string): SexualPosition[] {
  const copy = SEXUAL_POSITIONS.filter((p) => p.id !== excludeWinnerId);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
