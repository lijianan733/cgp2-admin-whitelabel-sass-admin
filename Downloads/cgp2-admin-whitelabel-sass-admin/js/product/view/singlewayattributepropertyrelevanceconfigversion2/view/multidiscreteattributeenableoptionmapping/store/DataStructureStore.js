Ext.define("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.store.DataStructureStore",{
    extend : 'Ext.data.TreeStore',
    model: 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.model.DataStructureModel',
    autoSync : true,
    nodeParam: 'id',

    root: {
        expanded: true,
        id: JSGetUUID(),
        optionId: 'root',
        optionName: 'root',
        attributeId: 0,
        children: [{
            expanded: true,
            id: JSGetUUID(),
            optionId: '12',
            optionName: '12',
            leaf: false,
            attributeId: 12
        }]
    },
    proxy : {
        type : 'memory'
    }
});
