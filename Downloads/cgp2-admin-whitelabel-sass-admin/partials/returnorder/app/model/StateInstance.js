/**
 * StateInstance
 * @Author: miao
 * @Date: 2021/12/27
 */
Ext.define('CGP.returnorder.model.StateInstance', {
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
            name: 'flow',
            type: 'object'
        },
        {
            name: 'step',
            type: 'number'
        },
        {
            name: 'state',
            type: 'object'
        },
        {
            name: 'action',
            type: 'object'
        },
        {
            name: 'branchPriority',
            type: 'number'
        },
        {
            name: 'qty',
            type: 'number'
        },
        {
            name: 'entityId',
            type: 'string'
        },
        {
            name: 'entityClazz',
            type: 'string'
        },
        {
            name: 'remark',
            type: 'string'
        },
        {
            name: 'createdDate',
            type: 'number',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    return null;
                } else {
                    return new Date(value)
                }
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'user',
            type: 'object'
        },
        {
            name: 'entity',
            type: 'object'
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
