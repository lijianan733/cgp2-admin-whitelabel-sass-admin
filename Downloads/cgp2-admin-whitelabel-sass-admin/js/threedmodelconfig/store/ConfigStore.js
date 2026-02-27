Ext.define("CGP.threedmodelconfig.store.ConfigStore",{
	extend : 'Ext.data.Store',
	
	model : "CGP.threedmodelconfig.model.ConfigModel",
	remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/threedmodelconfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: '_id',
        direction: 'DESC'
    }],
    autoLoad: true
});