export default {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      title: 'type',
      description: 'Resource type',
    },
    id: {
      type: 'string',
      title: 'Resource ID',
      format: 'uuid',
      maxLength: 128,
    },
    attributes: {
      description: 'Entity attributes',
      type: 'object',
      properties: {
        nid: {
          type: 'integer',
          title: 'ID',
        },
        uuid: {
          type: 'string',
          title: 'UUID',
          maxLength: 128,
        },
        vid: {
          type: 'integer',
          title: 'Revision ID',
        },
        langcode: {
          type: 'object',
          properties: {
            value: {
              type: 'string',
              title: 'Language code',
            },
            language: {
              type: 'language_reference',
              title: 'Language object',
              description: 'The referenced language',
            },
          },
          required: ['value'],
          title: 'Language',
        },
        revision_timestamp: {
          type: 'number',
          title: 'Revision create time',
          format: 'utc-millisec',
          description: 'The time that the current revision was created.',
        },
        revision_log: {
          type: 'string',
          title: 'Revision log message',
          description: 'Briefly describe the changes you have made.',
          default: '',
        },
        status: {
          type: 'boolean',
          title: 'Published',
          default: true,
        },
        title: {
          type: 'string',
          title: 'Recipe Name',
          maxLength: 255,
        },
        created: {
          type: 'number',
          title: 'Authored on',
          format: 'utc-millisec',
          description: 'The time that the node was created.',
        },
        changed: {
          type: 'number',
          title: 'Changed',
          format: 'utc-millisec',
          description: 'The time that the node was last edited.',
        },
        promote: {
          type: 'boolean',
          title: 'Promoted to front page',
          default: true,
        },
        sticky: {
          type: 'boolean',
          title: 'Sticky at top of lists',
          default: false,
        },
        default_langcode: {
          type: 'boolean',
          title: 'Default translation',
          description:
            'A flag indicating whether this is the default translation.',
          default: true,
        },
        revision_default: {
          type: 'boolean',
          title: 'Default revision',
          description:
            'A flag indicating whether this was a default revision when it was saved.',
        },
        revision_translation_affected: {
          type: 'boolean',
          title: 'Revision translation affected',
          description:
            'Indicates if the last edit of a translation belongs to current revision.',
        },
        path: {
          type: 'object',
          properties: {
            alias: {
              type: 'string',
              title: 'Path alias',
            },
            pid: {
              type: 'integer',
              title: 'Path id',
            },
            langcode: {
              type: 'string',
              title: 'Language Code',
            },
          },
          title: 'URL alias',
        },
        field_cooking_time: {
          type: 'integer',
          title: 'Cooking time',
        },
        field_difficulty: {
          type: 'string',
          title: 'Difficulty',
          enum: ['easy', 'medium', 'hard'],
          default: 'medium',
        },
        field_ingredients: {
          type: 'array',
          title: 'Ingredients',
          description:
            'List the ingredients required for this recipe, one per item.',
          items: {
            type: 'string',
            title: 'Text value',
            maxLength: 255,
          },
        },
        field_number_of_servings: {
          type: 'integer',
          title: 'Number of servings',
        },
        field_preparation_time: {
          type: 'integer',
          title: 'Preparation time',
        },
        field_recipe_instruction: {
          type: 'object',
          properties: {
            value: {
              type: 'string',
              title: 'Text',
            },
            format: {
              type: 'string',
              title: 'Text format',
            },
          },
          required: ['value'],
          title: 'Recipe instruction',
        },
        field_summary: {
          type: 'object',
          properties: {
            value: {
              type: 'string',
              title: 'Text',
            },
            format: {
              type: 'string',
              title: 'Text format',
            },
          },
          required: ['value'],
          title: 'Summary',
          description: 'Provide a short overview of this recipe.',
        },
      },
      required: [
        'nid',
        'uuid',
        'vid',
        'title',
        'revision_translation_affected',
        'path',
        'field_difficulty',
        'field_number_of_servings',
        'field_preparation_time',
        'field_recipe_instruction',
        'field_summary',
      ],
    },
    relationships: {
      description: 'Entity relationships',
      properties: {
        type: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              required: ['type', 'id'],
              properties: {
                type: {
                  type: 'string',
                  title: 'Referenced resource',
                  enum: ['node_type--node_type'],
                },
                id: {
                  type: 'string',
                  title: 'Resource ID',
                  format: 'uuid',
                  maxLength: 128,
                },
              },
            },
          },
          title: 'Resource Identifier',
        },
        revision_uid: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              required: ['type', 'id'],
              properties: {
                type: {
                  type: 'string',
                  title: 'Referenced resource',
                  enum: ['user--user'],
                },
                id: {
                  type: 'string',
                  title: 'Resource ID',
                  format: 'uuid',
                  maxLength: 128,
                },
              },
            },
          },
          title: 'Resource Identifier',
        },
        uid: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              required: ['type', 'id'],
              properties: {
                type: {
                  type: 'string',
                  title: 'Referenced resource',
                  enum: ['user--user'],
                },
                id: {
                  type: 'string',
                  title: 'Resource ID',
                  format: 'uuid',
                  maxLength: 128,
                },
              },
            },
          },
          title: 'Resource Identifier',
        },
        field_author: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              required: ['type', 'id'],
              properties: {
                type: {
                  type: 'string',
                  title: 'Referenced resource',
                  enum: ['user--user'],
                },
                id: {
                  type: 'string',
                  title: 'Resource ID',
                  format: 'uuid',
                  maxLength: 128,
                },
              },
            },
          },
          title: 'Resource Identifier',
        },
        field_image: {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              required: ['type', 'id'],
              properties: {
                type: {
                  type: 'string',
                  title: 'Referenced resource',
                  enum: ['file--file'],
                },
                id: {
                  type: 'string',
                  title: 'Resource ID',
                  format: 'uuid',
                  maxLength: 128,
                },
              },
            },
          },
          title: 'Resource Identifier',
        },
        field_recipe_category: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                required: ['type', 'id'],
                properties: {
                  type: {
                    type: 'string',
                    title: 'Referenced resource',
                    enum: ['taxonomy_term--recipe_category'],
                  },
                  id: {
                    type: 'string',
                    title: 'Resource ID',
                    format: 'uuid',
                    maxLength: 128,
                  },
                },
              },
            },
          },
          title: 'Resource Identifier',
        },
        field_tags: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                required: ['type', 'id'],
                properties: {
                  type: {
                    type: 'string',
                    title: 'Referenced resource',
                    enum: ['taxonomy_term--tags'],
                  },
                  id: {
                    type: 'string',
                    title: 'Resource ID',
                    format: 'uuid',
                    maxLength: 128,
                  },
                },
              },
            },
          },
          title: 'Resource Identifier',
        },
      },
      type: 'object',
    },
    links: {
      type: 'object',
      description: 'Entity links',
      properties: {
        self: {
          type: 'string',
          format: 'uri',
          description: 'The absolute link to this entity.',
        },
      },
    },
  },
  title: 'node:recipe Schema',
  description: 'Add a new recipe to the site.',
};
