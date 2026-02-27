
Ext.define('CGP.material.model.MaterialViewType',{
    extend : 'Ext.data.Model',
	idProperty : '_id',
    fields : [{
        name: '_id',
        type: 'string',
        useNull: true
    },{
        name: 'name',
        type: 'string'
    },{
        name: 'designType',
        type: 'object'
    },{
        name: 'preDesignObject',
        type: 'object'
    },{
        name: 'sequenceNumber',
        type: 'int'
    },{
        name: 'pageContentStrategy',
        type: 'string'
    },{
        name: 'pageContentFetchStrategy',
        type: 'string'
    },{
        name: 'pageContentQuantity',
        type: 'int'
    },{
        name: 'viewQuantity',
        type: 'int'
    },{
        name: 'pageContentSchemaId',
        type: 'string',
        useNull: true
    }]
});