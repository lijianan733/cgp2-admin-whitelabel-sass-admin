/**
 * Created by nan on 2018/3/26.
 */
Ext.define('CGP.partner.view.supportableproduct.model.SupportableProductModel', {
    extend: 'Ext.data.Model',
    idProperty:'id',
    fields: [
        {
            name: 'id',
            type: 'int'
        },
        {
            name: 'model',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'type',
            type: 'string'
        },
        {
            name: 'multilingualKey',
            type: 'string',
            convert: function (value, record) {
                return record.raw?.clazz;
            }
        }
    ]
})
