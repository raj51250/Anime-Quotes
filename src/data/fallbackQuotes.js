// A small bundled pack so the page never shows empty if the free Animechan
// API is rate-limited (100 req/day) or briefly unreachable. Shape matches
// the API's Quote object exactly, so components don't need to care which
// source a quote came from.

let id = 9000;
const q = (content, anime, character) => ({
  content,
  anime: { id: id++, name: anime },
  character: { id: id++, name: character },
});

export const FALLBACK_QUOTES = [
  q(
    "People's lives don't end when they die, it ends when they lose faith.",
    "Naruto",
    "Itachi Uchiha"
  ),
  q(
    "If you don't take risks, you can't create a future.",
    "One Piece",
    "Monkey D. Luffy"
  ),
  q(
    "Whatever you lose, you'll find it again. But what you throw away you'll never get back.",
    "Fullmetal Alchemist",
    "Kanroji Mitsuri"
  ),
  q(
    "The moment you think of giving up, think of the reason why you held on so long.",
    "Fairy Tail",
    "Natsu Dragneel"
  ),
  q("A lesson without pain is meaningless.", "Fullmetal Alchemist", "Edward Elric"),
  q(
    "Power comes in response to a need, not a desire.",
    "Dragon Ball Z",
    "Goku"
  ),
  q(
    "It's not the world that's messed up, it's those who can't accept themselves.",
    "Tokyo Ghoul",
    "Rize Kamishiro"
  ),
  q(
    "I'll leave tomorrow's problems to tomorrow's me.",
    "Cowboy Bebop",
    "Spike Spiegel"
  ),
  q(
    "Fear is not evil. It tells you what your weakness is.",
    "Fairy Tail",
    "Gildarts Clive"
  ),
  q(
    "The world isn't perfect. But it's there for us, doing the best it can.",
    "Fullmetal Alchemist",
    "Roy Mustang"
  ),
  q(
    "If you don't like your destiny, don't accept it.",
    "Code Geass",
    "Lelouch Lamperouge"
  ),
  q(
    "Hard work is worthless for those that don't believe in themselves.",
    "Naruto",
    "Naruto Uzumaki"
  ),
  q(
    "The world is not beautiful, therefore it is.",
    "Kino's Journey",
    "Kino"
  ),
  q(
    "When you give up, that's when the game ends.",
    "Slam Dunk",
    "Takenori Akagi"
  ),
  q(
    "I am not perfect, but I'm limited edition.",
    "Blue Lock",
    "Yoichi Isagi"
  ),
  q(
    "Being weak is nothing to be ashamed of. Staying weak is.",
    "Fullmetal Alchemist",
    "Fuhrer King Bradley"
  ),
  q(
    "You should enjoy the little detours to the fullest, because that's where you'll find the things more important than what you want.",
    "Kino's Journey",
    "Kino"
  ),
  q(
    "There's no shame in falling down. True shame is to not stand up again.",
    "Fairy Tail",
    "Makarov Dreyar"
  ),
  q(
    "If you can't do something, then don't. Focus on what you can do.",
    "Naruto",
    "Kakashi Hatake"
  ),
  q(
    "A dropout will beat a genius through hard work.",
    "Naruto",
    "Rock Lee"
  ),
  q(
    "Whenever I'm about to give up, I remember all the pain I went through trying to get this far.",
    "One Piece",
    "Monkey D. Luffy"
  ),
  q(
    "Sometimes, the things that may or may not have happened are more important than things that did.",
    "Emma",
    "William J. Ashberry"
  ),
  q(
    "The world is cruel, but also very beautiful.",
    "Attack on Titan",
    "Mikasa Ackerman"
  ),
  q(
    "It's not about whether you can or can't do something. Sometimes you have to take a risk.",
    "One Piece",
    "Nami"
  ),
  q(
    "I want to be the kind of pillar that keeps the house standing.",
    "Demon Slayer",
    "Kyojuro Rengoku"
  ),
];
