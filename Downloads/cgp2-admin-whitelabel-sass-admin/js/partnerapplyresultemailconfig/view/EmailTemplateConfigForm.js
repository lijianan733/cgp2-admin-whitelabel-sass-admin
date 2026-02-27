/**
 * Created by nan on 2018/2/1.
 */
Ext.Loader.syncRequire(['CGP.mailhistory.controller.overridesubmit'])
Ext.Loader.syncRequire(['Ext.ux.form.field.MultiCombo', 'Ext.ux.grid.column.ArrayColumn']);
Ext.syncRequire([
    'CGP.role.store.Role',
    'Ext.ux.form.field.MultiCombo',
    'CGP.partner.view.partnerorderreportconfigmanage.view.DiyEmailsFieldComponent',
    'CGP.common.field.WebsiteCombo'
]);
Ext.define('CGP.partnerapplyresultemailconfig.view.EmailTemplateConfigForm', {
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
                if (item.name == 'verifySuccessNotificationConfig' || item.name == 'verifyFailedNotificationConfig') {
                    for (var j = 0; j < item.items.items.length; j++) {
                        var itemIsValid = null;
                        var verifySuccessNotificationConfigItem = item.items.items[j]
                        if (verifySuccessNotificationConfigItem.xtype == 'fieldcontainer') {
                            itemIsValid = verifySuccessNotificationConfigItem.items.items[0].isValid();
                            if (!itemIsValid) {
                                errors[item.getFieldLabel() + '_' + verifySuccessNotificationConfigItem.getFieldLabel()] = verifySuccessNotificationConfigItem.items.items[0].getErrors();
                                isValid = false;
                            }
                        } else if (verifySuccessNotificationConfigItem.xtype == 'uxtextarea') {
                            itemIsValid = verifySuccessNotificationConfigItem.isValid();
                            itemIsValid = !Ext.isEmpty(verifySuccessNotificationConfigItem.getValue());
                            if (!itemIsValid) {
                                errors[item.getFieldLabel() + '_' + verifySuccessNotificationConfigItem.getFieldLabel()] = '该输入项为必输项';
                                isValid = false;
                            }
                        } else {
                            itemIsValid = verifySuccessNotificationConfigItem.isValid();
                            if (!itemIsValid) {
                                errors[verifySuccessNotificationConfigItem.getFieldLabel()] = verifySuccessNotificationConfigItem.getErrors();
                                isValid = false;
                            }
                        }
                    }
                } else {
                    itemIsValid = item.isValid();
                    if (!itemIsValid) {
                        errors[item.getFieldLabel()] = item.getErrors();
                        isValid = false;
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
    msgTarget: 'side',
    fieldDefaults: {
        padding: '10 10 5 10',
        width: 600,
        allowBlank: false,
        msgTarget: 'side',
        labelWidth: 100
    },
    recordIdCopy: null,
    bodyStyle: 'overflow-x:hidden;overflow-y:scroll',
    showAllEnablePlaceholder: function () {
        var localData = CGP.partnerapplyresultemailconfig.config.Config.data;
        if (!Ext.getCmp('EmailTemplateConfigForm')) {
            var win = Ext.widget('showjsondatawindow', {
                id: 'EmailTemplateConfigForm',
                rawData: localData,
                title: '可用的占位符'
            });
            win.show();
        }
    },
    constructor: function (config) {

        var recordId = config.recordId;
        var me = this;
        me.bodyStyle = 'overflow-x:hidden;overflow-y:scroll';

        if (!Ext.isEmpty(config['recordId'])) {
            me.recordIdCopy = config.recordId;
        }
        applyConfig2 = Ext.Object.merge({
            bodyStyle: 'overflow-x:hidden;overflow-y:scroll',
            layout: {
                type: 'table',
                columns: 1
            },
            autoScroll: false,
            configRecode: config.configRecode,
            header: false,
            title: config.title,
            items: [
                {
                    name: 'websiteId',
                    xtype: 'websitecombo',
                    hidden: true,
                    itemId: 'websiteId',
                },
                {
                    xtype: 'multicombobox',
                    itemId: 'defaultRoleIds',
                    name: 'defaultRoleIds',
                    store: config.roleStore,
                    allowBlank: false,
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    multiSelect: true,
                    fieldLabel: i18n.getKey('defaultRole')
                },
                {
                    xtype: 'displayfield',
                    itemId: '',
                    value: '<hr style="color: blue"/>',
                    width: window.innerWidth,
                    margin: '0 0 0 -30'
                },
                {
                    xtype: 'uxfieldcontainer',
                    fieldLabel: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('agreed') + i18n.getKey('notifyEmailConfig') + '</font>',
                    name: 'verifySuccessNotificationConfig',
                    itemId: 'verifySuccessNotificationConfig',
                    width: 900,
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: i18n.getKey('subject'),
                            layout: 'hbox',
                            colspan: 2,
                            name: 'subject',
                            id: 'subject1',
                            itemId: 'subject1',
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
                                    itemId: 'button',
                                    text: '查看所有可用占位符',
                                    handler: function () {
                                        this.ownerCt.ownerCt.ownerCt.showAllEnablePlaceholder();
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'uxtextarea',
                            itemId: 'content1',
                            name: 'content',
                            width: 800,
                            colspan: 2,
                            height: 300,
                            allowBlank: false,
                            fieldLabel: i18n.getKey('content')
                        },
                        {
                            xtype: 'form',
                            itemId: 'fileUpload1',
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
                                    itemId: 'file1'
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('upload'),
                                    id: 'attachmentsBar1',
                                    itemId: 'attachmentsBar',
                                    style: {
                                        marginLeft: '5px'
                                    },
                                    amount: 0,
                                    handler: function (button) {
                                        var formPanel = this.ownerCt.ownerCt.getComponent('fileUpload1');
                                        var attachmentsList = this.ownerCt.ownerCt.getComponent('attachmentsList1');
                                        var file = formPanel.getComponent('file1');
                                        if (!Ext.isEmpty(file.getRawValue())) {
                                            var myMask = new Ext.LoadMask(this.ownerCt.ownerCt, {msg: "上传中..."});
                                            myMask.show();
                                            formPanel.getForm().submit({
                                                url: adminPath + 'api/files?access_token=' + Ext.util.Cookies.get('token'),
                                                method: 'POST',
                                                success: function (form, action) {
                                                    myMask.hide();
                                                    var fileName = action.response.data[0].originalFileName;
                                                    var uploadId = action.response.data[0].id;
                                                    var name = action.response.data[0].name;
                                                    var controller = Ext.create('CGP.mailhistory.controller.Controller');
                                                    var imgurl = path + 'ClientLibs/extjs/resources//themes/images/shared/fam/remove.png';
                                                    var downLoadImgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
                                                    var id = Date() + '1';
                                                    var objDisplay = {
                                                        id: id,
                                                        width: 250,
                                                        fileName: fileName,
                                                        name: name,
                                                        hideLabel: true,
                                                        uploadId: uploadId,
                                                        value: "<div id = '" + name + "' class='file'>" + fileName +
                                                            " <img style='vertical-align: middle;width:15px; height:15px' src='" + downLoadImgurl + "' onclick='downLoad(\"" + id + "\")'/>" +
                                                            " <img style='vertical-align: middle;width:15px; height:15px' src='" + imgurl + "' onclick='deleteFile(\"" + id + "\")'/></div>"
                                                    };
                                                    var displayField = new Ext.form.field.Display(objDisplay);
                                                    attachmentsList.add(displayField);
                                                    file.reset();
                                                },
                                                failure: function (form, action) {
                                                    myMask.hide();
                                                }
                                            });
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'form',
                            itemId: 'attachmentsList1',
                            width: 600,
                            name: 'attachments',
                            height: '100%',
                            border: false,
                            defaults: {
                                margin: '0 0 0 100'
                            },
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
                },
                {
                    xtype: 'displayfield',
                    value: '<hr />',
                    width: window.innerWidth,
                    margin: '0 0 0 -30'

                },
                {
                    xtype: 'uxfieldcontainer',
                    fieldLabel: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('rejected') + i18n.getKey('notifyEmailConfig') + '</font>',
                    name: 'verifyFailedNotificationConfig',
                    itemId: 'verifyFailedNotificationConfig',
                    width: 900,
                    items: [
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
                                        this.ownerCt.ownerCt.ownerCt.showAllEnablePlaceholder();
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
                            allowBlank: false,
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
                                        marginLeft: '5px'
                                    },
                                    amount: 0,
                                    handler: function (button) {
                                        var formPanel = this.ownerCt.ownerCt.getComponent('fileUpload');
                                        var attachmentsList = this.ownerCt.ownerCt.getComponent('attachmentsList');
                                        var file = formPanel.getComponent('file');
                                        if (!Ext.isEmpty(file.getRawValue())) {
                                            var myMask = new Ext.LoadMask(this.ownerCt.ownerCt, {msg: "上传中..."});
                                            myMask.show();
                                            formPanel.getForm().submit({
                                                url: adminPath + 'api/files?access_token=' + Ext.util.Cookies.get('token'),
                                                method: 'POST',
                                                success: function (form, action) {
                                                    myMask.hide();
                                                    var fileName = action.response.data[0].originalFileName;
                                                    var uploadId = action.response.data[0].id;
                                                    var name = action.response.data[0].name;
                                                    var controller = Ext.create('CGP.mailhistory.controller.Controller');
                                                    var imgurl = path + 'ClientLibs/extjs/resources//themes/images/shared/fam/remove.png';
                                                    var downLoadImgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
                                                    var id = Date() + '2';
                                                    var objDisplay = {
                                                        id: id,
                                                        width: 250,
                                                        fileName: fileName,
                                                        name: name,
                                                        hideLabel: true,
                                                        uploadId: uploadId,
                                                        value: "<div id = '" + name + "' class='file'>" + fileName +
                                                            " <img style='vertical-align: middle;width:15px; height:15px' src='" + downLoadImgurl + "' onclick='downLoad(\"" + id + "\")'/>" +
                                                            " <img style='vertical-align: middle;width:15px; height:15px' src='" + imgurl + "' onclick='deleteFile(\"" + id + "\")'/></div>"
                                                    };
                                                    var displayField = new Ext.form.field.Display(objDisplay);
                                                    attachmentsList.add(displayField);
                                                    file.reset();
                                                },
                                                failure: function (form, action) {
                                                    myMask.hide();
                                                }
                                            });
                                        }
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
                            defaults: {
                                margin: '0 0 0 100'
                            },
                            style: {
                                marginLeft: '205px'
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
            tbar: [
                {
                    xtype: 'button',
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function (view) {
                        if (view.ownerCt.ownerCt.isValid()) {
                            var controller = Ext.create('CGP.partnerapplyresultemailconfig.controller.Controller');
                            var formValue = controller.getFormValue(view.ownerCt.ownerCt);
                            controller.saveFormValue(formValue, view.ownerCt.ownerCt.createOrEdit, view.ownerCt.ownerCt.recordIdCopy);
                        }
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
                            var controller = Ext.create('CGP.partnerapplyresultemailconfig.controller.Controller');
                            var PartnerApplyResultEmailConfigStore = Ext.create('CGP.partnerapplyresultemailconfig.store.PartnerApplyResultEmailConfigStore', {
                                params: {
                                    filter: '[{"name":"_id","value":"' + recordId + '","type":"string"}]'
                                }
                            });
                            PartnerApplyResultEmailConfigStore.load(function () {
                                var record = {};
                                record = PartnerApplyResultEmailConfigStore.getAt(0);
                                controller.setFormValue(form, record);
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
                        top.Ext.getCmp("tabs").setActiveTab(top.Ext.getCmp("tabs").getComponent('partnerapplyresultemailconfigpage'));
                    }
                }
            ]
        }, config);
        me.callParent([applyConfig2]);
    }
})
