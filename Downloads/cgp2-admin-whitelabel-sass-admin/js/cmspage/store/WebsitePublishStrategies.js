Ext.define('CGP.cmspage.store.WebsitePublishStrategies',{
    extend : 'Ext.data.Store',
    fields : [{
        name : 'id',
        type : 'int',
        useNull: true
    },{
        name: 'title',
        type: 'string'
    },{
        name: 'websiteId',
        type: 'int'
    },{
        name: 'key',
        type: 'string'
    },{
        name: 'value',
        type: 'string'
    }
//	,{
//		name: 'ConfigurationGroup_id',
//		type: 'int'
//	}
    ],
    validations : [ {
        type : 'length',
        field : 'title',
        min : 1
    } ],
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/admin/cmsSetting/{websiteId}/publishStrategies',
        reader:{
            type:'json',
            root:'data'
        }
    }

});