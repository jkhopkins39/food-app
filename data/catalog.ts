import type { Bias } from '@/lib/taste';

export type SampleReview = {
  author: string;
  rating: number;
  text: string;
  avatar?: string;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  latitude: number;
  longitude: number;
  address: string;
  image: string;
  blurb: string;
  about: string;
  tags: string[];
  reviews: SampleReview[];
  bias?: Bias;
  source: 'sample' | 'google';
};

export type Area = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
};

export type Collection = {
  id: string;
  name: string;
  restaurantIds: string[];
};

export type UserReview = {
  id: string;
  restaurantId: string;
  rating: number;
  text: string;
  createdAt: number;
};

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

export const AREAS: Area[] = [
  { id: 'acworth', label: 'Acworth, Georgia', latitude: 34.0668, longitude: -84.6769 },
  { id: 'kennesaw', label: 'Kennesaw, Georgia', latitude: 34.0234, longitude: -84.6155 },
  { id: 'midtown', label: 'Midtown Atlanta', latitude: 33.7892, longitude: -84.3842 },
];

const ken = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80';

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'sushi-bros',
    name: 'Sushi Bros',
    cuisine: 'Sushi Restaurant',
    rating: 4.5,
    latitude: 34.028,
    longitude: -84.6155,
    address: '2520 Cobb Pkwy, Kennesaw, GA',
    image: photo('photo-1579871494447-9811cf80d66c'),
    blurb: 'Fresh hand-made sushi, and a sweet-spicy roll regulars describe in detail.',
    about:
      'Sushi Bros is a sushi and hibachi restaurant located in Kennesaw, Georgia. They specialize in fresh, hand-made sushi and are widely known for their all you can eat specials. Customer reviews say the food is high quality, quick, and affordable.',
    tags: ['Sushi', 'AYCE'],
    bias: { japanese: 1.1, seafood: 0.7, fresh: 0.55, sweet: 0.35, spicy: 0.35, affordable: 0.4, shareable: 0.45 },
    source: 'sample',
    reviews: [
      {
        author: 'Kenneth M.',
        rating: 5,
        avatar: ken,
        text: 'Favorite sushi restaurant of all time. The sweet spicy sushi roll is ridiculous. Literally incredible, can never be just one order.',
      },
      {
        author: 'Priya S.',
        rating: 5,
        text: 'Fresh fish, quick service, and the all you can eat special is actually affordable. The sweet-spicy rolls are the reason we drive over.',
      },
    ],
  },
  {
    id: 'profiro',
    name: "Profiro's",
    cuisine: 'Mexican Kitchen',
    rating: 4.2,
    latitude: 34.0312,
    longitude: -84.6025,
    address: '1480 Ernest Barrett Pkwy, Kennesaw, GA',
    image: photo('photo-1504674900247-0877df9cc836'),
    blurb: 'Shareable platters, fresh salsa, and a little sweet heat.',
    about:
      "Profiro's is a loud, colorful Mexican kitchen. The table fills up with grilled platters, salsa, and avocado, and most reviews talk about coming with a group.",
    tags: ['Mexican', 'Shareable'],
    bias: { mexican: 1, savory: 0.45, fresh: 0.35, shareable: 0.7, spicy: 0.25 },
    source: 'sample',
    reviews: [
      {
        author: 'Alicia R.',
        rating: 4,
        text: 'We ordered a platter for the group. Fresh salsa, a little spicy, and plenty to share. Not fancy, just really good.',
      },
    ],
  },
  {
    id: 'mcd-acworth',
    name: "McDonald's",
    cuisine: 'Burgers',
    rating: 3.8,
    latitude: 34.0694,
    longitude: -84.6732,
    address: '3405 Cobb Pkwy NW, Acworth, GA',
    image: photo('photo-1568901346375-23c9450c58cd'),
    blurb: 'Classic burger, fries, and a very short walk.',
    about: 'A nearby McDonald’s. Reviews talk about the usual comfort burger and fries, fast and familiar.',
    tags: ['Burgers'],
    bias: { american: 1, comfort: 0.8, affordable: 0.7, rich: 0.3 },
    source: 'sample',
    reviews: [
      { author: 'Chris P.', rating: 4, text: 'Classic american burger and fries. Fast food comfort, nothing surprising, always close.' },
    ],
  },
  {
    id: 'mcd-acworth-2',
    name: "McDonald's",
    cuisine: 'Burgers',
    rating: 3.7,
    latitude: 34.0636,
    longitude: -84.6834,
    address: '4150 S Main St, Acworth, GA',
    image: photo('photo-1550547660-d9450f859349'),
    blurb: 'Another quick burger stop on the other side of town.',
    about: 'The Main Street McDonald’s. Same comfort-burger profile, a short drive from downtown Acworth.',
    tags: ['Burgers'],
    bias: { american: 1, comfort: 0.75, affordable: 0.65 },
    source: 'sample',
    reviews: [
      { author: 'Dana L.', rating: 3, text: 'Cheap burger and fries when we do not want to think. Classic american comfort food.' },
    ],
  },
  {
    id: 'taco-acworth',
    name: 'Taco Bell',
    cuisine: 'Fast Mexican',
    rating: 3.6,
    latitude: 34.0578,
    longitude: -84.6688,
    address: '3560 Cobb Pkwy, Acworth, GA',
    image: photo('photo-1565299585323-38d6b0865b47'),
    blurb: 'Mexican and american fusion meets fast food.',
    about: 'A late-night Taco Bell. The menu sits between mexican flavors and american fast food, and it is inexpensive.',
    tags: ['Mexican', 'Fast food'],
    bias: { mexican: 0.8, american: 0.55, affordable: 0.8, comfort: 0.35 },
    source: 'sample',
    reviews: [
      { author: 'Luis G.', rating: 4, text: 'Mexican and american fusion meets fast food. Sweet baja sauce, cheap tacos, open late.' },
    ],
  },
  {
    id: 'roll-theory',
    name: 'Roll Theory',
    cuisine: 'Sushi Restaurant',
    rating: 4.6,
    latitude: 34.0562,
    longitude: -84.6595,
    address: '3900 George Busbee Pkwy, Kennesaw, GA',
    image: photo('photo-1617196034796-73dfa7b1fd56'),
    blurb: 'Sweet-spicy rolls and fresh fish, the kind of sushi people describe twice.',
    about:
      'A smaller sushi counter. Reviews keep coming back to one sweet spicy roll and how fresh the fish tastes compared with the price.',
    tags: ['Sushi'],
    bias: { japanese: 1, seafood: 0.7, fresh: 0.6, sweet: 0.4, spicy: 0.4 },
    source: 'sample',
    reviews: [
      { author: 'Mei T.', rating: 5, text: 'The sweet spicy sushi roll tastes bright and fresh. Best japanese spot if Sushi Bros is packed.' },
    ],
  },
  {
    id: 'naan-clay',
    name: 'Naan & Clay',
    cuisine: 'Indian Restaurant',
    rating: 4.7,
    latitude: 34.0415,
    longitude: -84.638,
    address: '745 Chastain Rd, Kennesaw, GA',
    image: photo('photo-1585937421612-70a008356fbe'),
    blurb: 'Tandoori heat, warm naan, and reviews that mention the spice in detail.',
    about: 'A family Indian dining room. The tandoori and masala are the dishes people describe first, usually with a note about the heat.',
    tags: ['Indian'],
    bias: { indian: 1.1, spicy: 0.7, savory: 0.4 },
    source: 'sample',
    reviews: [
      { author: 'Anika V.', rating: 5, text: 'Proper indian cooking. The tandoori is spicy without being a stunt, and the naan is warm and comforting.' },
    ],
  },
  {
    id: 'green-peach',
    name: 'Green Peach',
    cuisine: 'Healthy Bowls',
    rating: 4.4,
    latitude: 34.0736,
    longitude: -84.6665,
    address: '4760 S Main St, Acworth, GA',
    image: photo('photo-1512621776951-a57141f2eefd'),
    blurb: 'Crisp, fresh bowls that still feel like a meal.',
    about: 'A bowl shop built around greens, grains, and grilled vegetables. Reviews call it fresh and actually filling.',
    tags: ['Healthy'],
    bias: { healthy: 1.1, fresh: 0.8, vegetarian: 0.45 },
    source: 'sample',
    reviews: [
      { author: 'Hannah J.', rating: 4, text: 'Fresh salad, grains, and grilled veggie options. Healthy without tasting like a punishment.' },
    ],
  },
  {
    id: 'sugar-jar',
    name: 'Sugar Jar',
    cuisine: 'Dessert Shop',
    rating: 4.6,
    latitude: 34.0604,
    longitude: -84.6892,
    address: '128 Main St, Acworth, GA',
    image: photo('photo-1551024601-bec78aea704b'),
    blurb: 'Brown-butter cookies and soft serve for a serious sweet tooth.',
    about: 'A tiny dessert counter. People write about the cookies and the sweet, creamy soft serve more than anything else.',
    tags: ['Dessert'],
    bias: { dessert: 1.1, sweet: 1 },
    source: 'sample',
    reviews: [
      { author: 'Elena C.', rating: 5, text: 'Sweet cookie shop. The ice cream is creamy and the pastry case is dangerous. Pure dessert.' },
    ],
  },
  {
    id: 'broth-house',
    name: 'Broth House',
    cuisine: 'Ramen',
    rating: 4.5,
    latitude: 34.0495,
    longitude: -84.671,
    address: '2770 Cobb Pkwy, Kennesaw, GA',
    image: photo('photo-1569718212165-3a8278d5f624'),
    blurb: 'Rich miso ramen that reviews call comfort in a bowl.',
    about: 'A ramen bar with a rich miso broth. It shows up when someone wants japanese food that is warmer than sushi.',
    tags: ['Ramen'],
    bias: { japanese: 0.8, rich: 0.6, comfort: 0.7, savory: 0.45 },
    source: 'sample',
    reviews: [
      { author: 'Owen K.', rating: 5, text: 'Rich miso ramen, savory and comforting. Japanese, but not the fresh sushi kind of japanese.' },
    ],
  },
  {
    id: 'mcd-peachtree',
    name: "McDonald's",
    cuisine: 'Burgers',
    rating: 3.7,
    latitude: 33.7926,
    longitude: -84.3836,
    address: '1100 Peachtree St NE, Atlanta, GA',
    image: photo('photo-1568901346375-23c9450c58cd'),
    blurb: 'A Peachtree burger stop when you are already downtown.',
    about: 'Midtown McDonald’s on Peachtree Street. Fast, familiar, american comfort food.',
    tags: ['Burgers'],
    bias: { american: 1, comfort: 0.7, affordable: 0.6 },
    source: 'sample',
    reviews: [{ author: 'Sam R.', rating: 3, text: 'Burger and fries on Peachtree. Fast food, cheap, classic american comfort.' }],
  },
  {
    id: 'taco-midtown',
    name: 'Taco Bell',
    cuisine: 'Fast Mexican',
    rating: 3.5,
    latitude: 33.7858,
    longitude: -84.3824,
    address: '931 Peachtree St NE, Atlanta, GA',
    image: photo('photo-1551504734-5ee1c4a1479b'),
    blurb: 'Mexican and american fusion meets fast food.',
    about: 'Midtown Taco Bell, a few blocks south on Peachtree.',
    tags: ['Mexican'],
    bias: { mexican: 0.75, american: 0.5, affordable: 0.75 },
    source: 'sample',
    reviews: [{ author: 'Jules P.', rating: 3, text: 'Late night tacos. Mexican flavors, american fast food portions, very affordable.' }],
  },
  {
    id: 'peach-sushi',
    name: 'Peachtree Sushi',
    cuisine: 'Sushi Restaurant',
    rating: 4.4,
    latitude: 33.7908,
    longitude: -84.3864,
    address: '999 Peachtree St NE, Atlanta, GA',
    image: photo('photo-1611143669185-af224c5e3252'),
    blurb: 'Fresh sushi with a sweet spicy roll that midtown reviews keep naming.',
    about: 'A midtown sushi bar. The reviews read a lot like the Kennesaw favorite: fresh fish and one sweet-spicy roll.',
    tags: ['Sushi'],
    bias: { japanese: 1, seafood: 0.65, fresh: 0.5, sweet: 0.3, spicy: 0.3 },
    source: 'sample',
    reviews: [
      { author: 'Nora A.', rating: 5, text: 'Fresh sushi and a sweet spicy roll I would walk back for. Japanese, bright, not heavy.' },
    ],
  },
  {
    id: 'juniper-curry',
    name: 'Juniper Curry',
    cuisine: 'Indian Restaurant',
    rating: 4.6,
    latitude: 33.7846,
    longitude: -84.387,
    address: '800 Peachtree St NE, Atlanta, GA',
    image: photo('photo-1631452180519-c014fe946bc7'),
    blurb: 'Spicy masala and warm naan, a block off Peachtree.',
    about: 'An Indian dining room in midtown. Reviews focus on the curry, the spice, and the naan.',
    tags: ['Indian'],
    bias: { indian: 1, spicy: 0.65, savory: 0.4 },
    source: 'sample',
    reviews: [{ author: 'Rahul D.', rating: 5, text: 'Spicy indian curry, fragrant masala, and naan that arrives still warm.' }],
  },
  {
    id: 'woodruff-grill',
    name: 'Woodruff Grill',
    cuisine: 'American Grill',
    rating: 4.3,
    latitude: 33.788,
    longitude: -84.3806,
    address: '1280 Peachtree St NE, Atlanta, GA',
    image: photo('photo-1544025162-d76694265947'),
    blurb: 'A shareable american grill next to the arts center.',
    about: 'Grilled plates and a long table, the place groups use before a show at the Woodruff Arts Center.',
    tags: ['Grill'],
    bias: { american: 0.8, savory: 0.45, shareable: 0.55, rich: 0.3 },
    source: 'sample',
    reviews: [{ author: 'Claire B.', rating: 4, text: 'Savory grilled american plates made for a group to share before the show.' }],
  },
  {
    id: 'poco-dolce',
    name: 'Poco Dolce',
    cuisine: 'Dessert Shop',
    rating: 4.5,
    latitude: 33.7936,
    longitude: -84.3814,
    address: '1401 Peachtree St NE, Atlanta, GA',
    image: photo('photo-1488477181946-6428a0291777'),
    blurb: 'Sweet pastry and gelato when the rest of the meal was savory.',
    about: 'A pastry case in midtown. Reviews are almost entirely about dessert.',
    tags: ['Dessert'],
    bias: { dessert: 1, sweet: 0.9 },
    source: 'sample',
    reviews: [{ author: 'Imani W.', rating: 5, text: 'Sweet pastry and creamy gelato. A dessert stop, full stop.' }],
  },
];

export const STARTER_COLLECTIONS: Collection[] = [
  { id: 'asian', name: 'Asian', restaurantIds: ['sushi-bros', 'broth-house', 'roll-theory'] },
  { id: 'weeknight', name: 'Weeknight', restaurantIds: ['naan-clay', 'green-peach'] },
  { id: 'bday', name: 'Bday Trip', restaurantIds: ['profiro', 'sugar-jar', 'sushi-bros'] },
];

export const PROFILE_AVATAR =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=480&q=80';

export const FRIEND_AVATARS = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80',
];
