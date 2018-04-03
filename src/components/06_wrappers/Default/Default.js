import React from 'react';
import { func, node, arrayOf, shape, string } from 'prop-types';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { css } from 'emotion';
import { scaleRotate as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { decorator as reduxBurgerMenu } from 'redux-burger-menu';
import { filterMenu, requestMenu } from '../../../actions/application';
import Message from '../../02_atoms/Message/Message';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

let styles;

const ConnectedMenu = reduxBurgerMenu(Menu, 'admin');

class Default extends React.Component {
  componentWillMount() {
    this.props.requestMenu();
  }

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
          onChange={e => this.props.filterMenu(e.target.value)}
          value={this.props.filterString}
        />
        {this.props.menuLinks.map(({ link: menuLink, subtree }) => (
          <ul key={`${menuLink.menuName}--${menuLink.url}--${menuLink.title}`}>
            <li>
              <Link to={menuLink.url}>{menuLink.title}</Link>
              <ul>
                {subtree.map(({ link: subMenuLink }) => (
                  <li
                    key={`
                      ${subMenuLink.menuName}--
                      ${subMenuLink.url}--
                      ${subMenuLink.title}
                    `}
                  >
                    <Link to={subMenuLink.url}>{subMenuLink.title}</Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        ))}
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
    padding: 1rem;
    margin-top: 100px;
    height: 100%;
    background: #ffffff;
  `,
  filterMenu: css`
    position: relative;
    margin: 8px;
    top: 36px;
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
  filterMenu: func.isRequired,
  filterString: string.isRequired,
};

Default.defaultProps = {
  message: null,
};

export const filterMenuLinks = (searchString, menuLinks) =>
  menuLinks
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

const mapStateToProps = state => ({
  message: state.application.message || null,
  menuLinks: state.application.filterString
    ? filterMenuLinks(
        state.application.filterString,
        state.application.menuLinks,
      )
    : state.application.menuLinks,
  filterString: state.application.filterString,
});

export default connect(mapStateToProps, {
  requestMenu,
  filterMenu,
})(Default);
