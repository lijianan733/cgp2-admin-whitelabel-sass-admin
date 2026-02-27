Ext.define("CGP.builderbackground.model.BuilderBackground",{
	extend : 'Ext.data.Model',
	fields : [{
		name :'id',
		type : 'int',
		useNull : true
	},"name","keywords","description",{
		name : 'sortOrder',
		type : 'int'
	},{
		name : 'backgroundClassIds',
		type : 'array'
	},{
		name : 'skuProductIds',
		type : 'array'
	},{
		name : 'backgroundFaces',
		type : 'array'
	}],
	sorters : [{
		property : 'sortOrder'
	}],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/builderbackground',
		reader : {
			type : 'json',
			root : 'data'
		}
	}
});