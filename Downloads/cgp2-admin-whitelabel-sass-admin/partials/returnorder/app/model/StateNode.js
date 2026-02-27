/**
 * StateInstance
 * @Author: miao
 * @Date: 2021/12/27
 */
Ext.define('CGP.returnorder.model.StateNode', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'flow',
            type: 'object'
        },
        {
            name: 'key',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'displayName',
            type: 'string',
            convert: function (value,rec) {
                return rec.get("name")||rec.get("key")
            },
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/returnorder/StateInstance',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
