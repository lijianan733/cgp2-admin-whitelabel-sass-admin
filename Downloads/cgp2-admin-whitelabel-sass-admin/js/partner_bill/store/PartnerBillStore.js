/**
 * @author nan
 * @date 2026/1/26
 * @description TODO
 */
Ext.define("CGP.partner_bill.store.PartnerBillStore", {
    extend: 'Ext.data.Store',
    model: 'CGP.partner_bill.model.PartnerBillModel',
    pageSize: 25,
    remoteSort: true,
    autoLoad: true,
    params: null,
    proxy: {
        type: 'uxrest',
        url: adminPath + `api/partnerBills`,
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'createdDate',
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