Ext.define("CGP.product.model.BuilderBackgroundClass",{
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int',
		useNull : true
	},"name","description",{
		name : 'sortOrder',
		type : 'int'
	}],
	sorters : [{
		property : 'sortOrder'
	}],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/builderbackgroundclass',
		reader : {
			type:'json',
			root:'data'
		}
	}
});