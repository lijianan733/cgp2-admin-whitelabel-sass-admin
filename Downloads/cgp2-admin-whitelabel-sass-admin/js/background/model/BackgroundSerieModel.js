/**
 * Created by nan on 2020/12/18
 */

Ext.define("CGP.background.model.BackgroundSerieModel", {
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
            name: 'displayName',
            type: 'string'
        },
        {
            name:'clazz',
            type:'string'
        }

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/backgroundSeries',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})