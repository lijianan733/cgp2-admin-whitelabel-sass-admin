Ext.Loader.syncRequire(
    ['CGP.common.field.WebsiteCombo']
)
Ext.onReady(function () {

    var mainController = Ext.create("CGP.promotionrule.controller.MainController");
    window.mainController = mainController;
    var promotionRuleStore = Ext.create("CGP.promotionrule.store.PromotionRule");

    var gridPage = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('promotionRule'),
        block: 'promotionrule',

        editPage: 'edit.html',

        gridCfg: {
            store: promotionRuleStore,
            frame: false,
            columns: [
                {
                    text: i18n.getKey('operation'),
                    sortable: false,
                    width: 105,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        var toggleStatusText = record.get('active') ? i18n.getKey('disableRule') : i18n.getKey('enableRule');
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
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
                                                disabledCls: 'menu-item-display-none',
                                                text: toggleStatusText,
                                                handler: function () {
                                                    mainController.toggleStatus(record);
                                                }
                                            },
                                            {
                                                disabledCls: 'menu-item-display-none',
                                                disabled: record.get('couponRequired') === false,
                                                text: i18n.getKey('coupon'),
                                                handler: function () {
                                                    mainController.showCouponManager(record.get('id'));
                                                }
                                            },
                                            {
                                                disabledCls: 'menu-item-display-none',
                                                text: i18n.getKey('checkCondition'),
                                                handler: function () {
                                                    mainController.showConditionManager(record);
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
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    itemId: 'id'
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    itemId: 'name'
                },
                {
                    text: i18n.getKey('isActive'),
                    dataIndex: 'active',
                    itemId: 'active',
                    renderer: function (v) {
                        return i18n.getKey(v + '');
                    }
                },
                {
                    text: i18n.getKey('isCumulative'),
                    dataIndex: 'cumulative',
                    itemId: 'cumulative',
                    renderer: function (v) {
                        return i18n.getKey(v + '');
                    }
                },
                {
                    text: i18n.getKey('promotion'),
                    width: 220,
                    dataIndex: 'policy',
                    itemId: 'policy',
                    renderer: function (v, m, r) {
                        return mainController.buildPolicyString(v);
                    }
                },
                {
                    text: i18n.getKey('promotionActive'),
                    width: 170,
                    dataIndex: 'promotionName',
                    itemId: 'promotionName'
                },
                {
                    text: i18n.getKey('website'),
                    width: 170,
                    dataIndex: 'websiteName',
                    itemId: 'websiteName'
                }
            ]
        },
        filterCfg: {
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'active',
                    xtype: 'combo',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'value', type: 'int'},
                            'name'
                        ],
                        data: [
                            {name: '是', value: 1},
                            {value: 0, name: '否'}
                        ]
                    }),
                    valueField: 'value',
                    displayField: 'name',
                    fieldLabel: i18n.getKey('isActive'),
                    itemId: 'active'
                },
                {
                    name: 'cumulative',
                    xtype: 'combo',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'value', type: 'int'},
                            'name'
                        ],
                        data: [
                            {name: '是', value: 1},
                            {value: 0, name: '否'}
                        ]
                    }),
                    valueField: 'value',
                    displayField: 'name',
                    fieldLabel: i18n.getKey('isCumulative'),
                    itemId: 'cumulative'
                },
                {
                    name: 'policy.orderTotalCode',
                    xtype: 'combo',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['code', 'name'],
                        data: [
                            {
                                code: 'ot_total_discount',
                                name: '整单优惠'
                            },
                            {
                                code: 'ot_subtotal_discount',
                                name: '产品优惠'
                            },
                            {
                                code: 'ot_shipping_discount',
                                name: '运费优惠'
                            }
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'code',
                    fieldLabel: i18n.getKey('promotionType'),
                    itemId: 'promotionType'
                },
                {
                    name: 'promotion.id',
                    xtype: 'combo',
                    store: Ext.create('CGP.promotion.store.Promotion'),
                    displayField: 'name',
                    valueField: 'id',
                    fieldLabel: i18n.getKey('promotionActive'),
                    itemId: 'promotionId'
                },
                {
                    name: 'website.id',
                    xtype: 'websitecombo',
                    itemId: 'website',
                    hidden: true,
                }
            ]
        },
        listeners: {
            afterload: function (p) {
                var searcher = Ext.Object.fromQueryString(location.search);
                mainController.setUrlSearchParam(p, searcher);
            }
        }
    });
});