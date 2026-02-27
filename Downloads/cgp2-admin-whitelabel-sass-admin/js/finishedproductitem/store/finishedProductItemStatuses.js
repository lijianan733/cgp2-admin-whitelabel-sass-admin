
Ext.define("CGP.finishedproductitem.store.finishedProductItemStatuses",{
    extend : 'Ext.data.Store',
    fields: [{name: 'id',type: 'int',useNull:true},
        {
            name: 'name',
            type: 'string',
            convert:function(value){
                return i18n.getKey(value);
            }
        }],
    proxy:{
        type:'uxrest',
        url:adminPath + 'api/finishedProductItemStatuses',
        reader:{
            type:'json',
            root:'data.content'
        }
    },

    autoLoad:true
});
