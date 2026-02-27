Ext.define('CGP.product.view.managerskuattribute.model.SkuAttributeGridModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        'code',
        'name',
        'inputType',
        {
            name: 'options',
            type: 'array'
        },
        {
            name: 'displayName',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'sortOrder',
            type: 'int'
        }
        , {
            name: 'isSku',
            type: 'boolean'
        }, {
            name: 'detail',
            type: 'string'
        }, {
            name: 'placeholder',
            type: 'string'
        },
        {
            name: 'attribute',
            type: 'object'
        }, {
            name: 'hidden',
            type: 'boolean'
        }, {
            name: 'enable',
            type: 'boolean'
        }, {
            name: 'required',
            type: 'boolean'
        }, {
            name: 'defaultValue',
            type: 'string'
        },
        {
            name: 'readOnly',
            type: 'boolean'
        },
        {
            name: 'attributeId',
            type: 'string',
            convert: function (value, record) {

                return record.raw.attribute.id;
            }
        },
        {
            name: 'comboDisplay',
            type: 'string',
            convert: function (v, record) {
                return record.data.displayName + '<' + record.data.id + '>';
            }
        }
    ]

})
