/**
 * Created by nan on 2018/6/11.
 */
Ext.syncRequire(['CGP.partner.view.sendmailconfig.model.SendMailConfigModel']);
Ext.onReady(function () {
    var partnerId = JSGetQueryString('partnerId');
    var websiteId = JSGetQueryString('websiteId');
    var type = JSGetQueryString('type');
    var createOrEdit = JSGetQueryString('createOrEdit');
    var recordId = JSGetQueryString('recordId');
    var page = Ext.create('Ext.container.Viewport', {layout: 'fit'});
    var mask = new Ext.LoadMask(page, {
        msg: "加载中..."
    });
    var controller = Ext.create('CGP.partner.view.sendmailconfig.controller.Controller');
    var form = Ext.create('Ext.form.Panel', {
        formCreateOrEdit: createOrEdit,//标记
        recordId: recordId,
        tbar: Ext.create('Ext.ux.toolbar.Edit', {
            btnCreate: {
                hidden: true,
                handler: function () {
                }
            },
            btnCopy: {
                hidden: true,
                handler: function () {
                }
            },
            btnReset: {
                disabled: createOrEdit == 'create' ? true : false,
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    controller.loadRecord(partnerId, recordId, form, createOrEdit, mask);
                }
            },
            btnSave: {
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    var resetBtn = view.ownerCt.getComponent('btnReset');
                    controller.saveFormValue(form, resetBtn, mask, partnerId, form.recordId);
                }
            },
            btnGrid: {
                handler: function () {
                    JSOpen({
                        id: 'manageSendMailConfig',
                        url: path + 'partials/partner/sendmailconfig/sendmailconfig.html?partnerId=' + partnerId + '&websiteId=' + websiteId
                    });
                }
            },
            btnConfig: {
                disabled: true,
                handler: function () {
                }
            },
            btnHelp: {
                handler: function () {
                }
            }
        }),
        layout: {
            type: 'table',
            columns: 2
        },
        defaults: {
            width: 250,
            margin: '5 5 5 5',
            labelWidth: 80,
            labelAlign: 'right',
            labelSeparator: ':<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>'
        },
        items: [
            {
                name: 'clazz',
                xtype: 'textfield',
                hidden: true,
                itemId: 'clazz',
                allowBlank: true,
                value: 'com.qpp.cgp.domain.partner.config.NotifyEmailSender'
            },
            {
                name: '_id',
                xtype: 'textfield',
                hidden: true,
                itemId: '_id',
                allowBlank: true
            },
            {
                name: 'username',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('username'),
                itemId: 'username',
                allowBlank: false

            },
            {
                name: 'password',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('password'),
                itemId: 'password',
                allowBlank: false
            },
            {
                name: 'address',
                xtype: 'textfield',
                allowBlank: false,
                fieldLabel: i18n.getKey('address'),
                itemId: 'address',
                allowBlank: false

            },
            {
                name: 'protocol',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('protocol'),
                itemId: 'protocol',
                allowBlank: false
            },
            {
                name: 'host',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('host'),
                itemId: 'host',
                allowBlank: false
            },
            {
                name: 'port',
                xtype: 'numberfield',
                hideTrigger: true,
                fieldLabel: i18n.getKey('port'),
                itemId: 'port',
                allowBlank: false
            },
            {
                name: 'timeout',
                xtype: 'numberfield',
                hideTrigger: true,
                fieldLabel: i18n.getKey('timeout'),
                itemId: 'timeout',
                allowBlank: false
            },
            {
                name: 'targetType',
                xtype: 'combo',
                fieldLabel: i18n.getKey('type'),
                itemId: 'targetType',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {
                            name: 'name',
                            type: 'string'
                        },
                        {
                            name: 'value',
                            type: 'string'
                        }
                    ],
                    data: [
                        {
                            name: i18n.getKey('customer'),
                            value: 'customer'
                        },
                        {
                            name: i18n.getKey('admin'),
                            value: 'backstage'
                        }
                    ]
                }),
                displayField: 'name',
                valueField: 'value',
                editable: false,
                allowBlank: false
            }
        ],
        listeners: {
            'afterrender': function (view) {
                controller.loadRecord(partnerId, recordId, view, createOrEdit, mask);
            }
        }
    });
    page.add(form);
})
