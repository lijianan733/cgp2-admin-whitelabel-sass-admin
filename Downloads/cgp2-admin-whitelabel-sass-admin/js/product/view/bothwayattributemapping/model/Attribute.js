/**
 * Created by nan on 2019/1/16.
 */

Ext.define("CGP.product.view.bothwayattributemapping.model.Attribute", {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        'code',

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
        },
        {
            name: 'name',
            type: 'string',
            convert: function (value, record) {
                return record.get('attribute').name;
            }
        },
        {
            name: 'attributeName',
            type: 'string',
            convert: function (value, record) {
                var result = record.get('displayName') + '<' + record.get('id') + '>';
                return result;
            }
        },
        {
            name: 'attribute',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/attributes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
