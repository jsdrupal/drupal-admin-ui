import React from 'react';
import { func, node, objectOf, arrayOf, shape, string } from 'prop-types';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { css } from 'emotion';
import { scaleRotate as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { requestMenu } from '../../../actions/application';
import Error from '../../02_atoms/Error/Error';

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
        {Object.keys(this.props.menuLinks).map(category => (
          <ul key={`${category}--${this.props.menuLinks[category].link.title}`}>
            <li>
              <Link to={this.props.menuLinks[category].link.url}>
                {this.props.menuLinks[category].link.title}
              </Link>
              <ul>
                {Object.values(this.props.menuLinks[category].subtree).map(
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
        <LoadingBar />
        {this.props.error && <Error />}
        {!this.props.error && this.props.children}
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
  error: string,
  menuLinks: objectOf(
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
  error: null,
};

const mapStateToProps = state => ({
  error: state.application.error || null,
  menuLinks: state.application.menuLinks || {},
});

export default connect(mapStateToProps, { requestMenu })(Default);
