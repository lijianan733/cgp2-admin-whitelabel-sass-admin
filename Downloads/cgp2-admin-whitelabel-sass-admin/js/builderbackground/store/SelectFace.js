Ext.define("CGP.builderbackground.store.SelectFace",{
	extend : 'Ext.data.Store',
	fields : [{
		name : 'id',
		type : 'int'
	},"name","code"],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/builderbackground/faceType',
		reader : {
			type : 'json',
			root : 'data'
		}
	},
	autoLoad : true
});