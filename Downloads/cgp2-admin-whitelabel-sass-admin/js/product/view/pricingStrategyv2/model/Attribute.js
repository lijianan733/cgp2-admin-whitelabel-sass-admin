Ext.define('CGP.product.view.pricingStrategyv2.model.Attribute', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        }, 'code', 'name', 'inputType', {
            name: 'options',
            type: 'array',
            convert: function (value, record) {
                if (Ext.isEmpty(record.get('attribute').options)) {
                    return [];
                } else {
                    return record.get('attribute').options;
                }
            }
        }, {
            name: 'displayName',
            type: 'string'
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'attribute',
            type: 'object'
        }, {
            name: 'attributeId',
            type: 'int',
            convert: function (value, record) {
                var attributeId = record.get('attribute').id;
                return attributeId;
            }
        }, {
            name: 'attributeName',
            type: 'string',
            convert: function (value, record) {
                var result = record.get('attribute').name + '<' + record.get('id') + '>';
                return result;
            }
        }, {
            name: 'isSku',
            type: 'boolean'
        }, {
            name: 'detail',
            type: 'string'
        }, {
            name: 'placeholder',
            type: 'string'
        }, {
            //标识是否为必填
            name: 'required',
            type: 'boolean'
        },
        {
            name: 'path',
            type: 'string',
            defaultValue: 'args.productAtrributeValue'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/products/{id}/attributeValues',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
