Ext.define("CGP.product.view.productconfig.productviewconfig.store.BuilderLocation",{
    extend : 'Ext.data.Store',

    model : 'CGP.product.view.productconfig.productviewconfig.model.BuilderLocation',
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
