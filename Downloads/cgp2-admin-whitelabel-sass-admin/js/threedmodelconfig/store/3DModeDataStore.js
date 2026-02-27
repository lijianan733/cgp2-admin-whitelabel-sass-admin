Ext.define("CGP.threedmodelconfig.store.3DModeDataStore",{
	extend : 'Ext.data.Store',
	fields: ['name'],
	remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: location.origin+'/file/' + 'jsonFile/content',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: false
});
