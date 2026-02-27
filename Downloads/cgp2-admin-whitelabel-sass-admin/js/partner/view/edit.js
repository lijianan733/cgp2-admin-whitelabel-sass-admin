Ext.Loader.syncRequire([
    'CGP.partner.model.PartnerModel',
    'CGP.common.field.WebsiteCombo',
    'CGP.partner.controller.Controller'
]);
Ext.onReady(function () {

    Ext.apply(Ext.form.field.VTypes, {
        phone: function (v) {
            return /((\d)|([0\+]\d{2,4}(\d))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(v);
        },
        phoneText: '请输入有效的电话号码'
        //phoneMask: '输入010-1234565或18888888888'
    });

    var controller = Ext.create('CGP.partner.controller.Controller'),
        id = JSGetQueryString('id'),
        page = Ext.widget({
            block: 'partner',
            xtype: 'uxeditpage',
            gridPage: 'main.html',
            tbarCfg: {
                btnSave: {
                    originHandlerFn: function () {
                        page.form.submitForm({
                            callback: function (data, operation, success) {
                                if (success) {
                                    page.toolbar.buttonCreate.enable();
                                    page.toolbar.buttonCopy.enable();

                                    !id && Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                                        JSOpen({
                                            id: 'partner_edit',
                                            url: path + `partials/partner/edit.html?id=${data.data.id}&isReadOnly=false`,
                                            title: i18n.getKey('edit') + '_' + `partner(${data.data.id})`,
                                            refresh: true
                                        });
                                    });
                                }
                            }
                        });
                    },
                    handler: function (btn) {
                        var form = page.getComponent('form'),
                            partnerOrderType = form.getComponent('partnerOrderType'),
                            disabledBtn = partnerOrderType.query('[itemId=disabledBtn]')[0];

                        if (id) {
                            partnerOrderType.asyncEditQuery(disabledBtn.isUsable, function () {
                                btn.originHandlerFn();
                            });
                        } else {
                            btn.originHandlerFn();
                        }
                    }
                },
            },
            formCfg: {
                model: 'CGP.partner.model.PartnerModel',
                remoteCfg: false,
                layout: {
                    type: 'table',
                    columns: 1
                },
                defaults: {
                    margin: '0 0 10 0'
                },
                items: [
                    {
                        name: 'name',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('name'),
                        itemId: 'name',
                        allowBlank: false
                    },
                    {
                        name: 'partnerStatus',
                        xtype: 'combo',
                        itemId: 'partnerStatus',
                        fieldLabel: i18n.getKey('audit') + i18n.getKey('status'),
                        displayField: 'value',
                        valueField: 'key',
                        editable: false,
                        readOnly: true,
                        value: 'REGISTRATION',
                        fieldStyle: 'background:#C0C0C0',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'key'],
                            data: [
                                {
                                    value: '已审核', key: 'APPROVED'
                                },
                                {
                                    value: '已注册', key: 'REGISTRATION'
                                },
                                {
                                    value: '已注销', key: 'LOGOFF'
                                }
                            ]
                        }),
                    },
                    {
                        name: 'code',
                        xtype: 'textfield',
                        itemId: 'code',
                        fieldLabel: i18n.getKey('code'),
                        allowBlank: false
                    },
                    {
                        name: 'settlementType',
                        xtype: 'combo',
                        editable: false,
                        allowBlank: false,
                        fieldLabel: i18n.getKey('checkout') + i18n.getKey('type'),
                        itemId: 'settlementType',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['type', "value"],
                            data: [
                                {
                                    type: i18n.getKey('DELAY_SETTLEMENT'), value: 'DELAY_SETTLEMENT'
                                },
                                {
                                    type: i18n.getKey('READY_SETTLEMENT'), value: 'READY_SETTLEMENT'
                                },
                                {
                                    type: i18n.getKey('NO_SETTLEMENT'), value: 'NO_SETTLEMENT'
                                }
                            ]
                        }),
                        displayField: 'type',
                        valueField: 'value',
                        queryMode: 'local'

                    },
                    {
                        name: 'partnerType',
                        xtype: 'combo',
                        editable: false,
                        allowBlank: false,
                        fieldLabel: i18n.getKey('partner') + i18n.getKey('type'),
                        itemId: 'partnerType',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['type', "value"],
                            data: [
                                {
                                    type: i18n.getKey('inner'), value: 'INTERNAL'
                                },
                                {
                                    type: i18n.getKey('outside'), value: 'EXTERNAL'
                                }
                            ]
                        }),
                        displayField: 'type',
                        valueField: 'value',
                        value: 'EXTERNAL',
                        queryMode: 'local'

                    },
                    {
                        name: 'contactor',
                        itemId: 'contactor',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('contactor'),
                        allowBlank: true
                    },
                    {
                        name: 'telephone',
                        itemId: 'telephone',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('telephone'),
                        vtype: 'phone',
                        allowBlank: true
                    },
                    {
                        name: 'email',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('email'),
                        itemId: 'email',
                        regex: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                        regexText: i18n.getKey('Please enter the correct email!'),
                        allowBlank: false
                    },
                    {
                        xtype: 'websitecombo',
                        name: 'website',
                        multiSelect: false,
                        hidden: true,
                        diyGetValue: function () {
                            var me = this;
                            return {
                                id: me.getValue(),
                                clazz: "com.qpp.cgp.domain.common.Website"
                            }
                        },
                        diySetValue: function (data) {
                            var me = this;
                            if (data) {
                                me.setValue(data.id);
                            }
                        }
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('初始订单状态'),
                        name: 'orderInitStatusId',
                        itemId: 'orderInitStatusId',
                        editable: false,
                        haveReset: true,
                        store: Ext.create('CGP.common.store.OrderStatuses'),
                        displayField: 'name',
                        valueField: 'id',
                    },
                    {
                        xtype: 'booleancombo',
                        fieldLabel: i18n.getKey('订单支付是否超时取消'),
                        name: 'needOrderTimeOutCancel',
                        itemId: 'needOrderTimeOutCancel',
                    },
                    {
                        xtype: 'textarea',
                        name: 'orderDefaultRemark',
                        itemId: 'orderDefaultRemark',
                        fieldLabel: i18n.getKey('订单默认备注'),
                        height: 80
                    },
                    {
                        xtype: 'uxfieldset',
                        itemId: 'partnerOrderType',
                        name: 'partnerOrderType',
                        colspan: 2,
                        padding: '3px 10px 0px 10px',
                        margin: '5 15 5 15',
                        title: i18n.getKey('默认下单配置'),
                        diySetValue: function (data) {
                            var me = this,
                                items = me.items.items,
                                {orderCreateAction} = data;

                            items.forEach(item => {
                                var {disabled, name} = item,
                                    value = orderCreateAction[name];
                                if (!disabled && name) {
                                    if (name === 'orderType') {
                                        !value && (value = 'TEST');
                                    }
                                    item.diySetValue ? item.diySetValue(value) : item.setValue(value);
                                }
                            })
                        },
                        diyGetValue: function () {
                            var me = this,
                                result = {},
                                items = me.items.items;

                            items.forEach(item => {
                                var value = item.diyGetValue ? item.diyGetValue() : item.getValue(),
                                    {name, disabled} = item;

                                if (!disabled && name) {
                                    result[name] = value;
                                }
                            })

                            // 测试单不要orderType
                            if (result['orderType'] === 'TEST') {
                                delete result['orderType'];
                            }

                            return {
                                clazz: "com.qpp.cgp.service.order.partner.PartnerOrderAction",
                                orderCreateAction: result,
                                partner: {
                                    id: +id,
                                }
                            };
                        },
                        asyncEditQuery: function (isUsable, callFn) {
                            var me = this,
                                value = me.diyGetValue(),
                                {isEdit} = me,
                                newId = isEdit ? `/${id}` : '',
                                url = adminPath + 'api/orderFlow/partnerOrder' + newId;


                            if (isUsable) {
                                controller.asyncEditQuery(url, value, isEdit, function (require, success, response) {
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        if (responseText.success) {
                                            callFn()
                                        }
                                    }
                                })
                            } else {
                                if (isEdit) {
                                    controller.deleteQuery(url, callFn)
                                } else {
                                    callFn()
                                }
                            }
                        },
                        collapsible: false,
                        collapsed: false,
                        autoScroller: true,
                        layout: 'fit',
                        defaults: {
                            margin: '10 35 15 0',
                            width: 350,
                            allowBlank: false,
                        },
                        legendItemConfig: {
                            disabledBtn: {
                                hidden: false,
                                disabled: false,
                                originHandlerFn: function (btn) {
                                    var fieldSet = btn.ownerCt.ownerCt;
                                    fieldSet.suspendLayouts();
                                    btn.isUsable = !btn.isUsable;
                                    btn.value = btn.isUsable;
                                    if (btn.isUsable) {
                                        fieldSet.body.show();
                                        fieldSet.body.setStyle({
                                            display: 'block'
                                        });
                                    } else {
                                        fieldSet.body.hide();
                                        btn.currentHeight = fieldSet.body.getHeight();
                                        fieldSet.body.setStyle({
                                            display: 'none'
                                        });
                                        for (var i = 0; i < fieldSet.items.items.length; i++) {
                                            var item = fieldSet.items.items[i];
                                        }
                                    }
                                    btn.toggleBGImage();
                                    fieldSet.ownerCt.doLayout();
                                    fieldSet.resumeLayouts();
                                },
                                handler: function (btn) {
                                    var fieldSet = btn.ownerCt.ownerCt,
                                        form = fieldSet.ownerCt,
                                        settlementType = form.getComponent('settlementType'),
                                        orderType = fieldSet.getComponent('orderType')

                                    btn.originHandlerFn(btn);
                                    orderType.showPageComp(btn.isUsable);
                                    if (!btn.isUsable) {
                                        var {settlementTypeValue} = orderType;
                                        settlementType.setValue(settlementTypeValue);
                                    }
                                },
                                listeners: {
                                    beforerender: function (btn) {
                                        var fieldSet = btn.ownerCt.ownerCt;
                                        btn.isUsable = fieldSet.isEdit;
                                    }
                                }
                            },
                        },
                        items: [
                            {
                                xtype: 'combo',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['key', 'value'],
                                    data: [
                                        {
                                            key: '测试订单',
                                            value: 'TEST'
                                        },
                                        {
                                            key: '打样订单',
                                            value: 'PROOFING'
                                        }
                                    ]
                                }),
                                name: 'orderType',
                                itemId: 'orderType',
                                displayField: 'key',
                                valueField: 'value',
                                editable: false,
                                value: 'TEST',
                                fieldLabel: i18n.getKey('订单类型'),
                                setCompStatus: function (compGather) {
                                    compGather.forEach(function (item) {
                                        const {comp, disabled, visible} = item;

                                        if (comp) {
                                            comp.setDisabled(disabled);
                                            comp.setVisible(visible);
                                        }
                                    })
                                },
                                showPageComp: function (isUsable) {
                                    var me = this,
                                        fieldSet = me.ownerCt,
                                        page = fieldSet.ownerCt,
                                        newValue = me.getValue(),
                                        settlementType = page.getComponent('settlementType'),
                                        orderInitStatusId = page.getComponent('orderInitStatusId'),
                                        needOrderTimeOutCancel = page.getComponent('needOrderTimeOutCancel'),
                                        isTest = newValue === 'TEST',
                                        isResult = isUsable ? !isTest : isUsable,
                                        compGather = [
                                            {
                                                comp: settlementType,
                                                disabled: false,
                                                visible: !isResult,
                                            },
                                            {
                                                comp: orderInitStatusId,
                                                disabled: false,
                                                visible: !isResult,
                                            },
                                            {
                                                comp: needOrderTimeOutCancel,
                                                disabled: false,
                                                visible: !isResult,
                                            },
                                        ];

                                    me.setCompStatus(compGather);
                                },
                                settlementTypeValue: 'READY_SETTLEMENT',
                                getSettlementTypeValue: function () {
                                    var me = this,
                                        fieldSet = me.ownerCt,
                                        page = fieldSet.ownerCt,
                                        settlementType = page.getComponent('settlementType'),
                                        settlementTypeValue = settlementType.getValue();
                                    me.settlementTypeValue = settlementTypeValue;
                                },
                                listeners: {
                                    change: function (combo, newValue, oldValue, eOpts) {
                                        var fieldSet = combo.ownerCt,
                                            page = fieldSet.ownerCt,
                                            desc = fieldSet.getComponent('desc'),
                                            comment = fieldSet.getComponent('comment'),
                                            orderFlow = fieldSet.getComponent('orderFlow'),
                                            orderStatusFlow = fieldSet.getComponent('orderStatusFlow'),
                                            settlementType = page.getComponent('settlementType'),
                                            settlementTypeValue = settlementType.getValue(),
                                            orderInitStatusId = page.getComponent('orderInitStatusId'),
                                            needOrderTimeOutCancel = page.getComponent('needOrderTimeOutCancel'),
                                            isTest = newValue === 'TEST',
                                            compGather = [
                                                {
                                                    comp: desc,
                                                    disabled: !isTest,
                                                    visible: isTest,
                                                },
                                                {
                                                    comp: comment,
                                                    disabled: !isTest,
                                                    visible: false,
                                                },
                                                {
                                                    comp: orderStatusFlow,
                                                    disabled: isTest,
                                                    visible: false,
                                                },
                                                {
                                                    comp: orderFlow,
                                                    disabled: isTest,
                                                    visible: !isTest,
                                                },
                                                {
                                                    comp: settlementType,
                                                    disabled: false,
                                                    visible: isTest,
                                                },
                                                {
                                                    comp: orderInitStatusId,
                                                    disabled: false,
                                                    visible: isTest,
                                                },
                                                {
                                                    comp: needOrderTimeOutCancel,
                                                    disabled: false,
                                                    visible: isTest,
                                                },
                                            ];

                                        combo.setCompStatus(compGather);

                                        if (newValue === 'PROOFING') {
                                            combo.getSettlementTypeValue();
                                            settlementType.setValue('NO_SETTLEMENT');
                                            combo.settlementTypeValue = settlementTypeValue || 'READY_SETTLEMENT';
                                        } else if (newValue === 'TEST') {
                                            settlementType.setValue(combo.settlementTypeValue);
                                        }
                                    },
                                }
                            },
                            {
                                xtype: 'textarea',
                                name: 'desc',
                                itemId: 'desc',
                                fieldLabel: i18n.getKey('描述'),
                                height: 60,
                                allowBlank: true,
                                value: 'IT测试订单'
                            },
                            {
                                xtype: 'textfield',
                                itemId: 'orderFlow',
                                fieldLabel: i18n.getKey('订单流程'),
                                allowBlank: true,
                                value: '------------打样订单流程------------',
                                fieldStyle: 'background-color: silver',
                                hidden: true,
                                disabled: true,
                                readOnly: true,
                                isDiyShowTip: true,
                                id: 'isStrictMode',
                                tipInfo: i18n.getKey('严格模式的话元素的任意部份都不能超出定制区域'),
                                diySetValue: function () {
                                    var me = this;
                                    me.setValue('------------打样订单流程------------')
                                },
                                listeners: {
                                    afterrender: function () {
                                        var tip = Ext.create('Ext.tip.ToolTip', {
                                            maxWidth: 1200,
                                            target: 'isStrictMode-tipInfoEl',
                                            title: '',
                                            items: [
                                                {
                                                    xtype: 'image',
                                                    width: 1100,
                                                    height: 400,
                                                    padding: '10 10 10 0',
                                                    autoEl: 'div',
                                                    imgCls: 'imgAutoSize',
                                                    src: path + 'js/partner/view/image/orderFlow.png',
                                                }
                                            ]
                                        })
                                    }
                                }
                            },

                            {
                                xtype: 'textfield',
                                name: 'comment',
                                itemId: 'comment',
                                allowBlank: true,
                                fieldLabel: i18n.getKey('comment'),
                                hidden: true,
                                getValue: function () {
                                    return 'IT_TEST'
                                },
                            },
                            {
                                xtype: 'textfield',
                                name: 'orderStatusFlow',
                                itemId: 'orderStatusFlow',
                                allowBlank: true,
                                hidden: true,
                                disabled: true,
                                getValue: function () {
                                    return {
                                        _id: '223625187',
                                        clazz: 'com.qpp.cgp.domain.stateflow.config.StateFlow',
                                        module: 'order_status_update_no_pay_settle'
                                    }
                                }
                            }
                        ],
                        isEdit: true,
                        listeners: {
                            afterrender: function (fieldSet) {
                                if (id) {
                                    var url = adminPath + 'api/orderFlow/partnerOrder/' + id,
                                        data = controller.getQuery(url);

                                    data && fieldSet.diySetValue(data);
                                    fieldSet['isEdit'] = !!data;
                                }
                                fieldSet.setVisible(id);
                                fieldSet.setDisabled(!id);
                            }
                        }
                    },
                ]
            },
        });
});
