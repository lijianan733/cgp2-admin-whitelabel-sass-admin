Ext.define('CGP.costenterconfig.store.workingUnitCharacterStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.costenterconfig.model.workingUnitCharacterModel'],
    model: 'CGP.costenterconfig.model.workingUnitCharacterModel',
    remoteSort: true,
    pageSize:25,
    proxy: {
        type: 'uxrest',
        url: mccsPath + 'api/workingUnitCharacters',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    constructor:function (config){
        var me= this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
