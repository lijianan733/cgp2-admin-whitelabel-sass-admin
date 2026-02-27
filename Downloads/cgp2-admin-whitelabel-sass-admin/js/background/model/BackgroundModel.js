/**
 * Created by nan on 2020/12/18
 */

Ext.define("CGP.background.model.BackgroundModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'generateRule',
            type: 'object',
        },
        {
            name: 'withColor',
            type: 'object',
        },
        {
            name: 'series',
            type: 'object',
        },
        {
            name: 'sourceFileName',
            type: 'string',
        },
        {
            name: 'fileUrl',
            type: 'fileUrl'
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
})