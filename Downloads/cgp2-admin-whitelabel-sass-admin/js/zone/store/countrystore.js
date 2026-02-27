Ext.define('CGP.zone.store.countrystore',{
	storeId:'countryZoneStore',
	//model.js
	model:'CGP.zone.model.CountryZone',
    extend: 'Ext.data.Store',
	remoteSort:false,
	pageSize:10,
	proxy:{
		type:'uxrest',
		url:adminPath + 'api/countries',
		reader:{
			type:'json',
			root:'data.content'
		}
	},
	autoLoad:true
})
