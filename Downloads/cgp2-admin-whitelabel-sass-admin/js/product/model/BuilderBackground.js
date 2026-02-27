Ext.define("CGP.product.model.BuilderBackground",{
	extend : 'Ext.data.Model',
	fields :[{
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
	}]
});