/**
 * @Description:状态机制中，获取指定配置类型所有状态列表
 * @author nan
 * @date 2022/12/30
 */
Ext.define('CGP.common.store.StateNode', {
    extend: 'Ext.data.Store',
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
            convert: function (value, rec) {
                return i18n.getKey(rec.get("name") || rec.get("key"));
            },
        }
    ],
    remoteSort: false,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/stateFlows/stateNodes/latest',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config.flowModule) {
            me.proxy.url = adminPath + 'api/stateFlows/stateNodes/latest?module=' + config.flowModule;
        }
        me.callParent(arguments);
    }
});
