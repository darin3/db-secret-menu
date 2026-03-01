export const F = {
  // Fruity
  STRAWBERRY: "Strawberry", RASPBERRY: "Raspberry", BLACKBERRY: "Blackberry",
  BLUEBERRY: "Blueberry", BLUE_RAZ: "Blue Raz", PEACH: "Peach",
  PASSION_FRUIT: "Passion Fruit", POMEGRANATE: "Pomegranate", KIWI: "Kiwi",
  LIME: "Lime", LEMON: "Lemon", ORANGE: "Orange", GRAPEFRUIT: "Grapefruit",
  WATERMELON: "Watermelon", BANANA: "Banana", CHERRY: "Cherry",
  APPLE_SMOOTHIE: "Apple Smoothie Mix", MANGO: "Mango", PINEAPPLE: "Pineapple",
  // Sweet
  WHITE_CHOCOLATE: "White Chocolate", DARK_CHOCOLATE: "Dark Chocolate",
  CHOCOLATE_MAC: "Chocolate Mac", CARAMEL: "Caramel", SALTED_CARAMEL: "Salted Caramel",
  CUPCAKE: "Cupcake", ALMOND: "Almond", HAZELNUT: "Hazelnut",
  ALMOND_ROCA: "Almond Roca", VANILLA: "Vanilla", IRISH_CREAM: "Irish Cream",
  BROWN_BUTTER: "Brown Butter",
  // Spiced
  CINNAMON: "Cinnamon", CHAI: "Chai", PEPPERMINT: "Peppermint",
  CREME_DE_MENTHE: "Creme de Menthe",
  // Other
  COCONUT: "Coconut",
};

export const T = {
  // Floats
  STRAWBERRY_FLOAT: "Strawberry Float", BLUE_RAZ_FLOAT: "Blue Raz Float",
  POMEGRANATE_FLOAT: "Pomegranate Float", BLACKBERRY_FLOAT: "Blackberry Float",
  RASPBERRY_FLOAT: "Raspberry Float", PEACH_FLOAT: "Peach Float",
  UNICORN_BLOOD_FLOAT: "Unicorn Blood Float",
  // Drizzles
  CARAMEL_DRIZZLE: "Caramel Drizzle", DARK_CHOC_DRIZZLE: "Dark Chocolate Drizzle",
  CHOCOLATE_DRIZZLE: "Chocolate Drizzle",
  // Sprinks
  BIRTHDAY_SPRINKS: "Birthday Sprinks", PEPPERMINT_SPRINKS: "Peppermint Sprinks",
  RAW_SUGAR_SPRINKS: "Raw Sugar Sprinks", CINNAMON_SPRINKS: "Cinnamon Sprinks",
  // Other
  CHAI: "Chai", ANY_FRUIT_FLAVOR: "Any Fruit Flavor", SWEET_CREAM: "Sweet Cream",
  CHOCOLATE_MILK: "Chocolate Milk", CHOCOLATE_CRUNCH: "Chocolate Crunch Topping",
  EXTRA_SAUCE: "Extra Sauce", WHITE_COFFEE: "White Coffee",
};

export const allFlavors = d => [...d.flavors, ...(d.toppings || [])];

// "seasonal" | "limited" | "discontinued"
export const FLAVOR_AVAIL = {
  [F.BROWN_BUTTER]: "seasonal",
  [F.CHERRY]: "seasonal",
  [F.PEPPERMINT]: "unavailable",
  [F.PINEAPPLE]: "seasonal",
  [T.CHOCOLATE_CRUNCH]: "seasonal",
};

export const getDrinkAvail = d => {
  if (d.unavailable) return "unavailable";
  if (d.seasonal) return "seasonal";
  if (d.limited) return "limited";
  const all = allFlavors(d);
  for (const f of all) {
    if (FLAVOR_AVAIL[f]) return FLAVOR_AVAIL[f];
  }
  return null;
};

const ALL_DRINKS = [
  { name: "Aftershock™", aka: null, flavors: [F.STRAWBERRY, F.LIME, F.RASPBERRY, F.BLACKBERRY] },
  { name: "Almond Bar", aka: null, flavors: [F.WHITE_CHOCOLATE, F.ALMOND] },
  { name: "Alpine", aka: "Billy Jean, Chris", flavors: [F.WHITE_CHOCOLATE, F.COCONUT] },
  { name: "Apple Patch", aka: "Sour Patch", flavors: [F.POMEGRANATE, F.APPLE_SMOOTHIE] },
  { name: "Aquaberry", aka: null, flavors: [F.STRAWBERRY, F.WATERMELON, F.KIWI, F.BLUE_RAZ] },
  { name: "Astronaut", aka: null, flavors: [F.RASPBERRY, F.BLACKBERRY, F.ALMOND] },
  { name: "Awesome Orange", aka: null, flavors: [F.STRAWBERRY, F.ORANGE, F.LIME] },
  { name: "Banana Bread", aka: null, flavors: [F.HAZELNUT, F.BANANA] },
  { name: "Banana Cream Pie", aka: null, flavors: [F.BANANA, F.WHITE_CHOCOLATE] },
  { name: "Banana Split", aka: null, flavors: [F.VANILLA, F.DARK_CHOCOLATE, F.BANANA] },
  { name: "Birthday Cake", aka: null, flavors: [F.CUPCAKE], toppings: [T.BIRTHDAY_SPRINKS] },
  { name: "Black Forest", aka: null, flavors: [F.DARK_CHOCOLATE, F.CHERRY] },
  { name: "Blackberry Smash", aka: "Bugatti Berry", flavors: [F.BLACKBERRY, F.GRAPEFRUIT] },
  { name: "Blue Oasis", aka: "Ocean Water", flavors: [F.LIME, F.COCONUT, F.BLUE_RAZ] },
  { name: "Bubblegum", aka: null, flavors: [F.STRAWBERRY, F.BANANA, F.VANILLA] },
  { name: "Brown Butter Chocolate Chip", aka: null, flavors: [F.BROWN_BUTTER], toppings: [T.CHOCOLATE_CRUNCH] },
  { name: "Cake Batter", aka: null, flavors: [F.CUPCAKE] },
  { name: "Candy Cane", aka: null, flavors: [F.PEPPERMINT], toppings: [T.PEPPERMINT_SPRINKS] },
  { name: "Cherry Blossom", aka: null, flavors: [F.WHITE_CHOCOLATE, F.CHERRY] },
  { name: "Christmas Morning", aka: null, flavors: [F.WHITE_CHOCOLATE], toppings: [T.CHAI], unavailable: true },
  { name: "Cinnamon Roll", aka: null, flavors: [F.WHITE_CHOCOLATE, F.CINNAMON] },
  { name: "Cocoa Citrus", aka: "B52", flavors: [F.ORANGE, F.IRISH_CREAM] },
  { name: "Cookie", aka: null, flavors: [F.WHITE_CHOCOLATE, F.CHOCOLATE_MAC] },
  { name: "Cookie Crave", aka: "Cookie Monster", flavors: [F.DARK_CHOCOLATE, F.CHOCOLATE_MAC] },
  { name: "Cookies & Cream", aka: null, flavors: [F.WHITE_CHOCOLATE], toppings: [T.DARK_CHOC_DRIZZLE, T.WHITE_COFFEE] },
  { name: "Coral Reef", aka: null, flavors: [F.VANILLA, F.ORANGE], toppings: [T.BLUE_RAZ_FLOAT] },
  { name: "Cotton Candy", aka: null, flavors: [F.WHITE_CHOCOLATE, F.BLUE_RAZ] },
  { name: "Countdown", aka: "White Russian, Chuck Norris", flavors: [F.WHITE_CHOCOLATE, F.IRISH_CREAM] },
  { name: "Crazy Banana", aka: "Ba-Nay-Nay, Funky Monkey", flavors: [F.DARK_CHOCOLATE, F.BANANA] },
  { name: "Cutie", aka: "Creamsicle", flavors: [F.WHITE_CHOCOLATE, F.ORANGE] },
  { name: "Dinosaur Egg", aka: null, flavors: [F.BLUE_RAZ], toppings: [T.UNICORN_BLOOD_FLOAT] },
  { name: "Dirty Caterpillar", aka: null, flavors: [F.CARAMEL, F.APPLE_SMOOTHIE] },
  { name: "Double Chocolate Mocha", aka: null, flavors: [F.DARK_CHOCOLATE], toppings: [T.EXTRA_SAUCE, T.CHOCOLATE_MILK] },
  { name: "Double Rainbro™", aka: null, flavors: [F.PEACH, F.STRAWBERRY, F.COCONUT] },
  { name: "Dragon Slayer", aka: null, flavors: [F.RASPBERRY, F.BLUE_RAZ], toppings: [T.BLACKBERRY_FLOAT] },
  { name: "Dreamweaver", aka: null, flavors: [F.HAZELNUT, F.WHITE_CHOCOLATE] },
  { name: "Dutch Canyon", aka: "Grand Canyon", flavors: [F.WHITE_CHOCOLATE, F.DARK_CHOCOLATE, F.CHOCOLATE_MAC], toppings: [T.CARAMEL_DRIZZLE] },
  { name: "Dutch Crunch", aka: "Captain Crunch", flavors: [F.STRAWBERRY, F.HAZELNUT] },
  { name: "Dutch Mojito", aka: null, flavors: [F.COCONUT, F.LIME, F.CREME_DE_MENTHE] },
  { name: "Eclipse", aka: null, flavors: [F.PEACH, F.PASSION_FRUIT], toppings: [T.BLUE_RAZ_FLOAT, T.BLACKBERRY_FLOAT] },
  { name: "Electric Berry®", aka: null, flavors: [F.LIME, F.BLUE_RAZ] },
  { name: "Fire Lizard", aka: null, flavors: [F.STRAWBERRY, F.ORANGE, F.BANANA] },
  { name: "Firestorm", aka: "Tricky Tre", flavors: [F.PEACH, F.ORANGE] },
  { name: "Flapjack", aka: null, flavors: [F.SALTED_CARAMEL, F.VANILLA, F.WHITE_CHOCOLATE] },
  { name: "French Vanilla Bean", aka: null, flavors: [F.VANILLA, F.CARAMEL] },
  { name: "Fruit Punch", aka: null, flavors: [F.CHERRY, F.PINEAPPLE, F.ORANGE] },
  { name: "Galaxy Fish", aka: "SLP", flavors: [F.STRAWBERRY, F.LIME, F.PASSION_FRUIT] },
  { name: "Gem Berry", aka: null, flavors: [F.RASPBERRY, F.BLACKBERRY, F.VANILLA] },
  { name: "German Chocolate", aka: null, flavors: [F.DARK_CHOCOLATE, F.CARAMEL, F.COCONUT] },
  { name: "Golden Eagle", aka: null, flavors: [F.CARAMEL, F.VANILLA], toppings: [T.CARAMEL_DRIZZLE] },
  { name: "Green Monster", aka: null, flavors: [F.LIME, F.KIWI, F.CREME_DE_MENTHE] },
  { name: "Kinda Grape", aka: "Grape", flavors: [F.PASSION_FRUIT, F.BLUE_RAZ, F.STRAWBERRY] },
  { name: "Kool Blue", aka: null, flavors: [F.WATERMELON, F.BLUE_RAZ] },
  { name: "Grasshopper", aka: "Thin Mint", flavors: [F.DARK_CHOCOLATE, F.CREME_DE_MENTHE] },
  { name: "Gummy Bear", aka: null, flavors: [F.WHITE_CHOCOLATE, F.LIME, F.KIWI] },
  { name: "Hawaiian", aka: null, flavors: [F.PEACH, F.STRAWBERRY, F.ORANGE, F.BANANA] },
  { name: "Hopscotch", aka: null, flavors: [F.SALTED_CARAMEL, F.CARAMEL], toppings: [T.CARAMEL_DRIZZLE] },
  { name: "Horchata", aka: null, flavors: [F.WHITE_CHOCOLATE, F.CINNAMON, F.CARAMEL] },
  { name: "Hummingbird", aka: "Jungle Love", flavors: [F.POMEGRANATE, F.PASSION_FRUIT] },
  { name: "Hyperchrome", aka: "OPP", flavors: [F.ORANGE, F.POMEGRANATE, F.PASSION_FRUIT] },
  { name: "Jelly Donut", aka: null, flavors: [F.SALTED_CARAMEL, F.RASPBERRY, F.ALMOND] },
  { name: "Johnny Rancher", aka: "Jolly Rancher", flavors: [F.STRAWBERRY, F.APPLE_SMOOTHIE] },
  { name: "Kick Flip", aka: "Laser Flip", flavors: [F.COCONUT, F.RASPBERRY], toppings: [T.BLUE_RAZ_FLOAT] },
  { name: "Laser Cat", aka: null, flavors: [F.COCONUT, F.RASPBERRY] },
  { name: "Lowki", aka: "Kings Of Leon", flavors: [F.ORANGE, F.LIME, F.KIWI] },
  { name: "Luv Bug", aka: "PBR", flavors: [F.POMEGRANATE, F.RASPBERRY, F.BLACKBERRY] },
  { name: "Mad Moose", aka: "Harley Kickstart", flavors: [F.IRISH_CREAM, F.DARK_CHOCOLATE] },
  { name: "Majestic Forest", aka: null, flavors: [F.KIWI, F.BLACKBERRY, F.BLUE_RAZ] },
  { name: "Marmalade", aka: null, flavors: [F.STRAWBERRY, F.ORANGE, F.GRAPEFRUIT] },
  { name: "Merry Berry", aka: "Triple Berry", flavors: [F.STRAWBERRY, F.RASPBERRY, F.BLACKBERRY] },
  { name: "Midnight", aka: null, flavors: [F.POMEGRANATE, F.BLACKBERRY] },
  { name: "Mint Patty", aka: "JR Mint", flavors: [F.PEPPERMINT, F.DARK_CHOCOLATE] },
  { name: "Molten Lava", aka: null, flavors: [F.CINNAMON, F.DARK_CHOCOLATE] },
  { name: "Mystery Pop", aka: "Tootsie Pop", flavors: [F.CHOCOLATE_MAC], toppings: [T.ANY_FRUIT_FLAVOR] },
  { name: "Ninja", aka: null, flavors: [F.WHITE_CHOCOLATE, F.CREME_DE_MENTHE] },
  { name: "Nirvana", aka: null, flavors: [F.IRISH_CREAM, F.DARK_CHOCOLATE, F.CARAMEL] },
  { name: "OG Gummy Bear", aka: null, flavors: [F.POMEGRANATE, F.PASSION_FRUIT, F.GRAPEFRUIT, F.WATERMELON] },
  { name: "Oh Peach", aka: "Peach-O", flavors: [F.PEACH, F.WATERMELON, F.COCONUT] },
  { name: "Orangesicle", aka: "50/50 Bar", flavors: [F.VANILLA, F.ORANGE] },
  { name: "Palm Beach", aka: null, flavors: [F.PEACH, F.POMEGRANATE] },
  { name: "Palm Tree", aka: null, flavors: [F.POMEGRANATE, F.PASSION_FRUIT, F.LIME] },
  { name: "Passion Water", aka: null, flavors: [F.WATERMELON, F.PASSION_FRUIT] },
  { name: "Peach Cobbler", aka: null, flavors: [F.PEACH, F.WHITE_CHOCOLATE, F.CHOCOLATE_MAC] },
  { name: "Peach Ring", aka: null, flavors: [F.PASSION_FRUIT, F.WHITE_CHOCOLATE], toppings: [T.PEACH_FLOAT] },
  { name: "Peppermint Bark", aka: null, flavors: [F.WHITE_CHOCOLATE, F.PEPPERMINT, F.DARK_CHOCOLATE] },
  { name: "Pink Flamingo", aka: null, flavors: [F.PEACH, F.STRAWBERRY, F.WHITE_CHOCOLATE] },
  { name: "Polar Berry", aka: "Freedom", flavors: [F.VANILLA], toppings: [T.BLUE_RAZ_FLOAT, T.RASPBERRY_FLOAT] },
  { name: "Popstar", aka: "Otterpop", flavors: [F.ORANGE, F.PASSION_FRUIT, F.ALMOND] },
  { name: "Radberry", aka: "Oil Spill", flavors: [F.RASPBERRY, F.BLUE_RAZ] },
  { name: "Ray Of Sunshine", aka: null, flavors: [F.BLACKBERRY, F.GRAPEFRUIT, F.PEACH] },
  { name: "Red White And Blue", aka: null, flavors: [F.WHITE_CHOCOLATE, F.RASPBERRY, F.BLUE_RAZ] },
  { name: "Rocky Point", aka: null, flavors: [F.PEACH, F.ORANGE, F.COCONUT, F.BLACKBERRY] },
  { name: "Rose City", aka: null, flavors: [F.STRAWBERRY, F.PEACH] },
  { name: "Sand Castle", aka: "Fleck", flavors: [F.WHITE_CHOCOLATE, F.COCONUT, F.HAZELNUT] },
  { name: "Scarecrow", aka: "Snickers", flavors: [F.HAZELNUT, F.DARK_CHOCOLATE, F.CARAMEL] },
  { name: "Scuba Diver", aka: "Scooby Snack", flavors: [F.WHITE_CHOCOLATE, F.KIWI] },
  { name: "Seashell", aka: "Islander", flavors: [F.VANILLA, F.CHOCOLATE_MAC, F.COCONUT] },
  { name: "Shark Attack™", aka: null, flavors: [F.LIME, F.COCONUT, F.BLUE_RAZ], toppings: [T.POMEGRANATE_FLOAT] },
  { name: "Shenanigan", aka: "Nutty Irishman", flavors: [F.IRISH_CREAM, F.HAZELNUT] },
  { name: "Sherbet", aka: null, flavors: [F.ORANGE, F.PASSION_FRUIT], toppings: [T.SWEET_CREAM, T.STRAWBERRY_FLOAT] },
  { name: "Shipwreck", aka: "Irie", flavors: [F.COCONUT, F.BANANA] },
  { name: "Snickerdoodle", aka: null, flavors: [F.WHITE_CHOCOLATE, F.CINNAMON, F.CHOCOLATE_MAC], toppings: [T.CINNAMON_SPRINKS] },
  { name: "Starry Night", aka: null, flavors: [F.BLACKBERRY, F.BLUE_RAZ] },
  { name: "Stop Light", aka: null, flavors: [F.KIWI, F.POMEGRANATE, F.PASSION_FRUIT] },
  { name: "Strawberry Vanilla", aka: null, flavors: [F.STRAWBERRY, F.VANILLA] },
  { name: "Sugar Cookie", aka: null, flavors: [F.CUPCAKE, F.VANILLA], toppings: [T.RAW_SUGAR_SPRINKS] },
  { name: "Sunburst", aka: "Starburst", flavors: [F.WHITE_CHOCOLATE, F.ALMOND], toppings: [T.ANY_FRUIT_FLAVOR] },
  { name: "Surfside", aka: "The Bob, Bob Marley", flavors: [F.DARK_CHOCOLATE, F.COCONUT, F.BANANA] },
  { name: "Sweet Sunrise", aka: null, flavors: [F.PEACH, F.ORANGE, F.PASSION_FRUIT, F.BANANA] },
  { name: "Sweetie Pebbles", aka: null, flavors: [F.VANILLA, F.CHERRY] },
  { name: "Tiger's Blood", aka: null, flavors: [F.COCONUT, F.STRAWBERRY] },
  { name: "Toasted Mellow", aka: "Vanilla Bean", flavors: [F.VANILLA, F.CHOCOLATE_MAC] },
  { name: "Trail Mix", aka: "Nutella", flavors: [F.DARK_CHOCOLATE, F.CHOCOLATE_MAC, F.ALMOND] },
  { name: "Trifecta", aka: null, flavors: [F.WHITE_CHOCOLATE, F.DARK_CHOCOLATE, F.CARAMEL] },
  { name: "Triple P", aka: null, flavors: [F.POMEGRANATE, F.PEACH, F.PASSION_FRUIT] },
  { name: "Trixie", aka: "Pixie Stick", flavors: [F.ORANGE, F.POMEGRANATE, F.ALMOND] },
  { name: "Tropical", aka: null, flavors: [F.PASSION_FRUIT, F.BLUE_RAZ, F.COCONUT] },
  { name: "Tuxedo", aka: null, flavors: [F.WHITE_CHOCOLATE, F.DARK_CHOCOLATE] },
  { name: "Unicorn Blood", aka: null, flavors: [F.ALMOND, F.STRAWBERRY, F.WHITE_CHOCOLATE] },
  { name: "Unwind", aka: "Wallaby", flavors: [F.CARAMEL, F.CHOCOLATE_MAC, F.DARK_CHOCOLATE] },
  { name: "Vampire Slayer", aka: null, flavors: [F.POMEGRANATE, F.STRAWBERRY] },
  { name: "Werewolf", aka: "Reeses", flavors: [F.SALTED_CARAMEL, F.HAZELNUT, F.DARK_CHOCOLATE] },
  { name: "White Mocha", aka: null, flavors: [F.WHITE_CHOCOLATE], toppings: [T.CHOCOLATE_MILK] },
  { name: "White Zombie", aka: null, flavors: [F.WHITE_CHOCOLATE, F.VANILLA] },
  { name: "Yeti", aka: "White Angel", flavors: [F.WHITE_CHOCOLATE, F.COCONUT, F.VANILLA] },
];

export const DRINKS = ALL_DRINKS.filter(d => getDrinkAvail(d) !== "unavailable");

export const SPECIAL = ["Float", "Drizzle", "Sprinks", "Any Fruit", "Sweet Cream", "Chocolate Milk", "Topping", "Sauce", "White Coffee"];
export const isCoreFlavor = f => !SPECIAL.some(s => f.includes(s));
const coreFlavorSet = new Set();
DRINKS.forEach(d => d.flavors.forEach(f => coreFlavorSet.add(f)));
export const ALL_CORE_FLAVORS = [...coreFlavorSet].sort();

export const FRUITY = [F.STRAWBERRY, F.RASPBERRY, F.BLACKBERRY, F.BLUEBERRY, F.BLUE_RAZ, F.PEACH, F.PASSION_FRUIT, F.POMEGRANATE, F.KIWI, F.LIME, F.LEMON, F.ORANGE, F.GRAPEFRUIT, F.WATERMELON, F.BANANA, F.CHERRY, F.APPLE_SMOOTHIE, F.MANGO, F.PINEAPPLE];
export const SWEET = [F.WHITE_CHOCOLATE, F.DARK_CHOCOLATE, F.CHOCOLATE_MAC, F.CARAMEL, F.SALTED_CARAMEL, F.CUPCAKE, F.ALMOND, F.HAZELNUT, F.ALMOND_ROCA, F.VANILLA, F.IRISH_CREAM, F.BROWN_BUTTER];
export const SPICED = [F.CINNAMON, F.CHAI, F.PEPPERMINT, F.CREME_DE_MENTHE];
export const MINTY_SPICED = [F.CINNAMON, F.CHAI, F.PEPPERMINT, F.CREME_DE_MENTHE];
export const TROPICAL_FLAVORS = [F.COCONUT, F.BANANA, F.PASSION_FRUIT, F.KIWI, F.WATERMELON, F.BLUE_RAZ, F.LIME, F.PINEAPPLE, F.MANGO];

// Chai / Hot Cocoa affinity scoring — these are warm non-coffee bases at Dutch Bros.
// Scores reflect how well each flavor complements chai or hot cocoa.
const CHAI_AFFINITY = {
  [F.CINNAMON]: 3, [F.VANILLA]: 3,
  [F.CARAMEL]: 2, [F.SALTED_CARAMEL]: 2, [F.HAZELNUT]: 2, [F.PEPPERMINT]: 2, [F.CREME_DE_MENTHE]: 2,
  [F.DARK_CHOCOLATE]: 2,
  [F.WHITE_CHOCOLATE]: 1, [F.ALMOND]: 1, [F.CHOCOLATE_MAC]: 1, [F.IRISH_CREAM]: 1,
  [F.COCONUT]: 1, [F.CUPCAKE]: 1, [F.BROWN_BUTTER]: 2,
};
export const chaiAffinityScore = (d) => {
  return d.flavors.reduce((sum, f) => sum + (CHAI_AFFINITY[f] || 0), 0);
};

export const FLAVOR_COLORS = {
  [F.STRAWBERRY]: "#E84393", [F.RASPBERRY]: "#D63031", [F.BLACKBERRY]: "#6C5CE7", [F.BLUE_RAZ]: "#0984E3",
  [F.PEACH]: "#FABB51", [F.PASSION_FRUIT]: "#E17055", [F.POMEGRANATE]: "#C0392B", [F.KIWI]: "#7BED9F",
  [F.LIME]: "#2ED573", [F.ORANGE]: "#FF9F43", [F.GRAPEFRUIT]: "#F8A5C2", [F.WATERMELON]: "#FF6B81",
  [F.BANANA]: "#F6E58D", [F.CHERRY]: "#DC143C", [F.COCONUT]: "#00D2D3", [F.APPLE_SMOOTHIE]: "#6AB04C", [F.MANGO]: "#FFB142", [F.PINEAPPLE]: "#FFD93D",
  [F.WHITE_CHOCOLATE]: "#F5F0E1", [F.DARK_CHOCOLATE]: "#967259", [F.CHOCOLATE_MAC]: "#DEB887",
  [F.CARAMEL]: "#D4A259", [F.SALTED_CARAMEL]: "#C49A52", [F.CUPCAKE]: "#FF9FF3",
  [F.ALMOND]: "#DCCBB7", [F.HAZELNUT]: "#D2956B", [F.ALMOND_ROCA]: "#B8860B", [F.VANILLA]: "#F3E9DC", [F.BROWN_BUTTER]: "#B8915A",
  [F.CINNAMON]: "#D35400", [F.CHAI]: "#C48A2A", [F.IRISH_CREAM]: "#C9B99A", [F.PEPPERMINT]: "#00E676",
  [F.CREME_DE_MENTHE]: "#00C853", [T.WHITE_COFFEE]: "#D7CCC8",
};

export const VIBE_OVERRIDES = {
  "Banana Split": "indulgent", "Banana Cream Pie": "indulgent", "Double Chocolate Mocha": "indulgent",
  "German Chocolate": "indulgent", "Dutch Canyon": "indulgent", "Cookies & Cream": "indulgent",
  "Trail Mix": "indulgent", "Trifecta": "indulgent", "Tuxedo": "indulgent", "Scarecrow": "indulgent",
  "Unwind": "indulgent", "Werewolf": "indulgent", "Nirvana": "indulgent", "Cookie Crave": "indulgent",
  "Surfside": "indulgent", "Crazy Banana": "indulgent", "Black Forest": "indulgent",
  "Hopscotch": "sweet", "Birthday Cake": "sweet", "Cake Batter": "sweet", "Sugar Cookie": "sweet",
  "Cotton Candy": "sweet", "White Zombie": "sweet", "Bubblegum": "sweet", "Almond Bar": "sweet",
  "Dreamweaver": "sweet", "Cookie": "sweet", "Toasted Mellow": "sweet", "Seashell": "sweet",
  "Alpine": "sweet", "Yeti": "sweet", "Golden Eagle": "sweet", "Strawberry Vanilla": "sweet",
  "Flapjack": "cozy", "Horchata": "cozy", "Cinnamon Roll": "cozy", "Snickerdoodle": "cozy",
  "Molten Lava": "cozy", "Mad Moose": "cozy", "Countdown": "cozy",
  "Shenanigan": "cozy", "Christmas Morning": "cozy",
  "Hawaiian": "tropical", "Sweet Sunrise": "tropical", "Rocky Point": "tropical",
  "OG Gummy Bear": "tropical", "Tropical": "tropical", "Aquaberry": "tropical",
  "Shark Attack™": "tropical", "Blue Oasis": "tropical", "Double Rainbro™": "tropical",
  "Eclipse": "tropical", "Oh Peach": "tropical",
  "Fire Lizard": "fruity", "Dirty Caterpillar": "fusion", "Peach Cobbler": "fusion",
  "Pink Flamingo": "fusion", "Unicorn Blood": "fusion", "Gummy Bear": "fusion",
  "Cutie": "fusion", "Coral Reef": "fusion", "Orangesicle": "fusion",
  "Red White And Blue": "fusion", "Cherry Blossom": "fusion", "Sweetie Pebbles": "fusion",
  "Dutch Mojito": "tropical", "Green Monster": "fruity", "Ninja": "sweet",
  "Polar Berry": "fruity", "Banana Bread": "cozy", "Mystery Pop": "fusion",
  "Sunburst": "fusion", "Sand Castle": "sweet",
};

export const getDrinkVibe = d => {
  if (VIBE_OVERRIDES[d.name]) return VIBE_OVERRIDES[d.name];
  const core = d.flavors;
  const tropCount = core.filter(f => TROPICAL_FLAVORS.includes(f)).length;
  const coconutBonus = core.includes(F.COCONUT) ? 1 : 0; // Coconut counts double
  const tropScore = tropCount + coconutBonus;
  const nonTropFruitCount = core.filter(f => FRUITY.includes(f) && !TROPICAL_FLAVORS.includes(f)).length;
  const totalFruitish = tropCount + nonTropFruitCount;
  const sweetCount = core.filter(f => SWEET.includes(f)).length;
  const spiceCount = core.filter(f => SPICED.includes(f)).length;
  if (spiceCount > 0 && sweetCount > 0) return "cozy";
  if (spiceCount > 0) return "cozy";
  if (totalFruitish > 0 && sweetCount > 0) return "fusion";
  if (totalFruitish >= 2) return tropScore > nonTropFruitCount ? "tropical" : "fruity";
  if (sweetCount >= 2) return "indulgent";
  if (totalFruitish === 1) return "fruity";
  if (sweetCount === 1) return "sweet";
  return "sweet";
};

const LATTE_UNFRIENDLY = [F.LIME, F.KIWI, F.POMEGRANATE, F.PASSION_FRUIT];

export const getDrinkBaseCategory = d => {
  const hasChai = d.flavors.includes(F.CHAI) || (d.toppings || []).includes(T.CHAI);
  const hasWhiteCoffee = (d.toppings || []).includes(T.WHITE_COFFEE);
  const vibe = getDrinkVibe(d);

  if (hasChai || hasWhiteCoffee || ["cozy", "indulgent", "sweet"].includes(vibe)) {
    return ["coffee"];
  } else if (["tropical", "fruity"].includes(vibe)) {
    return ["rebel"];
  } else if (vibe === "fusion") {
    const hasFloat = (d.toppings || []).some(f => f.includes("Float"));
    const hasLatteUnfriendly = d.flavors.some(f => LATTE_UNFRIENDLY.includes(f));
    if (hasFloat || hasLatteUnfriendly) {
      return ["rebel"];
    }
    return ["coffee", "rebel"];
  }
  return ["coffee"];
};

// Removed emojis, mapping them in UI layer
export const VIBE_META = {
  tropical: { label: "Tropical", color: "#2ED573" },
  fruity: { label: "Fruity", color: "#FF6B6B" },
  fusion: { label: "Fusion", color: "#00CEC9" },
  indulgent: { label: "Indulgent", color: "#EAB543" },
  sweet: { label: "Sweet", color: "#FF9FF3" },
  cozy: { label: "Cozy", color: "#FF8E53" },
};
export const ACTIVE_VIBES = Object.keys(VIBE_META);

export const MOOD_QUESTIONS = [
  {
    id: "base",
    q: "What's your base vibe today?",
    options: [
      { id: "coffee", label: "Latte / Freeze / Shake", icon: "coffee", filter: d => { const v = getDrinkVibe(d); return ["cozy", "indulgent", "sweet", "fusion"].includes(v); } },
      { id: "rebel", label: "Rebel / Lemonade / Tea / Soda", icon: "zap", filter: d => { const v = getDrinkVibe(d); return ["tropical", "fruity", "fusion"].includes(v); } },
      { id: "chai", label: "Chai / Hot Cocoa", icon: "leaf", filter: null, scorer: chaiAffinityScore },
      { id: "any_base", label: "Not sure, surprise me", icon: "any", filter: null },
    ]
  },
  {
    id: "profile",
    q: "What flavor profile hits the spot?",
    options: [
      {
        id: "choc", label: "Chocolate", icon: "chocolate",
        filter: d => d.flavors.some(f => [F.DARK_CHOCOLATE, F.WHITE_CHOCOLATE, F.CHOCOLATE_MAC].includes(f)),
        scorer: d => d.flavors.filter(f => [F.DARK_CHOCOLATE, F.WHITE_CHOCOLATE, F.CHOCOLATE_MAC].includes(f)).length
      },
      {
        id: "caramel", label: "Caramel & Vanilla", icon: "caramel",
        filter: d => d.flavors.some(f => [F.CARAMEL, F.SALTED_CARAMEL, F.VANILLA, F.HAZELNUT, F.ALMOND].includes(f)),
        scorer: d => d.flavors.filter(f => [F.CARAMEL, F.SALTED_CARAMEL, F.VANILLA, F.HAZELNUT, F.ALMOND].includes(f)).length
      },
      {
        id: "fruity", label: "Fruit & Citrus", icon: "fruity",
        filter: d => d.flavors.some(f => FRUITY.includes(f)),
        scorer: d => d.flavors.filter(f => FRUITY.includes(f) || f === F.COCONUT).length
      },
      {
        id: "mint", label: "Mint or Spice", icon: "mint",
        filter: d => d.flavors.some(f => MINTY_SPICED.includes(f)),
        scorer: d => d.flavors.filter(f => MINTY_SPICED.includes(f)).length
      },
      { id: "any_profile", label: "Anything goes", icon: "any", filter: null },
    ]
  },
  // We'll define a function to return the 3rd question dynamically based on previous answers
];

export const getThirdQuestion = (answers) => {
  const profileAns = answers[1]?.id;
  const baseAns = answers[0]?.id;

  // If they picked a fruity profile OR a rebel base with "anything goes"
  if (profileAns === "fruity" || (baseAns === "rebel" && profileAns === "any_profile")) {
    return {
      id: "fruit_type",
      q: "Any specific fruit flavors?",
      options: [
        {
          label: "Berry (Strawberry, Raspberry, Cherry, Blackberry)", icon: "berry",
          filter: d => d.flavors.some(f => [F.STRAWBERRY, F.RASPBERRY, F.BLACKBERRY, F.BLUE_RAZ, F.CHERRY].includes(f)),
          scorer: d => d.flavors.filter(f => [F.STRAWBERRY, F.RASPBERRY, F.BLACKBERRY, F.BLUE_RAZ, F.CHERRY].includes(f)).length
        },
        {
          label: "Tropical (Coconut, Banana, Passion Fruit, Kiwi)", icon: "coconut",
          filter: d => d.flavors.some(f => [F.COCONUT, F.BANANA, F.PASSION_FRUIT, F.KIWI, F.WATERMELON].includes(f)),
          scorer: d => d.flavors.filter(f => [F.COCONUT, F.BANANA, F.PASSION_FRUIT, F.KIWI, F.WATERMELON].includes(f)).length
        },
        {
          label: "Citrus & Stonefruit (Peach, Orange, Lime, Grapefruit)", icon: "refreshing",
          filter: d => d.flavors.some(f => [F.PEACH, F.ORANGE, F.LIME, F.GRAPEFRUIT, F.POMEGRANATE].includes(f)),
          scorer: d => d.flavors.filter(f => [F.PEACH, F.ORANGE, F.LIME, F.GRAPEFRUIT, F.POMEGRANATE].includes(f)).length
        },
        { label: "Surprise me", icon: "any", filter: null },
      ]
    };
  }

  // Default 3rd question for non-fruity paths
  return {
    id: "complexity",
    q: "How many flavors do you want?",
    options: [
      { label: "Keep it simple (1–2 flavors)", icon: "simple", filter: d => d.flavors.length <= 2 },
      { label: "Multi-layered (3+ flavors)", icon: "layers", filter: d => d.flavors.length >= 3 },
      { label: "Doesn't matter", icon: "any", filter: null },
    ]
  };
};
