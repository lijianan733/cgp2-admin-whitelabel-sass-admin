/**
 * Created by nan on 2019/12/13.
 */
Ext.define('CGP.variabledatasource.store.VariableDataSourceStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.variabledatasource.model.VariableDataSourceModel'],
    model: 'CGP.variabledatasource.model.VariableDataSourceModel',
    remoteSort: false,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/variableDataSources',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
