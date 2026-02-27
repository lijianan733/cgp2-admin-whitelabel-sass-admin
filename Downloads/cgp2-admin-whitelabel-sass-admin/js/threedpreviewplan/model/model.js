
Ext.define("CGP.threedpreviewplan.model.model",{
    extend : 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'description',
        type: 'string'
    }, 'name',{
        'name': 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.product.config.model.ThreeDModelConfig'
    },{
        name: 'status',
        type: 'string'
    },{
        name: 'threeDVariableConfig',
        type: 'object'
    },{
        name: 'displayName',
        type: 'string',
        convert: function (value,record){
            var name = record.get('name');
            var id = record.get('_id');
            var displayName = name + '<'+id+'>';
            return displayName;
        }
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/threedmodeltestplans',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
