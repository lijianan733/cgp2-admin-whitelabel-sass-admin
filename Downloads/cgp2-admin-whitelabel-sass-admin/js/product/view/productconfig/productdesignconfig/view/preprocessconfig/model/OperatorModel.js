/**
 * Created by nan on 2020/2/19.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.OperatorModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'displayName',
            type: 'string',
            convert:function (value,record) {
                return record.get('description') +'<'+record.get('_id')+'>'
            }
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/operatorcontroller',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
