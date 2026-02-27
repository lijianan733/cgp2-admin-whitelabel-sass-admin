Ext.define('CGP.configurationgroup.store.ConfigurationTree', {
    extend: 'Ext.data.TreeStore',
    model: 'CGP.configurationgroup.model.Configuration',
    nodeParam: 'id',
    //idProperty : 'code',

    //    expanded: true,
    autoLoad: true,
    proxy: {
        type: 'memory'
    }

});