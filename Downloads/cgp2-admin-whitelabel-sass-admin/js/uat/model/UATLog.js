Ext.define("CGP.uat.model.UATLog",{
	extend : 'Ext.data.Model',
	
	fields : [{
		name : 'id',
		type : 'int',
		useNull : true
	},"status","operator","remark",
	{
		name: 'confirmedDate',
        type: 'date',
        convert: function (value) {
            return new Date(value)
        },
        serialize: function (value) {
            var time = value.getTime();
            return time;
        }
	}],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/admin/uat/{id}/uatlog',
    	reader : {
    		type : "json",
    		root : 'data'
    	}
	}
});