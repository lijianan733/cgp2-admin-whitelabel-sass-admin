/**
 * PushConfigData
 * @Author: miao
 * @Date: 2021/11/30
 */
Ext.define('CGP.tools.store.PushConfigData', {
    extend: 'Ext.data.Store',
    requires: ['CGP.tools.model.PushConfigData'],

    model: 'CGP.tools.model.PushConfigData',
    sorters: [{
        property: 'name',
        direction: 'DESC'
    }],
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
    pageSize:25,
    proxy: {
        type : 'memory'
    },
    groupField: 'groupId',
});