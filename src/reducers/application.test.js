import application, { initialState } from './application';
import { filterMenu } from '../actions/application';

it('filters menu links', () => {
  const state = Object.create(initialState);
  state.menuLinks = [
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

  const stateResult = application(state, filterMenu('giraffe'));

  expect(stateResult.filteredMenuLinks.length).toEqual(2);
  expect(stateResult.filteredMenuLinks[0].link.title).toEqual('Animals');
  expect(stateResult.filteredMenuLinks[0].subtree[0].link.title).toEqual(
    'Giraffe',
  );
  expect(stateResult.filteredMenuLinks[1].link.title).toEqual('Giraffe');
});
