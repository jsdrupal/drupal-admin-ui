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
          title: 'Giraffe',
          description: 'More humming',
        },
      ],
    },
    {
      title: 'Giraffe',
      description: 'Even more humming',
    },
  ];

  const stateResult = application(state, filterMenu('giraffe'));

  expect(stateResult.filteredMenuLinks.length).toEqual(2);
});
