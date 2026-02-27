Ext.define("CGP.grouppermission.store.Permission",{
	extend : 'Ext.data.TreeStore',
	requires: ['CGP.grouppermission.model.Permission'],
	
	model : 'CGP.grouppermission.model.Permission',
	proxy : {
		type: 'ajax',
		url: adminPath + 'api/permissions/check?access_token=' + Ext.util.Cookies.get('token'),
		reader: 'nestjson'
	},
	autoLoad :true
})