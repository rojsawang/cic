import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { Form, Input, Button } from 'antd';

import arrayToObject from '../../helpers/arrayToObject';

const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

// const mapFieldsToProps = (fieldsValue) => {
//   return fieldsValue;
// };

const mapValidationToRules = (field) => {
  const validations = field.validations;
  console.log('mapValidationToRules', validations);

  const rules = [];

  if (field.required) rules.push({ required: true, message: 'Please enter value' });
  if (validations.regexp) {
    const regexp = new RegExp(_.get(validations, 'regexp.pattern'), _.get(validations, 'regexp.flag', 'ig'))
    rules.push({ pattern: regexp, message: 'Wrong Pattern' });
  }
  if (validations.in && _.size(validations.in) > 0) {
    const inString = _.join(_.get(validations, 'in'), ',');
    rules.push({ type: 'enum', enum: _.get(validations, 'in'), message: `Must be one of ${inString}` });
  }
  console.log(rules);
  return rules;
};

// const mapPropsToFields = (props) => {
//   const { contentType, entry } = props;
//   const fields = _.mapValues(arrayToObject(contentType.fields, 'identifier'), field => {
//     return {
//       identifier: field.identifier,
//       value: _.get(entry, `fields.${field.identifier}`, ''),
//       rules: mapValidationToRules(field),
//     }
//   });
//   console.log('mapPropsToFields', fields);
//   return fields;
// }


class EntryEditorForm extends Component {

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { onSubmit } = this.props;
        onSubmit(values);
      }
    });
  }

  render() {
    const { contentType, entry } = this.props;
    const fields = _.mapValues(arrayToObject(contentType.fields, 'identifier'), field => {
      return {
        label: field.name,
        value: _.get(entry, `fields.${field.identifier}`, ''),
        identifier: field.identifier,
        rules: mapValidationToRules(field),
      }
    });

    const { getFieldDecorator, getFieldsValue, getFieldsError } = this.props.form;
    console.log('fields', fields);
    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        {
          _.map(fields, (field, identifier) => {
            return (
              <Form.Item
                label={field.label}
                key={field.identifier}
              >
                {getFieldDecorator(identifier, {
                  initialValue: field.value,
                  rules: field.rules,
                })(
                  <Input />
                )}
              </Form.Item>
            );
          })
        }
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    );
  }
}


export default Form.create({
  // mapPropsToFields
})(EntryEditorForm);
