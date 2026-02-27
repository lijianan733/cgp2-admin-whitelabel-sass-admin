Ext.define('CGP.builderembellishment.model.BuilderEmbellishment',{
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int',
		useNull: true
	},{
		name : 'name',
		type : 'string'
	},{
		name : "fileName",
		type : 'string'
	},{
		name :'keyword',
		type : 'array'
	},{
		name : 'format',
		type : 'string'
	},{
		name : 'originalFileName',
		type : 'string'
	},{
		name : 'sortOrder',
		type : 'int'
	},{
		name : 'height',
		type : 'int'
	},{
		name : 'width',
		type : 'int'
	},{
		name : 'bbgClasses',
		type : 'array'
	},{
		name : 'products',
		type : 'array'
	}],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/builderembellishment',
		reader : {
			type:'json',
			root:'data'
		}
	}
});