/**
 * Created by nan on 2021/11/10
 * 条件组件中上下文属性的store,该store的数据源必须有path字段,
 * key字段不能做唯一标识，因为在用rtType作为上下文的时候，会有重复
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.model.ContentAttributeModel'
])
Ext.define('CGP.common.condition.store.ContentAttributeStore', {
    extend: 'Ext.data.Store',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            idProperty: 'UUId'//一般不要用key,处理没指定时，会自动加上id字段,可以写别的
        },
    },
    model: 'CGP.common.condition.model.ContentAttributeModel',
    constructor: function () {
        var me = this;
        me.data = [];
        me.callParent(arguments);
    }
})