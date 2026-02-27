/**
 * @author nan
 * @date 2026/1/27
 * @description TODO
 */

Ext.define("CGP.partner.view.PartnerGridCombo", {
    extend: 'Ext.form.field.GridComboBox',
    alias: 'widget.partner_grid_combo',
    store: null,
    multiSelect: false,
    valueField: 'id',
    displayField: 'email',
    editable: false,
    haveReset: true,
    matchFieldWidth: false,
    valueType: 'id',//recordData,idReference,id为可选的值类型
    gridCfg: null,
    filterCfg: null,
    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.partner.store.PartnerStore');
        me.gridCfg = Ext.Object.merge({
            store: me.store,
            width: 800,
            height: 420,
            selType: 'checkboxmodel',
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 120
                },
                {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    sortable: false,
                    width: 200,
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    sortable: false,
                    width: 200,
                },
                {
                    text: i18n.getKey('email'),
                    dataIndex: 'email',
                    width: 150,
                    flex: 1,
                    sortable: false,
                },
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: me.store,
            },
        }, me.gridCfg);
        me.filterCfg = Ext.Object.merge({
            height: 80,
            layout: {
                type: 'column',
                columns: 2
            },
            fieldDefaults: {
                labelAlign: 'right',
                layout: 'anchor',
                style: 'margin-right:20px; margin-top : 5px;',
                labelWidth: 70,
                width: 220,
            },
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    allowDecimals: false,
                    hideTrigger: true,
                    itemId: 'id'
                },
                {
                    name: 'code',
                    xtype: 'textfield',
                    itemId: 'code',
                    fieldLabel: i18n.getKey('code')
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    itemId: 'name',
                    fieldLabel: i18n.getKey('name')
                },
                {
                    name: 'email',
                    xtype: 'textfield',
                    itemId: 'email',
                    fieldLabel: i18n.getKey('email')
                },
                {
                    xtype: 'textfield',
                    itemId: 'partnerStatus',
                    name: 'partnerStatus',
                    hidden: true,
                    value: 'APPROVED'
                },
            ]
        }, me.filterCfg);
        me.callParent();
    },
    diyGetValue: function () {
        var me = this;
        return me.getArrayValue();
    },
    diySetValue: function (data) {
        var me = this;
        me.setInitialValue(data);
    }
})