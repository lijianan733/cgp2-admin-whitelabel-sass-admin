Ext.create("Ext.data.Store",{
	storeId : 'TemplateNames',
	fields: [
         {name:'name', type: 'string'},
         {name:'description',  type: 'string'}
    ],
	proxy : {
		extraParams:{
			target : 'customer'
		},
		type : 'uxrest',
		url : adminPath + 'api/configurations/mailtemplatefilenames',
		reader :{
			type : 'json',
			root : "data"
		}
	},
	autoLoad : false 
});