Ext.define("CGP.project.store.Project",{
	extend : 'Ext.data.Store',
	requires : ["CGP.project.model.Project"],
	
	model : "CGP.project.model.Project",
	remoteSort:false,
	pageSize:25,
	proxy:{
		type:'uxrest',
		url:adminPath + 'api/projects',
		reader:{
			type:'json',
			root:'data.content'
		}
	},
	autoLoad:true
});
