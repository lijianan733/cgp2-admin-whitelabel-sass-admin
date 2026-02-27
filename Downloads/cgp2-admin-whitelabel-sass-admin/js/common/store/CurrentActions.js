/**
 * @Description:状态机制中，获取指定配置当前状态可以选择的操作列表
 * @author nan
 * @date 2022/12/30
 */
Ext.define('CGP.common.store.CurrentActions', {
    extend: 'Ext.data.Store',
    idProperty: '_id',
    fields: [
        '_id',
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.stateflow.config.Action'
        },
        //指定状态节点
        {
            name: 'node',
            type: 'object'
        },
        //操作的标识
        {
            name: 'key',
            type: 'string'
        },
        //操作名称
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'fillEntity',
            type: 'boolean'
        },
        {
            name: 'entityClazz',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partner/flowInstances/entity/{configId}/stateInstances/current/actions',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    constructor: function (config) {
        var configId = config.configId;//指定配置id
        this.proxy.url = adminPath + 'api/partner/flowInstances/entity/' + configId + '/stateInstances/current/actions';
        this.callParent(arguments);
    }
});
