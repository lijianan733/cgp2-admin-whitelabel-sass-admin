/**
 * Created by nan on 2019/1/16.
 */

Ext.define("CGP.product.view.bothwayattributepropertyrelevanceconfig.model.Attribute", {
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
