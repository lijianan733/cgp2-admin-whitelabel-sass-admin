/**
 * Created by miao on 2021/9/08.
 */
Ext.define('CGP.virtualcontainerobject.model.ContentMapItem', {
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
            name: 'childObject',
            type: 'object'
        },
        {
            name:'childVCT',
            type:'object'
        },
        {
            name: 'required',
            type: 'boolean'
        },
        {
            name: 'replace',
            type: 'boolean'
        }
    ]
});
