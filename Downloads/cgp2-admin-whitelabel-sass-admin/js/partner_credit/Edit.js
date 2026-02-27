/**
 * @author nan
 * @date 2026/1/26
 * @description TODO
 */
Ext.Loader.syncRequire([
    'CGP.partner_credit.store.PartnerCreditStore',
    'CGP.partner_credit.view.ImageArrField'
]);
Ext.onReady(function () {
    var controller = Ext.create('CGP.partner_credit.controller.Controller');
    var action = JSGetQueryString('action');
    var id = JSGetQueryString('id');
    var status = JSGetQueryString('status');
    var page = Ext.widget({
        xtype: 'uxeditpage',
        block: 'partner_credit',
        gridPage: 'main.html',
        formCfg: {
            layout: {
                type: 'vbox',
            },
            fieldDefaults: {
                allowBlank: false
            },
            useForEach: true,
            model: 'CGP.partner_credit.model.PartnerCreditModel',
            tbar: {
                xtype: 'toolbar',
                hidden: action == 'audit',
                items: [{
                    xtype: 'button',
                    iconCls: 'icon_save',
                    text: '保存',
                    hidden: action == 'read' || action == 'edit',
                    handler: function (btn) {
                        var me = btn.ownerCt.ownerCt;
                        var mode = me.getCurrentMode();
                        var model = me.form.getModel(me.form.model);
                        if (me.form.isValid()) {
                            me.form.updateModel();
                            controller.savePartnerCredit(model, me.form);
                        }
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'icon_save',
                    text: '保存修改',
                    hidden: status == 'Invalid' || action == 'create',
                    handler: function (btn) {
                        var me = btn.ownerCt.ownerCt;
                        var mode = me.getCurrentMode();
                        var model = me.form.getModel(me.form.model);
                        Ext.Msg.confirm('提示', '是否确定修改当前信贷信息?', function (selector) {
                            if (selector == 'yes') {
                                var me = btn.ownerCt.ownerCt;
                                var model = me.form.getModel(me.form.model);
                                if (me.form.isValid()) {
                                    me.form.updateModel();
                                    controller.savePartnerCredit(model, me.form);
                                }
                            }
                        });
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'icon_check',
                    text: '信贷修改历史',
                    hidden: action == 'create',
                    handler: function (btn) {
                        var me = btn.ownerCt.ownerCt;
                        var model = me.form.getModel(me.form.model);
                        var partner = model.get('partner');
                        controller.showModifyLog(partner.id)
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'icon_config',
                    text: '信贷统计',
                    hidden: status != 'Valid',
                    handler: function (btn) {
                        var me = btn.ownerCt.ownerCt;
                        var model = me.form.getModel(me.form.model);
                        var partner = model.get('partner');
                        controller.showCreditCount(partner.id);
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'icon_refresh',
                    text: '刷新',
                    handler: function (btn) {
                        var me = btn.ownerCt.ownerCt;
                        var model = me.form.getModel(me.form.model);
                        var id = model.get('_id');
                        var url = JSSetUrlParams(window.location.href, 'id', id);
                        console.log(url);
                        window.location.href = url;
                        //window.location.reload();
                    }
                }, {
                    xtype: 'button',
                    iconCls: 'icon_help',
                    text: '<font color="red">配置说明</font>',
                    handler: function () {
                        controller.showConfigHelp();
                        }
                }]
            },
            bbar: {
                hidden: action != 'audit',
                items: [
                    {
                        text: '审核通过',
                        iconCls: 'icon_accept',
                        handler: function (btn) {
                            var me = btn.ownerCt.ownerCt;
                            if (me.form.isValid()) {
                                me.form.updateModel();
                                var model = me.form.getModel(me.form.model);
                                controller.auditPartnerCredit(id, true, model);
                            }
                        }
                    },
                    {
                        text: '审核不通过',
                        iconCls: 'icon_cancel',
                        handler: function (btn) {
                            var me = btn.ownerCt.ownerCt;
                            if (me.form.isValid()) {
                                me.form.updateModel();
                                var model = me.form.getModel(me.form.model);
                                controller.auditPartnerCredit(id, false, model);
                            }
                        }
                    },
                    {
                        text: '返回待审核列表',
                        iconCls: 'icon_grid',
                        handler: function () {
                            JSOpen({
                                id: 'partner_credit2page',
                                url: path + 'partials/partner_credit/main2.html'
                            });
                        }
                    },
                    {
                        text: '刷新',
                        iconCls: 'icon_refresh',
                        handler: function () {
                            location.reload();

                        }
                    },
                    {
                        xtype: 'displayfield',
                        value: `<font color="red" style="font-weight: bold">允许同时修改信贷申请信息,审核通过后生效</font>`,
                    }
                ]
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'partner',
                    readOnly: true,
                    fieldStyle: 'background-color:silver',
                    fieldLabel: i18n.getKey('PartnerId'),
                    itemId: 'partnerId',
                    value: JSGetQueryString('partnerId'),
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            me.setValue(data?.id);
                            var displayName = me.ownerCt.getComponent('displayName');
                            displayName.setValue(data.name);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    name: 'displayName',
                    readOnly: true,
                    fieldStyle: 'background-color:silver',
                    fieldLabel: i18n.getKey('Partner名称'),
                    itemId: 'displayName',
                    value: JSGetQueryString('partnerName'),
                    diySetValue: function () {
                    }
                },
                {
                    xtype: 'hiddenfield',
                    fieldLabel: '_id',
                    name: '_id',
                    itemId: '_id',
                },
                {
                    xtype: 'combo',
                    name: 'status',
                    isLike: false,
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    editable: false,
                    readOnly: true,
                    displayField: 'display',
                    valueField: 'value',
                    value: 'Pending',
                    fieldStyle: 'background-color:silver',
                    // ['Pending', 'Valid', 'Invalid', 'Remove'],
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'Pending',
                                display: '待审核'
                            },
                            {
                                value: 'Valid',
                                display: '启用'
                            },
                            {
                                value: 'Invalid',
                                display: '禁用'
                            }
                        ]
                    }
                },
                {
                    xtype: 'hiddenfield',
                    fieldLabel: 'clazz',
                    name: 'clazz',
                    itemId: 'clazz',
                    value: 'com.qpp.cgp.domain.partner.credit.PartnerCreditConfig'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '客户简称',
                    name: 'customerAbbreviation',
                    itemId: 'customerAbbreviation',
                    allowBlank: true,
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '客户英文简称',
                    name: 'customerEnName',
                    itemId: 'customerEnName',
                    allowBlank: true,
                }, {
                    xtype: 'numberfield',
                    fieldLabel: '管理信贷额(USD)',
                    name: 'creditLimit',
                    itemId: 'creditLimit',
                    minValue: 0,
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    tipInfo: '允许的已完成发货,但未回款的订单价格总额',

                }, {
                    xtype: 'numberfield',
                    fieldLabel: '风险信贷额(USD)',
                    name: 'riskCreditLimit',
                    itemId: 'riskCreditLimit',
                    minValue: 0,
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    tipInfo: '允许的下单的订单价格总额;通常该数值大于 >= 管理信贷额',
                }, {
                    xtype: 'numberfield',
                    fieldLabel: '付款期(天)',
                    name: 'paymentTermDays',
                    itemId: 'paymentTermDays',
                    minValue: 0,
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    tipInfo: '订单签收之后,允许该配置指定的天数内付款'
                }, {
                    xtype: 'numberfield',
                    fieldLabel: '宽限期(天)',
                    name: 'gracePeriodDays',
                    itemId: 'gracePeriodDays',
                    minValue: 0,
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    tipInfo: '超过付款期之后，再允许该配置指定的天数内天付款'

                },
                {
                    xtype: 'uxfieldcontainer',
                    itemId: 'insuranceConfig',
                    name: 'insuranceConfig',
                    fieldLabel: 'partner信贷保险信息',
                    labelAlign: 'top',

                    tipInfo: '保险公司信息记录',
                    defaults: {allowBlank: true},
                    height: 100,
                    width: 410,
                    allowBlank: true,
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: '信贷摘要',
                            name: 'creditSummary',
                            itemId: 'creditSummary'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '信贷明细',
                            name: 'creditDetail',
                            itemId: 'creditDetail'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '付款方式',
                            name: 'paymentMethod',
                            itemId: 'paymentMethod'
                        }
                    ]
                },
                {
                    xtype: 'image_arr_field',
                    width: '100%',
                    flex: 1,
                    name: 'reviewDocs',
                    itemId: 'reviewDocs',
                    isPaging: false,//不分页
                }
            ]
        },
    });
});
