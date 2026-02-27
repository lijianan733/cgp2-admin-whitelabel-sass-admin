/**
 * @author xiu
 * @date 2025/3/20
 */
Ext.define('CGP.partner.view.popStoreRestrict.createWriteLimitComp', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.write_limit_comp',
    width: '100%',
    layout: 'vbox',
    diyGetValue: function () {
        var me = this,
            {itemId} = me,
            comp = me.getComponent(itemId);

        return comp.diyGetValue();
    },
    diySetValue: function (data) {
        var me = this,
            {itemId} = me,
            comp = me.getComponent(itemId),
            typeComp = me.getComponent('type');

        typeComp['limitValue'] = data['limit'];
        typeComp['defaultValue'] = data['defaultValue'];

        comp.diySetValue(data);
        typeComp.setValue({
            type: data['type']
        })
    },
    commonGetLimitValue: function () {
        var me = this,
            limit = me.getComponent('limit');
        return limit.getValue();
    },
    initComponent: function () {
        var me = this,
            {itemId} = me,
            limitListenerChange = {
                change: function (comp, value) {
                    var panel = comp.ownerCt.ownerCt,
                        typeComp = panel.getComponent('type'),
                        {defaultValue} = typeComp,
                        type = value === +defaultValue ? 'default' : 'custom'

                    typeComp.setValue({
                        type: type
                    });
                }
            }
        me.items = [
            {
                xtype: 'radiogroup',
                width: 400,
                colspan: 2,
                fieldLabel: i18n.getKey(me.title),
                labelWidth: 160,
                name: 'type',
                itemId: 'type',
                defaultValue: null,
                items: [
                    {
                        boxLabel: '系统默认',
                        name: 'type',
                        inputValue: 'default',
                    },
                    {
                        boxLabel: '自定义',
                        name: 'type',
                        inputValue: 'custom'
                    }
                ],
                listeners: {
                    change: function (comp, newValue) {
                        var {type} = newValue,
                            container = me.getComponent(itemId),
                            limitComp = container.getComponent('limit'),
                            limitValue = limitComp.getValue(),
                            typeGather = {
                                default: function () {
                                    limitComp.setValue(comp['defaultValue']);
                                },
                                custom: function () {
                                    if (limitValue === comp['defaultValue']){
                                        limitComp.setValue(comp['limitValue']);
                                    }
                                },
                            };

                        typeGather[type]()
                    }
                }
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'limitContainer',
                itemId: 'limitContainer',
                width: '100%',
                layout: {
                    type: 'column',
                    columns: 2
                },
                defaults: {
                    margin: '5 10 0 0',
                },
                hidden: true,
                disabled: true,
                diyGetValue: me.commonGetLimitValue,
                diySetValue: function (data) {
                    var me = this,
                        limit = me.getComponent('limit'),
                        description = me.getComponent('description'),
                        description2 = me.getComponent('description2');

                    data['limit'] && limit.setValue(data['limit']);
                    description.diySetValue(data['partnerQty']);
                    description2.diySetValue(data);
                    description.originValue = data['partnerQty'];
                },
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'limit',
                        itemId: 'limit',
                        width: 120,
                        allowBlank: false,
                        hideTrigger: true,
                        minValue: 1,
                        listeners: {
                            change: function (comp, value) {
                                var container = comp.ownerCt,
                                    panel = container.ownerCt,
                                    typeComp = panel.getComponent('type'),
                                    description = container.getComponent('description'),
                                    {defaultValue} = typeComp,
                                    type = value === +defaultValue ? 'default' : 'custom'

                                typeComp.setValue({
                                    type: type
                                });
                                // description.diySetValue(value);
                            }
                        },
                    },
                    {
                        xtype: 'displayfield',
                        name: 'description',
                        itemId: 'description',
                        value: '当前Partner已建 0个',
                        originValue: 0,
                        diySetValue: function (data) {
                            var me = this,
                                container = me.ownerCt,
                                limitComp = container.getComponent('limit'),
                                {originValue} = me,
                                displayQtyText = JSCreateFont('green', true, data + originValue)

                            if (data) {
                                me.setValue(`当前Partner已建 ${data}个。`)
                                limitComp.setMinValue(data);
                            }
                        }
                    },
                    {
                        xtype: 'displayfield',
                        name: 'description2',
                        itemId: 'description2',
                        value: '（所有Partner）共已建store  10个。',
                        columnWidth: 2, //column占据一行
                        diySetValue: function (data) {
                            var me = this;
                            if (data) {
                                var {total, qty} = data;
                                me.setValue(`（所有Partner）共已建store  ${qty}个。`)
                            }
                        }
                    },
                ]
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'productLimitContainer',
                itemId: 'productLimitContainer',
                width: '100%',
                layout: 'hbox',
                defaults: {
                    margin: '5 10 0 0',
                },
                hidden: true,
                disabled: true,
                diyGetValue: me.commonGetLimitValue,
                diySetValue: function (data) {
                    var me = this,
                        limit = me.getComponent('limit');

                    data['limit'] && limit.setValue(data['limit']);
                },
                items: [
                   
                    {
                        xtype: 'displayfield',
                        name: 'description',
                        itemId: 'description',
                        value: '每个store',
                    },
                    {
                        xtype: 'numberfield',
                        name: 'limit',
                        itemId: 'limit',
                        width: 120,
                        allowBlank: false,
                        hideTrigger: true,
                        minValue: 1,
                        listeners: limitListenerChange
                    },
                    {
                        xtype: 'displayfield',
                        name: 'description2',
                        itemId: 'description2',
                        value: '个产品。',
                    },
                ]
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'productPriceLimitContainer',
                itemId: 'productPriceLimitContainer',
                width: '100%',
                layout: 'hbox',
                defaults: {
                    margin: '5 10 0 0',
                },
                hidden: true,
                disabled: true,
                diyGetValue: me.commonGetLimitValue,
                diySetValue: function (data) {
                    var me = this,
                        limit = me.getComponent('limit');

                    data['limit'] && limit.setValue(data['limit']);
                },
                items: [
                    {
                        xtype: 'displayfield',
                        name: 'description1',
                        itemId: 'description1',
                        value: '店铺产品价格，在设置时只能小于等于',
                    },
                    {
                        xtype: 'numberfield',
                        name: 'limit',
                        itemId: 'limit',
                        width: 120,
                        allowBlank: false,
                        hideTrigger: true,
                        minValue: 1,
                        listeners: limitListenerChange
                    },
                    {
                        xtype: 'displayfield',
                        name: 'description2',
                        itemId: 'description2',
                        value: '倍于QPMN的价格。',
                    }
                ]
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'paymentPeriod',
                itemId: 'paymentPeriod',
                width: '100%',
                layout: {
                    type: 'column',
                    columns: 3
                },
                defaults: {
                    margin: '5 10 0 0',
                },
                hidden: true,
                disabled: true,
                diyGetValue: me.commonGetLimitValue,
                diySetValue: function (data) {
                    var me = this,
                        limit = me.getComponent('limit');

                    data['limit'] && limit.setValue(data['limit']);
                },
                items: [
                    {
                        xtype: 'displayfield',
                        name: 'description1',
                        itemId: 'description1',
                        value: '在C端客户签收货物，满',
                    },
                    {
                        xtype: 'numberfield',
                        name: 'limit',
                        itemId: 'limit',
                        width: 120,
                        allowBlank: false,
                        hideTrigger: true,
                        minValue: 1,
                        listeners: {
                            change: function (comp, value) {
                                var container = comp.ownerCt,
                                    panel = container.ownerCt,
                                    typeComp = panel.getComponent('type'),
                                    description3 = container.getComponent('description3'),
                                    {defaultValue} = typeComp,
                                    type = value === +defaultValue ? 'default' : 'custom'

                                typeComp.setValue({
                                    type: type
                                });
                                description3.diySetValue(value);
                            }
                        }
                    },
                    {
                        xtype: 'displayfield',
                        name: 'description2',
                        itemId: 'description2',
                        value: '天后纳入到结算月。',
                    },
                    {
                        xtype: 'displayfield',
                        name: 'description3',
                        itemId: 'description3',
                        columnWidth: 1, //column占据一行
                        value: '比如客户2025年2月1日签收，满30天后（2025年3月3日）纳入2025年03月结算，在2025年4月1日收到回款。',
                        calculateDateValues: function (startTimestamp, daysToAdd) {
                            // 创建一个日期对象
                            const startDate = new Date(startTimestamp);

                            // 计算加上天数后的日期
                            const signatureDate = new Date(startDate);
                            signatureDate.setDate(signatureDate.getDate() + daysToAdd);

                            // 格式化 signature
                            const signature = `${signatureDate.getFullYear()}年${(signatureDate.getMonth() + 1).toString().padStart(2, '0')}月${signatureDate.getDate().toString().padStart(2, '0')}日`;

                            // 格式化 settle
                            const settle = `${signatureDate.getFullYear()}年${(signatureDate.getMonth() + 1).toString().padStart(2, '0')}月`;

                            // 计算下一个月的1号
                            const refundDate = new Date(signatureDate);
                            refundDate.setMonth(refundDate.getMonth() + 1);
                            refundDate.setDate(1);

                            // 格式化 refund
                            const refund = `${refundDate.getFullYear()}年${(refundDate.getMonth() + 1).toString().padStart(2, '0')}月${refundDate.getDate().toString().padStart(2, '0')}日`;

                            return {signature, settle, refund};
                        },
                        diySetValue: function (data) {
                            var me = this;
                            if (data && typeof data === 'number') {
                                var {
                                    signature,
                                    settle,
                                    refund
                                } = me.calculateDateValues(Date.parse('2025-02-01'), data)

                                me.setValue(`比如客户2025年2月1日签收，满 ${JSCreateFont('green', true, data)} 天后` +
                                    `（${JSCreateFont('green', true, signature)}）` +
                                    `纳入 ${JSCreateFont('green', true, settle)} 结算，在 ${JSCreateFont('green', true, refund)} 收到回款。`)
                            }
                        }
                    }
                ]
            },
        ]
        me.callParent();
        me.on('afterrender', function (comp) {
            var itemId = comp.itemId,
                itemComp = comp.getComponent(itemId);

            itemComp.setVisible(true);
            itemComp.setDisabled(false);
        })
    }
})