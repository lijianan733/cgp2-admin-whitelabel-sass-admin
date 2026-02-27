Ext.define("CGP.uat.model.UAT",{
	extend : 'Ext.data.Model',
	
	fields : [{
		name : "id",
		type : 'int',
		useNull: true
	},"name","description","type","status",
	{
		name : 'confirmedDate',type : 'date',
        convert: function (value) {	//从后台传数据到model中
        	if(Ext.isEmpty(value)){
        		return null;
        	}else{
            	return new Date(value);
        	}
        },
        serialize: function (value) { //从model中把数据传到后台提交。 中间在grid，等地方用这个model不会触发这个方法
        	if(Ext.isEmpty(value)){
        		return null;
        	}else{
        		return value.getTime();
        	}
        }
    },"confirmedBy",
    {name : 'website',type : "object"},
    {name : 'uatLogs',type : "array"}]
    ,
    proxy : {
    	type : 'uxrest',
    	url : adminPath + 'api/admin/uat',
    	reader : {
    		type : "json",
    		root : 'data'
    	}
    }
});