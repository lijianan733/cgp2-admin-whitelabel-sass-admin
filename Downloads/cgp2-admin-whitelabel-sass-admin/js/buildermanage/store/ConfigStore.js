Ext.define("CGP.buildermanage.store.ConfigStore",{
	extend : 'Ext.data.Store',
	
	model : "CGP.buildermanage.model.ConfigModel",
	remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/systemBuilderConfigsV2',
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