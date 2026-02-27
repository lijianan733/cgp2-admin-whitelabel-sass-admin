/**
 * Created by nan on 2018/6/15.
 */
Ext.define('CGP.partner.view.supplierorderconfig.model.OrderStatusChangeNotifyConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.partner.order.config.OrderStatusChangeNotifyConfig'
        },
        {
            name: 'preStatusId',
            type: 'int'
        },
        {
            name: 'postStatusId',
            type: 'int'
        },
        {
            name: 'serviceType',
            type: 'string'
        },
        {
            name: 'notifyTemplates',
            type: 'object'
        }


    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + ' api/partners/{partnerId}/orderStatusChangeNotifyConfigs/{configId}',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})

