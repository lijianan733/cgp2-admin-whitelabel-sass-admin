/**
 * Created by nan on 2018/4/23.
 */
Ext.define('CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.model.OrderStatusChangeMailConfigModel', {
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
            defaultValue: 'com.qpp.cgp.domain.partner.ProducerOrderStatusChangeMailConfig'
        },
        {
            name: 'mailTemplateConfig',
            type: 'object'
        },
        {
            name: 'partnerId',
            type: 'int'
        },
        {
            name: 'curStatusId',
            type: 'int'
        },
        {
            name: 'preStatusId',
            type: 'int'
        },
        {
            name: 'use',
            type: 'string',
            defaultValue: 'qp'
        },
        {
            name: 'partnerId',
            type: 'int'
        },
        {
            name: 'type',
            type: 'string'
        }

    ]

});
