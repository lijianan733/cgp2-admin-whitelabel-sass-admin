//var adminPath = 'http://192.168.26.15:8888/cgp-api-admin/';
Ext.define('CGP.zone.model.CountryZone', {
	extend : 'Ext.data.Model',
	idProperty:'id',
	fields : [ {
		name : 'id',
		type : 'int',
		useNull: true
	},{
		name:'name',
		type:'string'
	},{
		name:'isoCode2',
		type:'string'
	},{
		name:'isoCode3',
		type:'string'
	}],
	proxy : {
		//appendId:false,
		type : 'uxrest',
		url : adminPath + 'api/countries',
		reader:{
			type:'json',
			root:'data'
		}
	}
});