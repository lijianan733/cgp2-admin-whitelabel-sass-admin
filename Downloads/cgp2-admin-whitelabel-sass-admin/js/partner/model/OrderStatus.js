Ext.define('CGP.partner.model.OrderStatus',{
    extend : 'Ext.data.Model',
    idProperty:'id',
    fields : [{
        name : 'id',
        type : 'int',
        useNull : true
    },{
        name: 'name',
        type: 'string',
        convert: function(value,record){
            return i18n.getKey(value);
        }
    }]

});