/**
 * @author nan
 * @date 2026/1/26
 * @description 信贷流水
 */
Ext.Loader.syncRequire([
    'CGP.partner_credit.model.PartnerCreditModel'
])
Ext.define("CGP.partner_credit.store.PartnerCreditTransactionStore", {
    extend: 'Ext.data.Store',
    model: 'CGP.partner_credit.model.PartnerCreditTransactionModel',
    pageSize: 25,
    remoteSort: true,
    autoLoad: true,
    params: null,
    proxy: {
        type: 'uxrest',
        url: adminPath + `api/partner/{partnerId}/credit/transaction`,
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'date',
        direction: 'DESC'
    }],
    constructor: function (config) {
        var me = this;
        if (config && config.partnerId) {
            me.proxy.url = adminPath + `api/partner/${config.partnerId}/credit/transaction`;
        }
        me.callParent(arguments);
    },
});
