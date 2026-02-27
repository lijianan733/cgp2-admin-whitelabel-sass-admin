/**
 * Created by nan on 2017/12/8.
 *可用产品的弹窗中包含的panel
 */
Ext.syncRequire(['CGP.partner.view.enableproductmanage.store.EnableProductStore', 'CGP.partner.view.enableproductmanage.model.EnableProductModel'])
Ext.define("CGP.partner.view.enableproductmanage.view.EnableProductManagePanel", {
    extend: 'CGP.partner.view.ProductSearchGrid',
    minWidth: 300,
    border: false,
    tbarCfg: {
        disabledButtons: ['config'],
        itemId: 'toolbar',
        btnExport: {
            disabled: true
        },
        btnImport: {
            disabled: true
        }
    },
    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

    },
    initComponent: function () {
        var me = this;
        var websiteStore = Ext.create('CGP.partner.store.WebsiteStore');
        var store = Ext.create('CGP.partner.view.enableproductmanage.store.EnableProductStore', {
            partnerId: me.partnerId
        });
        me.gridCfg = {
            frame: false,
            viewConfig: {
                enableTextSelection: true
            },
            store: store,
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_create',
                    handler: function () {
                        var store = this.ownerCt.ownerCt.getStore();
                        me.controller.addProductWindow(me.partnerId, me.websiteId, store)
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('delete'),
                    iconCls: 'icon_delete',
                    handler: function () {
                        me.controller.deleteSelectProducts(me);
                    }
                }
            ],
            deleteAction: false,
            editAction: false,
            selType: 'checkboxmodel',
            columns: [
                {
                    xtype: 'actioncolumn',
                    width: 40,
                    itemId: 'actioncolumn',
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actiondelete',
                            tooltip: i18n.getKey('delete'),
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.controller.deleteSelect(me, record)
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 100,
                    itemId: 'id'
                },
                {
                    text: i18n.getKey('operation'),
                    sortable: false,
                    width: 105,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            hidden: record.get('type') == 'SKU',
                            style: 'padding:0',
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                            {
                                                //产品计价策略管理
                                                text: i18n.getKey('partner零售价格'),
                                                disabledCls: 'menu-item-display-none',
                                                disabled: record.get('type') == 'SKU',
                                                menu: {
                                                    items: [
                                                        {
                                                            text: i18n.getKey('pricingStrategy') + i18n.getKey('config') + i18n.getKey('V2'),
                                                            disabledCls: 'menu-item-display-none',
                                                            disabled: record.get('type') == 'SKU',
                                                            handler: function () {
                                                                var partnerId = me.partnerId;
                                                                var productId = record.getId();
                                                                JSOpen({
                                                                    id: 'partnerProductPriceRule',
                                                                    url: path + "partials/pricingstrategy/main.html" +
                                                                        "?productId=" + productId +
                                                                        '&partnerId=' + partnerId +
                                                                        '&clazz=com.qpp.cgp.domain.partner.price.PartnerProductPricingConfig',
                                                                    title: i18n.getKey('pricingStrategy') + i18n.getKey('config') + i18n.getKey('manager'),
                                                                    refresh: true
                                                                })
                                                            }
                                                        },
                                                        {
                                                            text: i18n.getKey('costingStrategy') + i18n.getKey('config') + i18n.getKey('V2'),
                                                            disabledCls: 'menu-item-display-none',
                                                            disabled: record.get('type') == 'SKU',
                                                            handler: function () {
                                                                var partnerId = me.partnerId;
                                                                var productId = record.getId();
                                                                JSOpen({
                                                                    id: 'partnerProductCostingRule',
                                                                    url: path + "partials/pricingstrategy/main.html" +
                                                                        "?productId=" + productId +
                                                                        '&partnerId=' + partnerId +
                                                                        '&clazz=com.qpp.cgp.domain.partner.consting.PartnerProductCostingConfig',
                                                                    title: i18n.getKey('costingStrategy') + i18n.getKey('config') + i18n.getKey('manager'),
                                                                    refresh: true
                                                                })
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                text: i18n.getKey('产品销售给partner价格') + i18n.getKey('config'),
                                                disabledCls: 'menu-item-display-none',
                                                disabled: record.get('type') == 'SKU',
                                                handler: function () {
                                                    var partnerId = me.partnerId;
                                                    var productId = record.getId();
                                                    JSOpen({
                                                        id: 'partnerProductPriceRules',
                                                        url: path + "partials/pricingstrategy/main.html" +
                                                            "?productId=" + productId +
                                                            '&partnerId=' + partnerId +
                                                            '&clazz=com.qpp.cgp.domain.partner.PartnerProductConfig',
                                                        title: i18n.getKey('pricingStrategy') + i18n.getKey('config') + i18n.getKey('manager'),
                                                        refresh: true
                                                    })
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        };
                    }
                },

                {
                    text: i18n.getKey('model'),
                    dataIndex: 'model',
                    width: 200,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value
                    }
                },
                /*{
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 200,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value
                    }
                },*/
                {
                    text: i18n.getKey('sku'),
                    dataIndex: 'sku',
                    width: 180,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value
                    }
                }
                ,
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'type'
                }


            ]
        };
        me.filterCfg = {
            height: 100,
            defaults: {
                width: 280
            },
            frame: false,
            border: false,
            header: false,
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id',
                    minValue: 1,
                    allowDecimals: false,
                    allowExponential: false,
                    hideTrigger: true
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'model',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('model'),
                    itemId: 'model'
                },
                {
                    name: 'type',
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'type',
                    xtype: 'combo',
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: 'Sku', value: 'SKU'
                            },
                            {
                                type: 'Configurable', value: 'Configurable'
                            }
                        ]
                    }),
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'

                },
                {
                    name: 'sku',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('sku'),
                    itemId: 'sku'
                }
            ]
        };
        me.callParent(arguments);
    }
});
