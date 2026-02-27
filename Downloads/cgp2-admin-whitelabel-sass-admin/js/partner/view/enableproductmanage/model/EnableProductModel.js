/**
 * Created by nan on 2017/12/11.
 */
Ext.define('CGP.partner.view.enableproductmanage.model.EnableProductModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'name',
            type: 'string'

        }
        ,
        {
            name: 'model',
            type: 'string'

        }
        ,
        {
            name: 'sku',
            type: 'string'

        },
        {
            name: 'type',
            type: 'string'

        }
    ]
});
