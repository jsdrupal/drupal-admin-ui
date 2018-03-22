import React from 'react';
import { node } from 'prop-types';
import { css } from 'emotion';
import { scaleRotate as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import makeCancelable from 'makecancelable';

import Loading from '../../02_atoms/Loading/Loading';
import Error from '../../02_atoms/Loading/Error';

let styles;

class Default extends React.Component {
  state = {
    loaded: false,
    menuLinks: [],
  };

  componentDidMount() {
    this.cancelFetch = this.fetchData();
  }

  componentWillUnmount() {
    this.cancelFetch();
  }

  enhanceMenuLinks = menuLinks =>
    Object.entries(menuLinks).reduce((acc, [key, menuLink]) => {
      // Permissions aren't part of the default menu structure, they are just a local tab.
      if (menuLink.link.url.indexOf('admin/people') !== -1) {
        menuLink.subtree.push({
          subtree: [],
          hasChildren: false,
          inActiveTrail: false,
          link: {
            weight: '4',
            title: '🔐 Permissions',
            description: 'Manage permissions.',
            menuName: 'admin',
            url: '/admin/people/permissions',
          },
        });
      }
      acc[key] = menuLink;
      return acc;
    }, {});

  fetchData = () =>
    makeCancelable(
      fetch(
        `${process.env.REACT_APP_DRUPAL_BASE_URL}/admin-api/menu?_format=json`,
        {
          credentials: 'include',
        },
      )
        .then(res => res.json())
        .then(this.enhanceMenuLinks)
        .then(menuLinks => this.setState({ loaded: true, menuLinks }))
        .catch(err => this.setState({ loaded: false, err })),
    );

  render = () =>
    this.state.err ? (
      <Error />
    ) : !this.state.loaded ? (
      <Loading />
    ) : (
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
          {Object.keys(this.state.menuLinks).map(category => (
            <ul
              key={`${category}--${this.state.menuLinks[category].link.title}`}
            >
              <li>
                <Link to={this.state.menuLinks[category].link.url}>
                  {this.state.menuLinks[category].link.title}
                </Link>
                <ul>
                  {Object.values(this.state.menuLinks[category].subtree).map(
                    subMenuLink => (
                      <li key={`${category}--${subMenuLink.link.title}`}>
                        <Link to={subMenuLink.link.url}>
                          {subMenuLink.link.title}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </li>
            </ul>
          ))}
        </Menu>

        <main className={styles.main} id={styles.main}>
          {this.props.children}
        </main>
      </div>
    );
}

Default.propTypes = {
  children: node.isRequired,
};

styles = {
  outerWrapper: css`
    height: 100%;
    background: #444444;
  `,
  main: css`
    padding: 1rem;
    margin-top: 100px;
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
