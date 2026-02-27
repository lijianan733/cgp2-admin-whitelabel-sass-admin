/**
 * State
 * @Author: miao
 * @Date: 2021/12/27
 */
Ext.define('CGP.returnorder.store.StateInstance', {
    extend: 'Ext.data.Store',
    requires: ['CGP.returnorder.model.StateInstance'],

    model: 'CGP.returnorder.model.StateInstance',
    remoteSort: false,
    // sorters: [{
    //     property: 'step',
    //     direction: 'DESC'
    // }],
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
    // pageSize:25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partner/flowInstances/endity/{entityId}/stateInstances',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true,
    constructor:function (config){
        var me = this;
        if(config.entityId){
            me.proxy.url = adminPath + 'api/partner/flowInstances/entity/'+config.entityId+'/stateInstances';
        }
        me.callParent(arguments);
    }
});