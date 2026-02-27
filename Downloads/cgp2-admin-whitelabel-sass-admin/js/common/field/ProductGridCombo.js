/**
 * @Description:简单的选择产品的gridCombo
 * @author nan
 * @date 2022/5/14
 */
Ext.define("CGP.common.field.ProductGridCombo", {
    extend: 'Ext.form.field.GridComboBox',
    alias: 'widget.productgridcombo',
    name: 'product._id',
    itemId: 'product',
    fieldLabel: i18n.getKey('product'),
    multiSelect: false,
    displayField: 'diyName',
    valueField: 'id',
    editable: false,
    matchFieldWidth: false,
    productType: 'Configurable',//SKU
    gotoConfigHandler: function (event) {
        var me = this;
        var productId = this.getSubmitValue()[0];
        if (productId) {
            JSOpen({
                id: 'productpage',
                url: path + 'partials/product/product.html?id=' + productId,
                title: i18n.getKey('product'),
                refresh: true
            });
        }
    },
    constructor: function (config) {
        var me = this;
        if (config.hasOwnProperty('gotoConfigHandler')) {
            me.gotoConfigHandler = config.gotoConfigHandler
        }
        me.callParent(arguments);
    },
    diyGetValue: function () {
        var me = this;
        return me.getSubmitValue()[0];
    },
    initComponent: function () {
        var me = this;
        var productStore = me.store = Ext.create('CGP.product.store.ProductStore', {
            autoLoad: false
        });
        me.filterCfg = {
            minHeight: 75,
            defaults: {
                isLike: false,
                width: 200,
                labelWidth: 60
            },
            items: [
                {
                    name: 'id',
                    itemId: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id')
                },
                {
                    name: 'name',
                    itemId: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name')
                },
                {
                    name: 'sku',
                    itemId: 'sku',
                    xtype: 'textfield',
                    isLike: true,
                    fieldLabel: i18n.getKey('sku')
                },
                {
                    name: 'type',
                    itemId: 'type',
                    xtype: 'combo',
                    editable: false,
                    isLike: true,
                    displayField: 'key',
                    valueField: 'value',
                    fieldLabel: i18n.getKey('type'),
                    value: me.productType,
                    hidden: !Ext.isEmpty(me.productType),
                    allowReset: false,
                    store: {
                        xtype: 'store',
                        fields: ['key', 'value'],
                        data: [
                            {
                                key: 'SKU', value: 'SKU'
                            },
                            {
                                key: 'Configurable', value: 'Configurable'
                            }
                        ]
                    }
                },
                {
                    name: 'mode',
                    itemId: 'mode',
                    fieldLabel: i18n.getKey('productMode'),
                    xtype: 'combo',
                    editable: false,
                    displayField: 'key',
                    valueField: 'value',
                    store: {
                        xtype: 'store',
                        fields: ['key', 'value'],
                        data: [
                            {
                                key: 'TEST', value: 'TEST'
                            },
                            {
                                key: 'RELEASE', value: 'RELEASE'
                            }
                        ]
                    }
                },
                {
                    name: 'model',
                    itemId: 'model',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('model')
                }
            ]
        };
        me.gridCfg = {
            store: productStore,
            height: 400,
            width: 750,
            viewConfig: {
                enableTextSelection: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    width: 90,
                    dataIndex: 'id'
                },
                {
                    text: i18n.getKey('name'),
                    minWidth: 260,
                    dataIndex: 'name'
                },
                {
                    text: i18n.getKey('type'),
                    flex: 1,
                    dataIndex: 'type'
                },
                {
                    text: i18n.getKey('mode'),    //产品模式
                    flex: 1,
                    dataIndex: 'mode'
                },
                {
                    text: i18n.getKey('model'),
                    flex: 1,
                    dataIndex: 'model'
                },
            ],
            bbar: {
                xtype: 'pagingtoolbar',
                store: productStore,
                displayInfo: true, // 是否 ? 示， 分 ? 信息
                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                emptyMsg: i18n.getKey('noData')
            }
        };
        me.callParent();
    }
})