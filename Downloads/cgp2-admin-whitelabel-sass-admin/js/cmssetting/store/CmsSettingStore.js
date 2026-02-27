Ext.define('CGP.cmssetting.store.CmsSettingStore',{
    extend : 'Ext.data.Store',
    model: 'CGP.cmssetting.model.CmsSettingModel',

    validations : [ {
        type : 'length',
        field : 'title',
        min : 1
    } ],
    autoLoad:true, 
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/{websiteId}/cmsSetting',
        reader:{
            type:'json',
            root:'data'
        }
    },
    constructor: function(config) {
        var websiteId = config.websiteId;
        this.proxy.url = adminPath + 'api/'+websiteId+'/cmsSettings';
        this.callParent(arguments);
    }

});