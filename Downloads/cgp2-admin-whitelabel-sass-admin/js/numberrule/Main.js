/**
 * Created by nan on 2017/12/14.
 */
Ext.syncRequire([
    'CGP.numberrule.store.NumberRoleStore',
    'CGP.numberrule.controller.Controller',
    'CGP.common.field.WebsiteCombo'
]);
Ext.onReady(function () {
    var store = Ext.create('CGP.numberrule.store.NumberRoleStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('numberrule'),
        block: 'numberrule',
        editPage: 'edit.html',
        tbarCfg: {
            hiddenButtons: ['delete']//按钮的名称
        },
        gridCfg: {
            store: store,
            selType: 'rowmodel',
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle'
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'name',
                    itemId: 'name',
                    width: 200,
                    sortable: true,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('format'),
                    dataIndex: 'format',
                    width: 200,
                    itemId: 'format',
                    sortable: true,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('website'),
                    dataIndex: 'website',
                    itemId: 'website',
                    width: 200,
                    sortable: false,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value.name;
                    }
                },
                {
                    text: i18n.getKey('serialNumber'),
                    dataIndex: 'serial',
                    itemId: 'serial',
                    sortable: true
                },
                {
                    text: i18n.getKey('isSerialRegenBaseDay'),
                    dataIndex: 'serialRegenBaseDay',
                    itemId: 'serialRegenBaseDay',
                    sortable: true,
                    renderer: function (value) {
                        return JSCreateFont(value == 0 ? 'red' : 'green',true,value == 0 ? '否' : '是');
                    }
                },
                {
                    text: i18n.getKey('smallest'),
                    dataIndex: 'smallest',
                    itemId: 'smallest',
                    sortable: true
                },
                {
                    text: i18n.getKey('largest'),
                    dataIndex: 'largest',
                    itemId: 'largest',
                    sortable: true,
                    flex: 1
                }

            ]
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: 'name',
                    xtype: 'combo',
                    editable: false,
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'name',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'name', type: 'string'}, {name: 'value', type: 'string'}
                        ],
                        data: [
                            {name: 'COUPON_NO', value: 'coupon_no'},
                            {name: 'ANONYMOUS_NO', value: 'anonymous_no'},
                            {name: 'ORDER_REDO_NO', value: 'order_redo_no'},
                            {name: 'ORDER_REPRINT_NO', value: 'order_reprint_no'},
                            {name: 'ORDER_REFUND_NO', value: 'order_refund_no'},
                            {name: 'ORDER_NUMBER', value: 'order_number'}
                        ]
                    }),
                    valueField: 'value',
                    displayField: 'value',
                },
                {
                    name: 'serialRegenBaseDay',
                    xtype: 'combo',
                    editable: false,
                    haveReset: true,
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'name', type: 'string'},
                            {name: 'value', type: 'int'}
                        ],
                        data: [
                            {name: '是', value: 1},
                            {name: '否', value: 0}
                        ]
                    }),
                    valueField: 'value',
                    displayField: 'name',
                    fieldLabel: i18n.getKey('isSerialRegenBaseDay'),
                    itemId: 'serialRegenBaseDay'
                },
                {
                    xtype: 'websitecombo',
                    name: 'website.id',
                    itemId: 'websiteCombo',
                },
            ]
        }
    });
});
