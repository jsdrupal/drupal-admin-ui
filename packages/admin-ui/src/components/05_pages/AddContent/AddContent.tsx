import { css } from 'emotion';
// @ts-ignore
import { Markup } from 'interweave';
import * as React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import PageTitle from '../../02_atoms/PageTitle';

import { ContentType } from '../../../constants/content_type';

const styles = {
  menuLink: css`
    text-decoration: inherit;
  `,
  root: css`
    margin-bottom: 50px;
  `,
};

interface Props {
  // TODO must lock down.
  // @ts-ignore
  contentTypes: Map<string, ContentType>,
  requestContentTypes: () => void,
};

export default class extends Component<Props> {
  public componentDidMount() {
    this.props.requestContentTypes();
  }

  public render = () => (
    <div className={styles.root}>
      <PageTitle>Add content</PageTitle>
      <Paper>
        <List data-nightwatch="node-type-list">
          {Object.keys(this.props.contentTypes).map((contentId: string) => (
            <ListItem component="li" key={`node-add-${contentId}`}>
              <Link className={styles.menuLink} to={`/node/add/${contentId}`}>
                <ListItemText
                  primary={this.props.contentTypes[contentId].name}
                  secondary={
                    <Markup
                      content={this.props.contentTypes[contentId].description}
                    />
                  }
                />
              </Link>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
}
