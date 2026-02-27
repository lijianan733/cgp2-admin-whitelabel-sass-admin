Ext.define('CGP.builderembellishment.model.BuilderEmbellishmentClass',{
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int',
		useNull: true
	},{
		name : 'name',
		type : 'string'
	},{
		name : 'description',
		type : 'string'
	},{
		name : 'bbgList',
		type : 'array',
		convert: function(value){ //转入 to model
			if(value == null || value == ''){
			return [];
			}
			else { 
			return value;
			}
		},
		serialize: function (value) {
            if(value == null || value == ''){
			return [];
			}
			else { 
			return value;
        	}
        }
	}],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/builderembellishmentclass',
		reader : {
			type:'json',
			root:'data'
		}
	}
});