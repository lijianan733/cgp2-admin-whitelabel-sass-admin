Ext.define('CGP.product.view.productattributeconstraint.model.DataStructureModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'optionId',
            type: 'string'
        },
        {
            name: 'skuAttributeId',
            type: 'int'
        }
        , {
            name: 'attributeName',
            type: 'string'
        }, {
            name: 'optionName',
            type: 'string'
        }, {
            name: 'leaf',
            type: 'boolean'
        }

    ]
});
