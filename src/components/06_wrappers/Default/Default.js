import React from 'react';
import { func, node, arrayOf, shape, string } from 'prop-types';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { css } from 'emotion';
import { scaleRotate as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { requestMenu } from '../../../actions/application';
import Message from '../../02_atoms/Message/Message';

let styles;

class Default extends React.Component {
  componentWillMount() {
    this.props.requestMenu();
  }
  render = () => (
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
      </Menu>

      <main className={styles.main} id={styles.main}>
        <LoadingBar />
        {this.props.message && <Message {...this.props.message} />}
        {this.props.children}
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
};

Default.defaultProps = {
  message: null,
};

const mapStateToProps = state => ({
  message: state.application.message || null,
  menuLinks: state.application.menuLinks || {},
});

export default connect(mapStateToProps, { requestMenu })(Default);
