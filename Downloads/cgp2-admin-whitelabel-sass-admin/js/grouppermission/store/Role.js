Ext.define("CGP.grouppermission.store.Role",{
	extend :  'Ext.data.Store',
	
	fields : [{
		name : 'id',
		type : 'int',
		useNull: true
	},'name','description'],
	
	
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/groupPermissions/isdelete',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad : false
});