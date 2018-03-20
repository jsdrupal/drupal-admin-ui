import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { scaleRotate as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';

let styles;

const menuLinks = {
  home: [{ path: '/', text: '🏠 Home' }],
  permissions: [{ path: '/admin/people/permissions', text: '🔐 Permissions' }],
  content: [
    { path: '/admin/content', text: 'Content' },
    { path: '/admin/content/comment', text: 'Comments' },
  ],
  structure: [
    { path: '/admin/structure', text: 'Structure' },
    { path: '/admin/structure/block', text: 'Block layout' },
    { path: '/admin/structure/comments', text: 'Comment types' },
    { path: '/admin/structure/contact', text: 'Contact forms' },
    { path: '/admin/structure/types', text: 'Content types' },
    { path: '/admin/structure/display-modes', text: 'Display modes' },
    { path: '/admin/structure/menu', text: 'Menus' },
    { path: '/admin/structure/taxonomy', text: 'Taxonomy' },
    { path: '/admin/structure/views', text: 'Views' },
  ],
  appearance: [{ path: '/admin/appearance', text: 'Appearance' }],
  extend: [{ path: '/admin/modules', text: 'Extend' }],
  configuration: [{ path: '/admin/config', text: 'Configuration' }],
  people: [{ path: '/admin/people', text: 'People' }],
  reports: [{ path: '/admin/reports', text: 'Reports' }],
  help: [{ path: '/admin/help', text: 'Help' }],
};

const Default = props => (
  <div className={styles.outerWrapper} id={styles.outerWrapper}>
    <Menu
      outerContainerId={styles.outerWrapper}
      pageWrapId={styles.main}
      burgerButtonClassName={styles.burgerButton}
      burgerBarClassName={styles.burgerBar}
      crossButtonClassName={styles.crossButton}
      crossClassName={styles.cross}
      menuClassName={styles.menu}
      morphShapeClassName={styles.morphShape}
      itemListClassName={styles.itemList}
      overlayClassName={styles.overlay}
      isOpen={false}
    >
      {Object.keys(menuLinks).map(category => (
        <ul key={`${category}--${menuLinks[category][0].text}`}>
          <li>
            <Link to={menuLinks[category][0].path}>
              {menuLinks[category][0].text}
            </Link>
            <ul>
              {menuLinks[category].slice(1).map(link => (
                <li key={`${category}--${link.text}`}>
                  <Link to={link.path}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      ))}
    </Menu>

    <main className={styles.main} id={styles.main}>
      {props.children}
    </main>
  </div>
);

Default.propTypes = {
  children: PropTypes.node.isRequired,
};

styles = {
  outerWrapper: css`
    height: 100%;
    background: #444444;
  `,
  main: css`
    padding: 1rem;
    height: 100%;
    background: #ffffff;
  `,
  burgerButton: css`
    position: fixed;
    width: 36px;
    height: 30px;
    left: 36px;
    top: 36px;
  `,
  burgerBar: css`
    background: #373a47;
  `,
  crossButton: css`
    height: 24px;
    width: 24px;
  `,
  cross: css`
    background: #bdc3c7;
  `,
  menu: css`
    background: #373a47;
    font-size: 1.15rem;
    a {
      color: #fff;
      text-decoration: none;

      &:hover {
        color: #f00;
        transition: color 0.5s ease;
      }
    }
  `,
  morphShape: css`
    fill: #373a47;
  `,
  itemList: css`
    color: #b8b7ad;
  `,
  overlay: css`
    background: rgba(0, 0, 0, 0.3);
  `,
};

export default Default;
