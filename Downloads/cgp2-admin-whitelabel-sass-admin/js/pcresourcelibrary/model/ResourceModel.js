/**
 * Created by nan on 2021/9/1
 */
Ext.define("CGP.pcresourcelibrary.model.ResourceModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'clazz',
            type: 'string',
        },
        {
            name: 'thumbnail',
            type: 'string',
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/pcResource/common',
        reader: {
            type: 'json',
            root: 'data'
        }
    },

});
