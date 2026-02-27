/**
 * @Description:
 * @author nan
 * @date 2023/7/5
 */
Ext.Loader.syncRequire([
    'CGP.promotion.model.Promotion',
    'Ext.ux.toolbar.SplitBar',
    'CGP.promotion.view.PromotionDiscount',
    'CGP.promotion.view.PromotionTicket',
    'CGP.promotion.view.PromotionLimitation',
    'CGP.promotion.view.PromotionDiscountContainer'
]);
Ext.onReady(function () {
    var page = Ext.widget('uxeditpage', {
        block: 'promotion',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        tbarCfg: {
            hiddenButtons: ['create', 'copy', 'config', 'help', 'export', 'import'],
            btnReset: {
                handler: function () {
                    location.reload();
                }
            },
        },
        formCfg: {
            model: 'CGP.promotion.model.Promotion',
            remoteCfg: false,
            isValidForItems: true,
            autoScroll: true,
            useForEach: true,
            layout: 'vbox',
            defaults: {
                labelAlign: 'right',
                width: 380,
                margin: '5 25 0 25',
            },
            fieldDefaults: {},
            items: [
                {
                    xtype: 'splitbar',
                    width: '100%',
                    margin: 5,
                    colspan: 2,
                    title: '<font color="green" style="font-weight: bold">' + i18n.getKey('基本信息') + '</font>'
                },
                {
                    xtype: 'hiddenfield',
                    name: '_id',
                    fieldLabel: i18n.getKey('_id'),
                    itemId: '_id',
                    allowBlank: true
                },
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name',
                    allowBlank: false,
                },
                {
                    xtype: 'textfield',
                    name: 'displayName',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('displayName'),
                    itemId: 'displayName',
                },
                {
                    xtype: 'combo',
                    name: 'status',
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    valueField: 'value',
                    displayField: 'display',
                    editable: false,
                    haveReset: true,
                    allowBlank: false,
                    value: 'draft',
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'draft',
                                display: i18n.getKey('草稿'),
                            },
                            {
                                value: 'effective',
                                display: i18n.getKey('启用'),
                            },
                            {
                                value: 'invalid',
                                display: i18n.getKey('作废'),
                            }]
                    }
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('生效环境'),
                    itemId: 'mode',
                    name: 'mode',
                    valueField: 'value',
                    displayField: 'display',
                    editable: false,
                    haveReset: true,
                    value: 'Stage',
                    allowBlank: false,
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [{
                            value: 'Stage',
                            display: i18n.getKey('Stage'),
                        }, {
                            value: 'Production',
                            display: i18n.getKey('Release'),
                        }]
                    }
                },
                {
                    xtype: 'checkboxgroup',
                    name: 'effectiveOrders',
                    itemId: 'effectiveOrders',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('支持的订单类型'),
                    labelWidth: 120,
                    columns: 3,
                    vertical: true,
                    items: [
                        {boxLabel: 'Sample', width: 80, name: 'rb1', inputValue: 'Sample', checked: true},
                        {boxLabel: 'BulkOrder', width: 80, name: 'rb2', inputValue: 'BulkOrder'}
                    ]
                },
                {
                    xtype: 'radiogroup',
                    name: 'isAutomatic',
                    itemId: 'isAutomatic',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('是否需要优惠码'),
                    labelWidth: 120,
                    columns: 2,
                    diyGetValue: function () {
                        var me = this,
                            data = me.getValue();
                        return data['rb1'];
                    },
                    items: [
                        {boxLabel: '是', width: 80, name: 'rb1', inputValue: false, checked: true},
                        {boxLabel: '否', width: 80, name: 'rb1', inputValue: true}
                    ],
                    listeners: {
                        change: function (comp, value) {
                            var page = comp.ownerCt,
                                {rb1} = value,
                                promotionTicket = page.getComponent('promotionTicket'),
                                promotionDiscount = page.getComponent('promotionDiscount'),
                                promotionDiscountItem = promotionDiscount.getComponent('promotionDiscount');

                            promotionTicket.setVisible(!rb1);
                            promotionTicket.setDisabled(rb1);

                            // 如果没有优惠码便不允许创建订单优惠券
                            promotionDiscount.setAddBtnVisible('order', !rb1);
                            if (rb1) {
                                promotionDiscountItem.clearTypeItem('order', '订单优惠券必须配置优惠码! 切换将无法创建订单优惠券!', function () {
                                    const itemsLength = promotionDiscountItem.items.items.length;
                                    !itemsLength && promotionDiscountItem.addItem({strategy: 'Percentage'}, 'product');
                                }, function () {
                                    comp.setValue({rb1: false});
                                });
                            }
                        }
                    }
                },
                {
                    xtype: 'uxfieldcontainer',
                    name: 'effectiveTime',
                    itemId: 'effectiveTime',
                    scope: true,
                    layout: 'hbox',
                    defaults: {
                        editable: false,
                        allowBlank: false,
                    },
                    width: 380,
                    allowBlank: true,
                    fieldLabel: i18n.getKey('生效时间范围'),
                    format: 'Y/m/d',
                    items: [
                        {
                            xtype: 'hiddenfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            value: 'com.qpp.cgp.domain.promotion.timeSpan.DurationTime',
                            diySetValue: Ext.emptyFn

                        },
                        {
                            xtype: 'datetimefield',
                            flex: 1,
                            name: 'startDate',
                            itemId: 'startDate',
                            format: "Y/m/d H:i:s",
                            allowBlank: true,
                            listeners: {
                                select: function (field, newValue, oldValue) {
                                    var field = field.ownerCt.getComponent('endDate');
                                    field.setMinValue(newValue);
                                }
                            }
                        },
                        {
                            xtype: 'displayfield',
                            value: ' ~ ',
                            width: 10,
                            diyGetValue: Ext.emptyFn,
                            diySetValue: Ext.emptyFn,
                        },
                        {
                            xtype: 'datetimefield',
                            flex: 1,
                            name: 'endDate',
                            itemId: 'endDate',
                            allowBlank: true,
                            format: "Y/m/d H:i:s",
                        }
                    ],
                    getErrors: function () {
                        return {
                            '生效时间范围': '该配置必须完备'
                        }
                    },
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            if (data.startDate) {
                                me.getComponent('startDate').setValue(new Date(data.startDate));
                            }
                            if (data.endDate) {
                                me.getComponent('endDate').setValue(new Date(data.endDate));
                            }
                        } else {
                            me.getComponent('startDate').reset();
                            me.getComponent('endDate').reset();
                        }
                    },
                    diyGetValue: function () {
                        var me = this;
                        var data = me.getValue();
                        if (data.endDate || data.startDate) {
                            return {
                                "clazz": "com.qpp.cgp.domain.promotion.timeSpan.DurationTime",
                                "startDate": data.startDate ? JSFormatTime(data.startDate) : null,
                                "endDate": data.endDate ? JSFormatTime(data.endDate) : null
                            }
                        } else {
                            return null;
                        }
                    }
                },
                {
                    xtype: 'textarea',
                    name: 'description',
                    height: 80,
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description',
                    allowBlank: true,
                },
                {
                    xtype: 'promotionLimitation',
                    margin: 0,
                    width: '100%',
                    itemId: 'promotionLimitation',
                    name: 'promotionLimitation'
                },
                {
                    xtype: 'uxfieldcontainer',
                    layout: 'vbox',
                    width: '100%',
                    margin: 0,
                    itemId: 'promotionTicket',
                    name: 'CGP.promotion.model.Promotion.promotionTicket',
                    diyGetValue: function () {
                        const me = this,
                            promotionTicket = me.getComponent('promotionTicket');
                        return promotionTicket.diyGetValue();
                    },
                    diySetValue: function (data) {
                        const me = this,
                            promotionTicket = me.getComponent('promotionTicket');
                        promotionTicket.diySetValue(data);
                    },
                    isValid: function () {
                        const me = this,
                            promotionTicket = me.getComponent('promotionTicket');
                        if (!me.disabled) {
                            return promotionTicket.isValid();
                        }
                        return true;
                    },
                    getName: function (comp) {
                        return this?.name;
                    },
                    getErrors: function () {
                        return '不允许为空';
                    },
                    items: [
                        {
                            xtype: 'splitbar',
                            width: '100%',
                            itemId: 'splitbar3',
                            margin: 5,
                            colspan: 2,
                            title: '<font color="green" style="font-weight: bold">' + i18n.getKey('促销票据') + '</font>'
                        },
                        {
                            xtype: 'promotion_ticket',
                            width: 900,
                            itemId: 'promotionTicket',
                            name: 'promotionTicket',
                            margin: '5 25 5 25',
                        }
                    ]
                },
                {
                    xtype: 'PromotionDiscountContainer',
                    margin: 0,
                    width: '100%',
                    itemId: 'promotionDiscount',
                    name: 'promotionDiscount',
                },
            ],
        },
    });
});
