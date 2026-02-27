/**
 * Created by nan on 2021/9/2
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.model.PCPreThemeModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
        },
        {
            name: 'clazz',
            type: 'string',
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'mvt',
            type: 'object'
        },
        {
            name: 'resourceItemConfigs',
            type: 'array'
        },
        {
            name: 'indexMappingConfig',
            type: 'object'
        },
        {
            name: 'items',
            type: 'array'
        },
        {
            name: 'diyDisplay',
            type: 'string',
            convert: function (value, record) {
                return record.get('description') + '(' + record.get('_id') + ')';
            }
        },

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/themes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

})