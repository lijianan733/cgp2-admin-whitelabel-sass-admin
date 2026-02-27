/**
 * Created by nan on 2018/4/28.
 */
Ext.Loader.syncRequire(['CGP.mailhistory.controller.overridesubmit',
    'CGP.partner.view.partnerorderreportconfigmanage.view.DiyEmailsFieldComponent',
    'CGP.mailhistory.controller.overridesubmit',
    'CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.config.Config'])
Ext.define('CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.view.CustomerCreateOrEditForm', {
    extend: 'Ext.ux.form.Panel',
    createForm: function () {
        var me = this,
            cfg = {},
            props = me.basicFormConfigs,
            len = props.length,
            i = 0,
            prop;
        for (; i < len; ++i) {
            prop = props[i];
            cfg[prop] = me[prop];
        }
        var model = [];
        if (Ext.isString(me.model))
            model.push(me.model);
        else if (Ext.isArray(me.model))
            model = me.model;
        cfg.model = model;
        cfg.isValid = function () {
            this.owner.msgPanel.hide();
            var isValid = true;
            var errors = {};
            for (var i = 0; i < this.owner.items.items.length; i++) {
                var item = this.owner.items.items[i];
                if (item.name == 'to') {
                    var itemIsValid = !Ext.isEmpty(item.getSubmitValue());
                    if (!itemIsValid) {
                        errors[item.getFieldLabel()] = '收件人邮箱不能为空';
                        isValid = false;
                    }
                }
                else {
                    var itemIsValid = null;
                    if (item.xtype == 'fieldcontainer') {
                        itemIsValid = item.items.items[0].isValid();
                        if (!itemIsValid) {
                            errors[item.getFieldLabel()] = item.items.items[0].getErrors();
                            isValid = false;
                        }
                    } else if (item.xtype == 'uxtextarea') {
                        itemIsValid = !Ext.isEmpty(item.getValue());
                        if (!itemIsValid) {
                            errors[item.getFieldLabel()] = '内容不予许为空';
                            isValid = false;
                        }
                    }
                    else {
                        itemIsValid = item.isValid();
                        if (!itemIsValid) {
                            errors[item.getFieldLabel()] = item.getErrors();
                            isValid = false;
                        }
                    }
                }
            }
            if (isValid == false) {
                this.showErrors(errors);
            }
            return isValid;
        };
        return new Ext.ux.form.Basic(me, cfg);
    },
    layout: {
        type: 'table',
        columns: 2
    },
    autoScroll: true,
    msgTarget: 'side',
    fieldDefaults: {
        padding: '10 10 5 10',
        width: 600,
        allowBlank: false,
        msgTarget: 'side',
        labelWidth: 100
    },
    recordIdCopy: null,
    showAllEnablePlaceholder: function () {
        var localData = CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.config.Config;
        if (!Ext.getCmp('CustomerCreateOrEditFormshowjsondatawindow')) {
            var win = Ext.widget('showjsondatawindow', {
                id: 'CustomerCreateOrEditFormshowjsondatawindow',
                rawData: localData,
                title: '查看可用占位符'
            });
            win.show();
        }
    },
    constructor: function (config) {
        var me = this;
        var controller = me.controller = Ext.create('CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.controller.MainController');
        if (!Ext.isEmpty(config.recordId)) {
            me.recordIdCopy = config.recordId;
        }
        applyConfig2 = Ext.Object.merge({
            configRecode: config.configRecode,
            header: false,
            title: config.title,
            items: [
                {
                    name: 'preStatusId',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('fromStatus'),
                    itemId: 'preStatusId',
                    editable: false,
                    colspan: 2,
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    width: 600,
                    labelWidth: 100,
                    queryMode: 'local',
                    forceSelection: true,
                    labelAlign: 'left',
                    store: config.orderStatusStore,
                    matchFieldWidth: true,
                    listeners: {
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            store.on('load', function () {
                                if (!combo.getValue())
                                    combo.select(store.getAt(0));
                            });
                        }
                    }
                },
                {
                    name: 'curStatusId',
                    xtype: 'combo',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('toStatus'),
                    itemId: 'curStatusId',
                    editable: false,
                    colspan: 2,
                    blankText: '改变后的状态不允许为空',
                    forceSelection: true,
                    multiSelect: false,
                    displayField: 'name',
                    pickerAlign: 'tl-bl',
                    valueField: 'id',
                    width: 600,
                    labelWidth: 100,
                    queryMode: 'local',
                    labelAlign: 'left',
                    store: config.orderStatusStore,
                    matchFieldWidth: true,
                    listeners: {
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            store.on('load', function () {
                                if (!combo.getValue())
                                    combo.select(store.getAt(0));
                            });
                        }
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: i18n.getKey('subject'),
                    layout: 'hbox',
                    colspan: 2,
                    name: 'subject',
                    itemId: 'subject',
                    getName: function () {
                        return this.name
                    },
                    getValue: function () {
                        return this.items.items[0].getValue()
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'subject',
                            itemId: 'subject',
                            width: 350,
                            allowBlank: false
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 10',
                            text: '查看所有可用占位符',
                            handler: function () {
                                me.showAllEnablePlaceholder();
                            }
                        }
                    ]
                },
                {
                    xtype: 'uxtextarea',
                    itemId: 'content',
                    name: 'content',
                    width: 800,
                    colspan: 2,
                    height: 300,
                    fieldLabel: i18n.getKey('content')

                },
                {
                    xtype: 'form',
                    itemId: 'fileUpload',
                    border: false,
                    width: 600,
                    colspan: 2,
                    height: '100%',
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    items: [
                        {
                            name: 'files',
                            xtype: 'filefield',
                            width: 530,
                            allowBlank: true,
                            enableKeyEvents: true,
                            buttonText: i18n.getKey('choice'),
                            fieldLabel: i18n.getKey('attachments'),
                            itemId: 'file'
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('upload'),
                            id: 'attachmentsBar',
                            itemId: 'attachmentsBar',
                            style: {
                                marginLeft: '5px',
                                marginTop: '-5px'
                            },
                            amount: 0,
                            handler: function (button) {
                                controller.upLoadFile(button);
                            }
                        }
                    ]
                },
                {
                    xtype: 'form',
                    itemId: 'attachmentsList',
                    width: 600,
                    name: 'attachments',
                    height: '100%',
                    border: false,
                    style: {
                        marginLeft: '105px'
                    },
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    amunt: 0
                }

            ],
            tbar: [
                {
                    xtype: 'button',
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function (view) {
                        if (view.ownerCt.ownerCt.isValid()) {
                            var formValue = controller.getCustomerFormValue(view.ownerCt.ownerCt);
                            controller.saveFormValue(formValue, view.ownerCt.ownerCt.createOrEdit, view.ownerCt.ownerCt.recordIdCopy, me);
                        }
                    }
                },
                {
                    xtype: 'button',
                    itemId: "copy",
                    text: i18n.getKey('copy'),
                    iconCls: 'icon_copy',
                    disabled: Ext.isEmpty(me.recordIdCopy) ? true : false,
                    handler: function () {
                        this.setDisabled(true);
                        var tab = window.parent.Ext.getCmp('supplierOrderStatusChangeEmailNotifyConfig');
                        var type = me.type == 'customer' ? 'editCustomerEmailNotifyConfig' : 'editBackstageEmailNotifyConfig';
                        var panel = tab.getComponent(type);
                        panel.setTitle(i18n.getKey('create') + "_" + i18n.getKey(me.type == 'customer' ? 'user' : 'server') + i18n.getKey('orderStatusChangeEmailNotifyConfig'));
                        me.recordIdCopy = null;
                        me.createOrEdit = 'create';
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'btnReset',
                    text: i18n.getKey('reset'),
                    iconCls: 'icon_reset',
                    handler: function () {
                        var form = this.ownerCt.ownerCt;
                        if (form.recordId != null) {
                            var MailTemplateStore = Ext.create('CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.store.OrderStatusChangeMailConfigStore', {
                                type: 'customer',
                                params: {
                                    filter: '[{"name":"_id","value":"' + form.recordId + '","type":"string"}]'
                                }
                            });
                            MailTemplateStore.load(function () {
                                var record = {};
                                record = MailTemplateStore.getAt(0);
                                controller.setCustomerFormValue(form, record);
                            });
                        }
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'btnGrid',
                    text: i18n.getKey('grid'),
                    iconCls: 'icon_grid',
                    handler: function () {
                        var tab = window.parent.Ext.getCmp('supplierOrderStatusChangeEmailNotifyConfig');
                        var panel = me.type == 'customer' ? 'manageCustomerEmailNotifyConfig' : 'manageServiceEmailNotifyConfig';
                        tab.setActiveTab(tab.getComponent(panel));

                    }
                }
            ]
        }, config);
        me.callParent([applyConfig2]);
    }
})
window.deleteFile = function (itemId) {
    var field = Ext.getCmp(itemId);
    field.ownerCt.remove(field);
};
