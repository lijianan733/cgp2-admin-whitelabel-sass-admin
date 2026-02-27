Ext.define('CGP.cmssetting.model.CmsSettingModel',{
    extend : 'Ext.data.Model',
    idProperty:'id',
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
    },{
        name: 'website',
        type: 'object'
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
    }],
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/cmsSettings',
        reader:{
            type:'json',
            root:'data'
        },
        writer: {
            type : 'json'
        }
    }/*,
    constructor: function(config) {
        var websiteId = config.getQueryString('websiteId');
        this.proxy.url = adminPath + 'api/admin/cmsSetting/'+websiteId;
        this.callParent(arguments);
    }*/
});