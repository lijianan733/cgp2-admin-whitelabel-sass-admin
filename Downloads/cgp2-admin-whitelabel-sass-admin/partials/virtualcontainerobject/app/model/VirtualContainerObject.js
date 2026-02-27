/**
 * Created by miao on 2021/9/08.
 */
Ext.define('CGP.virtualcontainerobject.model.VirtualContainerObject', {
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
            name: 'description',
            type: 'string'
        },
        {
            name: 'containerType',
            type: 'object'
        },
        {
            name: 'argumentBuilder',
            type: 'object'
        },
        {
            name: 'argument',
            type: 'object'
        },
        {
            name: 'layout',
            type: 'object'
        },
        {
            name: 'contentMapItems',
            type: 'array'
        },
        {
            name:'displayName',
            type:'string',
            convert:function (v, rec){
                return '<'+rec.get('_id')+'>'+rec.get('description');
            }
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/virtualContainerObjects',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
