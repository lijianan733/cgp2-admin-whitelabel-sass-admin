Ext.define("CGP.partner.store.CustomCurrencyStore",{
    extend : 'Ext.data.Store',
    model: 'CGP.partner.model.CurrencyModel',
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