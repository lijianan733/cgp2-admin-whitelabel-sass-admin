/**
 * Created by admin on 2019/11/23.
 */
Ext.define("CGP.product.view.bothwayattributemapping.model.TwoWayAttributeMappingGrid", {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'index',
            type: 'int',
            persist: false
        },
        {
            name: 'leftValues',
            type: 'array'
        },
        {
            name: 'rightValues',
            type: 'array'
        }
    ]
});
