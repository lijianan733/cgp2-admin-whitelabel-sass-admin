/**
 * @author nan
 * @date 2026/1/26
 * @description TODO
 */
Ext.Loader.syncRequire([
    'CGP.partner_credit.model.PartnerCreditModel'
])
Ext.define("CGP.partner_credit.store.PartnerCreditStore", {
    extend: 'Ext.data.Store',
    model: 'CGP.partner_credit.model.PartnerCreditModel',
    pageSize: 25,
    remoteSort: true,
    autoLoad: true,
    params: null,
    proxy: {
        type: 'uxrest',
        url: adminPath + `api/partner/credit`,
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'configCreatedDate',
        direction: 'DESC'
    }],
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
});
