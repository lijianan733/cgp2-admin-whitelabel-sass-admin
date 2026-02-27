Ext.define("CGP.product.view.productattributeprofile.store.GroupAttributeStore",{
    extend : 'Ext.data.Store',

    model : 'CGP.product.view.productattributeprofile.model.GroupAttributeModel',
    autoSync : true,
    proxy : {
        type : 'memory'
    },
    sorters : [{
        property : 'id',
        direction : 'ASC'
    }],
    listeners : {
        update: function(me,record, operation,modifiedFieldNames, eopts){
            me.sort("id",'ASC');
        }
    }
});
