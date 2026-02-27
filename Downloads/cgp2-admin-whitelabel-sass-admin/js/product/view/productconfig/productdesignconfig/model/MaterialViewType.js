Ext.define('CGP.product.view.productconfig.productdesignconfig.model.MaterialViewType', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'clazz',
        type: "string"
    }, {
        name: 'name',
        type: 'string',
        convert: function (value, record) {
            if (Ext.isEmpty(value)) {
                return record.get('_id');
            } else {
                return value + '(' + record.get('_id') + ')';
            }
        }
    }, {
        name: 'designType',
        type: 'object'
    }, {
        name: 'preDesignObject',
        type: 'object'
    }, {
        name: 'sequenceNumber',
        type: 'int'
    }, {
        name: 'pageContentStrategy',
        type: 'string'
    }, {
        name: 'pageContentFetchStrategy',
        type: 'string'
    }, {
        name: 'pageContentQuantity',
        type: 'int'
    }, {
        name: 'viewQuantity',
        type: 'int'
    }, {
        name: 'pageContentSchemaId',
        type: 'string',
        useNull: true
    }, {
        name: 'description',
        type: 'string'
    }]
});