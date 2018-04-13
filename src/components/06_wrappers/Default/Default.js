import React from 'react';
import { func, node, arrayOf, shape, string } from 'prop-types';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { css } from 'emotion';
import { reveal as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { decorator as reduxBurgerMenu } from 'redux-burger-menu';
import { requestMenu } from '../../../actions/application';
import Message from '../../02_atoms/Message/Message';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

let styles;

const ConnectedMenu = reduxBurgerMenu(Menu, 'admin');

export const filterMenuLinks = (searchString, menuLinks) => {
  if (!searchString) {
    return menuLinks;
  }
  return menuLinks
    .map(menuLink => {
      const subtree =
        menuLink.subtree && filterMenuLinks(searchString, menuLink.subtree);
      if (
        (menuLink.link &&
          `${menuLink.link.title}${menuLink.link.description}`
            .toLowerCase()
            .indexOf(searchString.toLowerCase()) !== -1) ||
        (Array.isArray(subtree) && subtree.length > 0)
      ) {
        return {
          ...menuLink,
          subtree,
        };
      }
      return null;
    })
    .filter(id => id);
};

class Default extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterString: '',
    };
  }

  componentWillMount() {
    this.props.requestMenu();
  }

  filterMenu = e => {
    this.setState({
      filterString: e.target.value,
    });
  };

  render = () => (
    <div className={styles.outerWrapper} id={styles.outerWrapper}>
      <ConnectedMenu
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
      >
        <input
          className={styles.filterMenu}
          type="textfield"
          placeholder="Search"
          onChange={this.filterMenu}
          value={this.state.filterString}
        />
        {filterMenuLinks(this.state.filterString, this.props.menuLinks).map(
          ({ link: menuLink, subtree }) => (
            <ul
              key={`${menuLink.menuName}--${menuLink.url}--${menuLink.title}`}
              className={styles.menuList}
            >
              <li>
                <Link to={menuLink.url} className={styles.topLevelLink}>
                  {menuLink.title}
                </Link>
                <ul className={styles.menuListChildren}>
                  {subtree.map(({ link: subMenuLink }) => (
                    <li
                      key={`
                      ${subMenuLink.menuName}--
                      ${subMenuLink.url}--
                      ${subMenuLink.title}
                    `}
                      className={styles.menuListItem}
                    >
                      <Link
                        to={subMenuLink.url}
                        className={styles.childrenLink}
                      >
                        {subMenuLink.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          ),
        )}
      </ConnectedMenu>

      <main className={styles.main} id={styles.main}>
        <ErrorBoundary>
          <LoadingBar />
          {this.props.message && <Message {...this.props.message} />}
          {this.props.children}
        </ErrorBoundary>
      </main>
    </div>
  );
}

styles = {
  outerWrapper: css`
    height: 100%;
    background: #444444;
  `,
  main: css`
    padding: 7rem 2rem 3rem;
    height: 100%;
    background: #ffffff;
  `,
  filterMenu: css`
    position: relative;
    margin: 36px 8px 8px;
  `,
  burgerButton: css`
    position: absolute;
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
    background: #fafafa;
    font-size: 1.05rem;
  `,
  menuList: css`
    list-style: none;
    margin: 10px 0;
    padding-left: 1.5rem;
  `,
  menuListChildren: css`
    list-style: none;
    padding: 10px 0 0 1.5rem;
  `,
  menuListItem: css`
    padding-bottom: 10px;
  `,
  topLevelLink: css`
    color: #272756;
    font-weight: bold;
    text-decoration: none;
    font-size: 0.95rem;
  `,
  childrenLink: css`
    color: #252629;
    text-decoration: none;

    &:hover {
      color: #000000;
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

Default.propTypes = {
  children: node.isRequired,
  message: shape({
    message: string,
    type: string,
  }),
  menuLinks: arrayOf(
    shape({
      subtree: arrayOf(
        shape({
          link: shape({
            url: string,
            title: string,
          }),
        }),
      ),
      link: shape({
        url: string,
        title: string,
      }),
    }),
  ).isRequired,
  requestMenu: func.isRequired,
};

Default.defaultProps = {
  message: null,
};

const mapStateToProps = state => ({
  message: state.application.message || null,
  menuLinks: state.application.menuLinks,
});

export default connect(mapStateToProps, {
  requestMenu,
})(Default);
