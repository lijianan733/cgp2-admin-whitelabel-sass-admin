/**
 * @author nan
 * @date 2026/1/26
 * @description TODO
 */
Ext.define('CGP.partner_credit.model.PartnerCreditTransactionModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'int',
            useNull: true
        },
        //变化的金额
        {
            name: 'amount',
            type: 'number',
        },
        //(valUe="INCREASE-增力,DECREASE-减少")
        {
            name: 'changeType',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue:"com.qpp.cgp.domain.partner.credit.PartnerCreditTransaction"
        },
        //信贷类型，
        //MANAGEMENT_CREDIT-管理,RISK_CREDIT-风险
        {
            name: 'creditType',
            type: 'string',
        },

        {
            name: 'currency',
            type: 'object'
        },
        {
            name: 'date',
            type: 'string'
        },
        {
            name: 'modifiedDate',
            type: 'string'
        },
        //流水来源Id
        {
            name: 'sourceId',
            type: 'string'
        },
        //流水来源
        {
            name: 'sourceType',
            type: 'string'
        },

    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + `api/partner/{partnerId}/credit/transaction`,
        reader: {
            type: 'json',
            root: 'data'
        }
    },
});
