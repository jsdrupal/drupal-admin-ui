import { filterPermissions } from './Permissions';

const permissions = [
  {
    title: 'Administer blocks',
    description: null,
    provider: 'block',
    id: 'administer blocks',
    provider_label: 'Block',
  },
  {
    title: 'Administer comment types and settings',
    'restrict access': true,
    description: null,
    provider: 'comment',
    id: 'administer comment types',
    provider_label: 'Comment',
  },
  {
    title: 'Administer comments and comment settings',
    description: null,
    provider: 'comment',
    id: 'administer comments',
    provider_label: 'Comment',
  },
  {
    title: 'Edit own comments',
    description: null,
    provider: 'comment',
    id: 'edit own comments',
    provider_label: 'Comment',
  },
  {
    title: 'Post comments',
    description: null,
    provider: 'comment',
    id: 'post comments',
    provider_label: 'Comment',
  },
];

it('Does not filter on empty string', () => {
  expect(filterPermissions('', permissions).length).toEqual(5);
});

it('Returns an empty set of permissions, when no string match', () => {
  expect(filterPermissions('ccccccibhdbvblfhin', permissions).length).toEqual(
    0,
  );
});

it('Filter by a lowercase title', () => {
  const result = filterPermissions('post comment', permissions);
  expect(result.length).toEqual(1);
  expect(result[0].title).toEqual('Post comments');
});

it('Filter by an uppercase title', () => {
  const result = filterPermissions('Post comment', permissions);
  expect(result.length).toEqual(1);
  expect(result[0].title).toEqual('Post comments');
});

it('Filter by provider', () => {
  const result = filterPermissions('comment', permissions);
  expect(result.length).toEqual(4);
});
