/**
 * @author nan partner可用的付款方式  api/partner/paymethod
 * @date 2026/1/30
 * @description TODO
 */


Ext.define('CGP.partner_bill.view.PartnerPayMethodCombo', {
    alias: 'widget.partner_pay_method_combo',
    extend: 'Ext.form.field.ComboBox',
    valueField: 'code',
    displayField: 'code',
    titleField: 'description',
    fieldLabel: '付款方式',
    editable: false,
    initComponent: function () {
        var me = this;
        me.store = Ext.create('Ext.data.Store', {
            fields: ['code', 'description', 'id', 'online', 'sortOrder', 'title'],
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/partner/paymethod',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
        });
        me.callParent();
    }
})