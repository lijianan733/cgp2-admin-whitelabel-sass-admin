Ext.define("CGP.threedpreviewplan.store.3DModeDataStore",{
	extend : 'Ext.data.Store',
	fields: ['name',{'name': 'materials','type': 'object'},{'name': 'object','type': 'object'}],
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
