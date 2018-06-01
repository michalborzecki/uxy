module.exports = {
  categories: [
    {
      id: 1,
      name: 'Warzywa',
      words: [2]
    },
    {
      id: 2,
      name: 'Owoce',
      words: [1, 2, 3]
    },
    {
      id: 3,
      name: 'Potrawy',
      words: [4, 5, 6]
    },
    {
      id: 4,
      name: 'Sztuka',
      words: []
    }
  ],
  words: [
    {
      id: 1,
      word: 'Apple',
      imageUrl: "/assets/apple.jpg",
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [2],
      translations: [1, 2],
    },
    {
      id: 2,
      word: 'Banana',
      imageUrl: "/assets/banana.jpg",
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [2, 1],
      translations: [3],
    },
    {
      id: 3,
      word: 'Tangerine',
      imageUrl: "/assets/tangarine.jpg",
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      categories: [2],
      translations: [4],
    },
	{
      id: 4,
      word: 'Apple Pie',
      imageUrl: "/assets/apple-pie.jpg",
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [3],
      translations: [5],
    },
    {
      id: 5,
      word: 'Banana Pie',
      imageUrl: "/assets/banana-pie.jpg",
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: null,
      categories: [3],
      translations: [6],
    },
    {
      id: 6,
      word: 'Tangerine Pie',
      imageUrl: "/assets/tangarine-pie.jpg",
      creationTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      learnedTime: "Sun May 20 2018 00:33:30 GMT+0200 (CEST)",
      categories: [3],
      translations: [7],
    },
  ],
  wordTranslations: [
    {
      id: 1,
      wordId: 1,
      domain: 'ogólne',
      word: 'apple',
      wordTranslation: 'jabłko',
      example: 'zdanie z jabłkiem',
      exampleTranslation: 'Sentence with apple.'
    },
    {
      id: 2,
      wordId: 1,
      domain: 'ogólniejsze',
      word: 'apple',
      wordTranslation: 'jabłko2',
      example: 'inne zdanie z jabłkiem',
      exampleTranslation: 'Another sentence with apple.'
    },
    {
      id: 3,
      wordId: 2,
      domain: 'ogólne',
      word: 'banana',
      wordTranslation: 'banan',
      example: 'zdanie z bananem',
      exampleTranslation: 'Sentence with banana.'
    },
    {
      id: 4,
      wordId: 3,
      domain: 'ogólne',
      word: 'tangerine',
      wordTranslation: 'mandarynka',
      example: 'zdanie z mandarynką',
      exampleTranslation: 'Sentence with tangerine.'
    },
	{
      id: 5,
      wordId: 1,
      domain: 'ogólniejsze',
      word: 'apple',
      wordTranslation: 'jabłko2',
      example: 'inne zdanie z jabłkiem',
      exampleTranslation: 'Another sentence with apple.'
    },
    {
      id: 6,
      wordId: 2,
      domain: 'ogólne',
      word: 'banana',
      wordTranslation: 'banan',
      example: 'zdanie z bananem',
      exampleTranslation: 'Sentence with banana.'
    },
    {
      id: 7,
      wordId: 3,
      domain: 'ogólne',
      word: 'tangerine',
      wordTranslation: 'mandarynka',
      example: 'zdanie z mandarynką',
      exampleTranslation: 'Sentence with tangerine.'
    },
  ]
}
