/**
 * Created by miao on 2021/01/18.
 */
Ext.define('CGP.common.model.ConditionProductAttribute', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'key',
            type: 'int',
            convert: function (value, record) {
                return record.raw['attribute']?.id;
            }
        },
        {
            name: 'type',
            type: 'string',
            defaultValue: 'skuAttribute'
        },
        {
            name: 'valueType',
            type: 'string',
            convert: function (value, record) {
                return record.raw['attribute']?.valueType;
            }
        },
        {
            name: 'selectType',
            type: 'string',
            convert: function (value, record) {
                return record.raw['attribute']?.selectType;
            }
        },
        {
            name: 'required',
            type: 'boolean',
            convert: function (value, record) {
                return record.raw['required'];
            }
        },
        {
            name: 'displayName',
            type: 'string',
            convert: function (value, record) {
                return record.raw['displayName'] + '<' + record.raw['id'] + '>';
            }
        },
        {
            name: 'attrOptions',
            type: 'array',
            convert: function (value, record) {
                return Ext.isEmpty(record.raw['attribute']?.options) ? [] : record.raw['attribute'].options;
            }
        },
        {
            name: 'path',
            type: 'string',
            defaultValue: 'lineItems[0].productInstance.productAttributeValueMap["{0}"].attributeValue',
            convert: function (value, record) {
                return Ext.isEmpty(record.raw['attribute']?.options) ? 'lineItems[0].productInstance.productAttributeValueMap["{0}"].attributeValue' : 'lineItems[0].productInstance.productAttributeValueMap["{0}"].attributeOptionIds';
            }
        },
        {
            name: 'attributeInfo',
            type: 'object',
            convert: function (value, record) {
                return record.raw;
            }
        }
    ],
    proxy: {
        type: 'attribute_version_rest',
        url: adminPath + 'api/products/skuAttributes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
