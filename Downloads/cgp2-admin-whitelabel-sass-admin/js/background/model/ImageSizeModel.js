/**
 * Created by nan on 2021/3/5
 */
Ext.define("CGP.background.model.ImageSizeModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'productWidth',
            type: 'number'
        },
        {
            name: 'productHeight',
            type: 'number'
        }, {
            name: 'cutTop',
            type: 'number'
        }, {
            name: 'cutBottom',
            type: 'number'
        }, {
            name: 'cutLeft',
            type: 'number'
        }, {
            name: 'cutRight',
            type: 'number'
        }, {
            name: 'unit',
            type: 'string'
        },
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/backgroundSeries/id/sizes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})