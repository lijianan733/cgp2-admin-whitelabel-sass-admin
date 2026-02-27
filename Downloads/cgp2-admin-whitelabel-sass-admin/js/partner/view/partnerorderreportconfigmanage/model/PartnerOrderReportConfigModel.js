/**
 * Created by nan on 2018/1/10.
 */
Ext.define('CGP.partner.view.partnerorderreportconfigmanage.model.PartnerOrderReportConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'partnerId',
            type: 'int'
        },
        {
            name: 'statusId',
            type: 'int',
            useNull: true
        },
        {
            name: 'fileName',
            type: 'string'
        },
        {
            name: 'filePath',
            type: 'string'
        },
        {
            name: 'titlePositions',
            type: 'object'
        },
        {
            name: 'partnerReportOrderListConfig',
            type: 'object'
        },
        {
            name: 'expression',
            type: 'string'
        },
        {
            name: 'sheetIndex',
            type: 'int'
        },
        {
            name: 'dateInterval',
            type: 'int',
            useNull: true

        },
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'title',
            type: 'string'
        },
        {
            name: 'productConfigs',
            type: 'object'
        },
        {
            name: 'partnerReportSummaryConfig',
            type: 'object'
        },
        {
            name: 'partnerReportDetailsConfig',
            type: 'object'
        },
        {
            name: 'mailTemplateConfig',
            type: 'object'
        }
    ]
})
