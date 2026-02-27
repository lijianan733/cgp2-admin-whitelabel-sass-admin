/**
 * @author nan
 * @date 2025/5/22
 * @description TODO
 */
Ext.Loader.syncRequire([
    'CGP.customerordermanagement.store.CustomerordermanagementStore'
])
Ext.define('CGP.customerordermanagement.view.CustomerOrderSelector', {
    extend: 'Ext.form.field.GridComboBox',
    alias: 'widget.customer_order_selector',
    displayField: '_id',
    valueField: '_id',
    editable: false,
    matchFieldWidth: false,
    multiSelect: false,
    autoQuery: false,
    haveReset: true,
    valueType: 'id',//recordData,idReference,id为可选的值类型
    gotoConfigHandler: function () {
        var me = this;
        var id = me.getArrayValue();
        JSOpen({
            id: 'customer_order_managementpage',
            url: path + 'partials/customerordermanagement/main.html?_id=' + id,
            title: i18n.getKey('Customer订单管理'),
            refresh: true
        });
    },
    initComponent: function () {
        var me = this;
        me.store = me.store || Ext.create('CGP.customerordermanagement.store.CustomerordermanagementStore');
        me.gridCfg = Ext.Object.merge({
            height: 400,
            width: 800,
            columns: [
                {
                    xtype: 'rownumberer'
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    width: 100
                },
                {
                    text: '订单号',
                    width: 150,
                    dataIndex: 'bindOrderNumber',
                },
                {
                    text: '状态',
                    width: 100,
                    dataIndex: 'customerStatus',
                },
                {
                    xtype: 'auto_bread_word_column',
                    text: '店铺',
                    width: 200,
                    dataIndex: 'customerNameText',
                },
                {
                    text: '订单金额',
                    width: 120,
                    dataIndex: 'storeOrderAmount',
                },
                {
                    text: '下单时间',
                    flex: 1,
                    dataIndex: 'datePurchased',
                    renderer: function (value, metadata, record) {
                        var date = new Date(value);
                        metadata.style = "color: gray";
                        date = Ext.Date.format(date, 'Y/m/d H:i');
                        metadata.tdAttr = 'data-qtip="' + date + '"';
                        return '<div style="white-space:normal;">' + date + '</div>';
                    }
                },
            ],
            bbar: {
                xtype: "pagingtoolbar",
                store: me.store
            }
        }, me.gridCfg);
        me.filterCfg = Ext.Object.merge({
            minHeight: 60,
            layout: {
                type: 'column',
                columns: 2
            },
            items: [
                {
                    xtype: 'numberfield',
                    hideTrigger: true,
                    name: '_id',
                    itemId: '_id',
                    fieldLabel: i18n.getKey('id')
                },
                {
                    xtype: 'textfield',
                    name: 'bindOrderNumber',
                    itemId: 'bindOrderNumber',
                    fieldLabel: i18n.getKey('订单号')
                },
                {
                    xtype: 'textfield',
                    name: 'customerNameText',
                    itemId: 'customerNameText',
                    fieldLabel: i18n.getKey('所属店铺')
                },
                {
                    xtype: 'combo',
                    fieldLabel: '店铺类型',
                    editable: false,
                    name: 'platformCode',
                    itemId: 'platformCode',
                    valueField: 'value',
                    displayField: 'display',
                    value: 'PopUp',
                    hidden: true,
                    store: {
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                value: 'WooCommerce',
                                display: 'WooCommerce'
                            },
                            {
                                value: 'PopUp',
                                display: 'PopUp'
                            }
                        ]
                    }
                }
            ]
        }, me.filterCfg);
        me.callParent();
    }
})