/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.OrderItemsMultipleAddressModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
            {
                name: 'id',
                type: 'int',
                useNull: true
            },
            {
                name: 'clazz',
                type: 'string',
                defaultValue: 'com.qpp.cgp.domain.common.color.RgbColor'
            },
            {
                name: 'type',
                type: 'string'
            },
            {
                name: 'name',
                type: 'string'
            },
            {
                name: 'isBoolean',
                type: 'string'
            },
            {
                name: 'hua',
                type: 'string',
            }
            ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/colors',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})