/**
 * State
 * @Author: miao
 * @Date: 2021/12/27
 */
Ext.define('CGP.returnorder.store.StateNode', {
    extend: 'Ext.data.Store',
    model: 'CGP.returnorder.model.StateNode',
    remoteSort: false,
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/stateFlows/stateNodes/latest',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true,
    constructor:function (config){
        var me = this;
        if(config.flowModule){
            me.proxy.url = adminPath + 'api/stateFlows/stateNodes/latest?module='+config.flowModule;
        }
        me.callParent(arguments);
    }
});