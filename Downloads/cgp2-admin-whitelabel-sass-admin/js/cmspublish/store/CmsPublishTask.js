Ext.define("CGP.cmspublish.store.CmsPublishTask",{
    extend : "Ext.data.Store",
    requires : ["CGP.cmspublish.model.CmsPublishTask"],

    model: 'CGP.cmspublish.model.CmsPublishTask',
   // remoteSort: 'true',
    pageSize: 25,
    url: adminPath + 'api/cmsPublishs/{0}/tasks',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/cmsPublishs/{0}/tasks',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoSync: true,
    autoLoad : true,
    sorters : [{
        property : 'sortOrder',
        direction : 'ASC'
    }],
    listeners : {
        update: function(me,record,operation,modifiedFieldNames, eopts){
            me.sort("sortOrder",'ASC');
        }
    },
    constructor: function(config){
        var me = this;
        var url = Ext.String.format(Ext.clone(me.url),config.id);
        me.proxy.url = url;
        me.callParent(arguments);
        /*me.on("write",function(store){
            store.sort("sortOrder","ASC");
        });*/
    }

});