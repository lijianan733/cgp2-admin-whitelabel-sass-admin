/**
 * Created by nan on 2018/5/14.
 */
Ext.syncRequire(['CGP.builderpublishhistory.model.BuliderPublishHistoryModel']);
Ext.define('CGP.builderpublishhistory.store.BuilderPublishHistroyStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.builderpublishhistory.model.BuliderPublishHistoryModel',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/builderPublishHistory',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    },
    autoLoad: true
})