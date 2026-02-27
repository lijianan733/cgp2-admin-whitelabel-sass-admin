/**
 * Created by nan on 2021/11/10
 * 条件组件中上下文属性的store,该store的数据源必须有path字段
 */
Ext.define('CGP.common.condition.store.ContentAttributeStore', {
    extend: 'Ext.data.TreeStore',
    proxy: {
        type: 'memory'
    },
    fields: [
        /**
         * 上下文的key
         */
        {
            name: 'key',
            type: 'string'
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'valueType',
            type: 'string'
        },
        {
            name: 'selectType',
            type: 'string'
        },
        {
            name: 'attrOptions',
            type: 'array'
        },
        {
            name: 'required',
            type: 'string'
        },
        {
            name: 'attributeInfo',
            type: 'object'
        },
        {
            name: 'path',
            type: 'string',
            convert: function (value) {
                if (Ext.isEmpty(value)) {
                    throw '上下文路径配置path不允许为空'
                } else {
                    return value;
                }
            }
        },
        {
            name: 'displayName',
            type: 'string'
        }
    ],
    data: [],
    constructor: function () {
        var me = this;
        me.callParent(arguments);
    }
})