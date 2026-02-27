Ext.define("CGP.product.view.productattributeprofile.store.AttributeGroupStore",{
    extend : 'Ext.data.Store',

    model : 'CGP.product.view.productattributeprofile.model.AttributeGroupModel',
    //autoSync : true,
    proxy : {
        type : 'memory'
    },
    sorters : [{
        property : 'sort',
        direction : 'ASC'
    }],
    listeners : {
        update: function(me,record, operation,modifiedFieldNames, eopts){
            me.sort("sort",'ASC');
        }
    }
});
