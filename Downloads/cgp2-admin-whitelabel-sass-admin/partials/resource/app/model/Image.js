/**
 * Created by miao on 2021/8/26.
 */
Ext.define('CGP.resource.model.Image', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'number',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'imageName',
            type: 'string'
        },
        {
            name: 'isVector',
            type: 'boolean'
        },
        {
            name: 'format',
            type: 'string'
        },
        {
            name: 'width',
            type: 'number'
        },
        {
            name: 'height',
            type: 'number'
        },
        {
            name: 'unit',
            type: 'string'
        },
        {
            name: 'thumbnail',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/images',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
