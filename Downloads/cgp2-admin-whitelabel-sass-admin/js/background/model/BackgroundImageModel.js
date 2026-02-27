/**
 * Created by nan on 2020/12/18
 */

Ext.define("CGP.background.model.BackgroundImageModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'imageName',
            type: 'string',
        },
        {
            name: 'background',
            type: 'object',
        },
        {
            name: 'printFileName',
            type: 'string',
        },   {
            name: 'imageWidth',
            type: 'number',
        },
        {
            name: 'imageHeight',
            type: 'number',
        },
        {
            name: 'actualWidth',
            type: 'number',
        },
        {
            name: 'actualHeight',
            type: 'number',
        },
        {
            name: 'unit',
            type: 'string',
        },
        {
            name:'clazz',
            type:'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/backgroundImages',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})