/**
 * Created by nan on 2018/6/21.
 */
Ext.define('CGP.partner.view.supplierorderconfig.view.EditOrCreateNotifyEmailConfig', {
    extend: 'Ext.ux.form.Panel',
    autoScroll: true,
    frame: false,
    closable: true,
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
            var baseConfig = this.owner.getComponent('baseConfig');
            var type = baseConfig.getComponent('type').getValue();
            var emailConfig = this.owner.getComponent('serverNotifyEmailConfig');
            for (var i = 0; i < baseConfig.items.items.length; i++) {
                var itemIsValid = null;
                var item = baseConfig.items.items[i];
                itemIsValid = item.isValid();
                if (!itemIsValid) {
                    errors[item.getFieldLabel()] = item.getErrors();
                    isValid = false;
                }
            }
            for (var i = 0; i < emailConfig.items.items.length; i++) {
                var item = emailConfig.items.items[i];
                if (item.name == 'to' && type == 'manager') {
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
    constructor: function (config) {
        var me = this;
        var createOrUpdate = config.createOrEdit;
        var index = config.recordIndex;
        var controller = Ext.create('CGP.partner.view.supplierorderconfig.controller.Controller');
        var editConfigStore = config.store;
        var record = config.record;
        if (record == null) {
            record = Ext.create('CGP.partner.view.supplierorderconfig.model.NotifyEmailConfigModel');
        }
        var applyConfig = Ext.Object.merge({
            layout: {
                type: 'vbox'
            },
            tbar: {
                items: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('save'),
                        iconCls: 'icon_save',
                        handler: function (view) {
                            var form = view.ownerCt.ownerCt;
                            controller.saveNotifyEmailConfigValue(form, record, editConfigStore);
                        }
                    }
                ]
            },
            items: [
                {
                    xtype: 'fieldset',
                    width: '100%',
                    title: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('base') + i18n.getKey('config') + '</font>',
                    collapsible: false,
                    border: '1 0 0 0 ',
                    margin: '10 0 0 0',
                    itemId: 'baseConfig',
                    defaultType: 'displayfield',
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    defaults: {
                        labelAlign: 'left'
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            margin: '20 0 0 50',
                            fieldLabel: i18n.getKey('isActive'),
                            checked: record.get('enable'),
                            name: 'enable',
                            itemId: 'enable',
                            inputValue: true
                        },
                        {
                            name: 'name',
                            xtype: 'textfield',
                            margin: '20 0 0 50',
                            itemId: 'name',
                            value: record.get('name'),
                            fieldLabel: i18n.getKey('name'),
                            allowBlank: true
                        },
                        {
                            name: 'description',
                            xtype: 'textfield',
                            margin: '20 0 0 50',
                            itemId: 'description',
                            value: record.get('description'),
                            fieldLabel: i18n.getKey('description'),
                            allowBlank: true
                        },
                        {
                            name: 'type',
                            xtype: 'combo',
                            margin: '20 0 0 50',
                            itemId: 'type',
                            value: record.get('type') ? record.get('type') : 'customer',
                            fieldLabel: i18n.getKey('notify') + i18n.getKey('type'),
                            allowBlank: false,
                            displayField: 'type',
                            valueField: 'value',
                            editable: false,
                            labelSeparator: ':<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    {
                                        name: 'type',
                                        type: 'stirng'
                                    },
                                    {
                                        name: 'value',
                                        type: 'string'
                                    }
                                ],
                                data: [
                                    {
                                        type: i18n.getKey('customer'),
                                        value: 'customer'
                                    },
                                    {
                                        type: i18n.getKey('admin'),
                                        value: 'manager'
                                    }
                                ]
                            }),
                            listeners: {
                                'change': function (view, newValue, oldValue) {
                                    var form = view.ownerCt.ownerCt;
                                    var to = form.getComponent('serverNotifyEmailConfig').getComponent('to');
                                    var cc = form.getComponent('serverNotifyEmailConfig').getComponent('cc');
                                    var bcc = form.getComponent('serverNotifyEmailConfig').getComponent('bcc');
                                    if (newValue != 'manager') {
                                        to.hide();
                                        cc.hide();
                                        bcc.hide();
                                    } else {
                                        to.show();
                                        cc.show();
                                        bcc.show();
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    width: '100%',
                    title: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('server') + i18n.getKey('notifyEmailConfig') + '</font>',
                    itemId: 'serverNotifyEmailConfig',
                    border: '1 0 0 0 ',
                    defaults: {
                        margin: '10 0 10 50',
                        labelAlign: 'left'
                    },
                    items: [
                        {
                            name: 'to',
                            itemId: 'to',
                            xtype: 'diyemailsfieldcomponent',
                            fieldLabel: i18n.getKey('receiverName'),
                            colspan: 2,
                            labelSeparator: ':<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
                            panelConfig: {
                                width: 700,
                                minHeight: 50,
                                id: 'panel1',
                                renderTo: 'panel1',
                                itemId: 'panel1',
                                allowBlank: false,
                                defaults: {
                                    height: 20
                                },
                                bodyStyle: {
                                    borderColor: '#c0c0c0'
                                },
                                defaultType: 'display'
                            }
                        },
                        {
                            name: 'cc',
                            itemId: 'cc',
                            xtype: 'diyemailsfieldcomponent',
                            allowBlank: true,
                            fieldLabel: i18n.getKey('copySend'),
                            colspan: 2,
                            panelConfig: {
                                width: 700,
                                minHeight: 50,
                                id: 'panel2',
                                renderTo: 'panel2',
                                itemId: 'panel2',
                                allowBlank: true,
                                bodyStyle: {
                                    borderColor: '#c0c0c0'
                                }
                            }
                        },
                        {
                            name: 'bcc',
                            itemId: 'bcc',
                            allowBlank: true,
                            xtype: 'diyemailsfieldcomponent',
                            fieldLabel: i18n.getKey('blindCopySend'),
                            colspan: 2,
                            panelConfig: {
                                width: 700,
                                minHeight: 50,
                                id: 'panel3',
                                renderTo: 'panel3',
                                itemId: 'panel3',
                                allowBlank: true,
                                bodyStyle: {
                                    borderColor: '#c0c0c0'
                                }
                            }
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: i18n.getKey('subject'),
                            layout: 'hbox',
                            labelSeparator: ':<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
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
                                    msgTarget: 'none',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 10',
                                    text: '查看所有可用占位符',
                                    handler: function () {
                                        controller.showAllEnablePlaceholder();
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'uxtextarea',
                            itemId: 'content',
                            labelSeparator: ':<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>',
                            name: 'content',
                            height: 300,
                            width: 800,
                            configData: CGP.partner.view.supplierorderconfig.config.Config.data,
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
                                    width: 520,
                                    allowBlank: true,
                                    enableKeyEvents: true,
                                    labelAlign: 'left',
                                    buttonText: i18n.getKey('choice'),
                                    fieldLabel: i18n.getKey('attachments'),
                                    itemId: 'file'
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('upload'),
                                    itemId: 'attachmentsBar',
                                    margin: '-5 0 0 5',
                                    amount: 0,
                                    handler: function (button) {
                                        controller.UpLoadPicture(button)
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
                            defaults: {
                                margin: '10 0 10 0'
                            },
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
                    ]
                }
            ],
            listeners: {
                'afterrender': function (view) {
                    var me = this;
                    var serverNotifyEmailConfig = view.getComponent('serverNotifyEmailConfig');
                    var type = view.getComponent('baseConfig').getComponent('type').getValue();
                    if (me.createOrEdit == 'edit') {
                        controller.setServerMailConfigValue(serverNotifyEmailConfig, me.record.getData());
                    }
                    var to = serverNotifyEmailConfig.getComponent('to');
                    var cc = serverNotifyEmailConfig.getComponent('cc');
                    var bcc = serverNotifyEmailConfig.getComponent('bcc');
                    if (type != 'manager') {
                        to.hide();
                        cc.hide();
                        bcc.hide();
                    }
                }
            }
        }, config);

        me.callParent([applyConfig]);
    }

})