Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.model.DataStructureModel', {
    extend: 'Ext.data.Model',
    idProperty : 'id',
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
            name: 'attributeId',
            type: 'int'
        },{
            name: 'attributeName',
            type: 'string'
        },{
            name: 'optionName',
            type: 'string'
        },{
            name: 'leaf',
            type: 'boolean'
        }

    ]
});
