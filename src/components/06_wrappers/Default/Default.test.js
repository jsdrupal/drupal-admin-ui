import { filterMenuLinks } from './Default';

const menuLinks = [
  {
    link: {
      title: 'Elephant',
      description: 'More elephants',
    },
  },
  {
    link: {
      title: 'Animals',
      description: 'More animals available',
    },
    subtree: [
      {
        link: {
          title: 'Giraffe',
          description: 'More humming',
        },
      },
    ],
  },
  {
    link: {
      title: 'Giraffe',
      description: 'Even more humming',
    },
  },
];

it('filters menu links', () => {
  const filteredMenuLinks = filterMenuLinks('giraffe', menuLinks);

  expect(filteredMenuLinks.length).toEqual(2);
  expect(filteredMenuLinks[0].link.title).toEqual('Animals');
  expect(filteredMenuLinks[0].subtree[0].link.title).toEqual('Giraffe');
  expect(filteredMenuLinks[1].link.title).toEqual('Giraffe');
});

it('filters menu links without results', () => {
  const filteredMenuLinks = filterMenuLinks('Oranges', menuLinks);

  expect(filteredMenuLinks.length).toEqual(0);
});
