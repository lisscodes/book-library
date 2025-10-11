import type { Book } from "../redux/features/books/types";

const myBooks: Book[] = [
  {
    id: 1513,
    title: "Romeo and Juliet",
    authors: [
      {
        name: "Shakespeare, William",
      },
    ],
    subjects: [
      "Conflict of generations -- Drama",
      "Juliet (Fictitious character) -- Drama",
      "Romeo (Fictitious character) -- Drama",
    ],
    formats: {
      "image/jpeg": "https://www.gutenberg.org/cache/epub/1513/pg1513.cover.medium.jpg",
    },
    download_count: 72613,
  },
];

export default myBooks;
