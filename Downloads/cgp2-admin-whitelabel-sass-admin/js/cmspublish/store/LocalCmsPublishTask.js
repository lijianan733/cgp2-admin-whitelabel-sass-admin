Ext.define("CGP.cmspublish.store.LocalCmsPublishTask",{
    extend : 'Ext.data.Store',
    requires : ["CGP.cmspublish.model.CmsPublishTask"] ,

    model : 'CGP.cmspublish.model.CmsPublishTask',
    autoSync : true,
    proxy : {
        type : 'memory'
    },
    sorters : [{
        property : 'sortOrder',
        direction : 'ASC'
    }],
    listeners : {
        update: function(me,record, operation,modifiedFieldNames, eopts){
            me.sort("sortOrder",'ASC');
        }
    }
});
