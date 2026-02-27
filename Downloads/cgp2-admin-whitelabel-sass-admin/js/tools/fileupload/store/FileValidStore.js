Ext.define('CGP.tools.fileupload.store.FileValidStore', {
	extend:'Ext.data.Store',
	model: 'CGP.tools.fileupload.model.FileValidModel',
	pageSize: 25,
	proxy: {
		type: 'memory',
		data: []
	},
	autoLoad: true
});