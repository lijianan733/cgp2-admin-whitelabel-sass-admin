/**
 * Created by nan on 2018/1/12.
 */
Ext.Loader.syncRequire(['Ext.ux.form.field.MultiCombo', 'Ext.ux.grid.column.ArrayColumn']);
Ext.syncRequire([ 'CGP.role.store.Role', 'Ext.ux.form.field.MultiCombo','CGP.partner.view.partnerorderreportconfigmanage.view.DiyEmailsFieldComponent']);
Ext.define('CGP.partner.view.partnerorderreportconfigmanage.view.EmailTemplateConfigForm', {
    extend: 'Ext.ux.form.Panel',
    itemsId:'emailTemplateConfigForm',
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
                    } else if (item.xtype == 'htmleditor') {
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
        padding: 10,
        width: 600,
        allowBlank: false,
        msgTarget: 'side',
        labelWidth: 100
    },
    constructor: function (config) {
        var me = this;
        var partnerId = config.partnerId;
        var createOrUpdate = config.createOrUpdate;
        var configRecode = config.configRecode;
        var controller = Ext.create('CGP.partner.view.partnerorderreportconfigmanage.controller.Controller');
        var configStore = config.configStore;
        var roleStore = Ext.create("CGP.role.store.Role", {
                listeners: {
                    load: function (DBStorestore, records) {
                        for (var i = 0; i < records.length; i++) {
                            records[i].set('show', records[i].get('name') + "(角色编号：" + records[i].get('id') + ")");
                        }
                    }
                }
            }
        );
        applyConfig2 = {
            configRecode: config.configRecode,
            title: config.title,
            items: [
                {
                    xtype: 'hiddenfield',
                    name: 'clazz',
                    itemId: 'clazz',
                    value: 'com.qpp.cgp.domain.mail.MailTemplateConfig',
                    fieldLabel: i18n.getKey('clazz')
                },
                {
                    name: 'to',
                    itemId: 'to',
                    xtype: 'diyemailsfieldcomponent',
                    fieldLabel: i18n.getKey('receiverName'),
                    colspan: 2,
                    panelConfig: {
                        width: 800,
                        minHeight: 50,
                        id: 'panel1',
                        renderTo: 'panel1',
                        itemId: 'panel1',
                        allowBlank: false
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
                        width: 800,
                        minHeight: 50,
                        id: 'panel2',
                        renderTo: 'panel2',
                        itemId: 'panel2',
                        allowBlank: true
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
                        width: 800,
                        minHeight: 50,
                        id: 'panel3',
                        renderTo: 'panel3',
                        itemId: 'panel3',
                        allowBlank: true
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
                            allowBlank: false,
                            value: configRecode.get('mailTemplateConfig').subject
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
                    xtype: 'htmleditor',
                    itemId: 'content',
                    name: 'content',
                    width: 800,
                    value: configRecode.get('mailTemplateConfig').content,
                    colspan: 2,
                    height: 300,
                    fieldLabel: i18n.getKey('content'),
                    enableColors: false,
                    enableLinks: false,
                    plugins: [Ext.create('CGP.partner.view.partnerorderreportconfigmanage.view.DiyPlugins')]

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
                                marginTop: '-4px',
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
                                            var imgurl = '../../ClientLibs/extjs/resources//themes/images/shared/fam/remove.png';
                                            var id = Date() + '4';
                                            var objDisplay = {
                                                id: id,
                                                width: 250,
                                                height: 30,
                                                name: name,
                                                fileName:fileName,
                                                hideLabel: true,
                                                uploadId: uploadId,
                                                value: "<div id = '" + id + "' class='file'>" + fileName + " <img style='vertical-align: middle;width:15px; height:15px' src='" + imgurl + "' onclick='deleteFile(\"" + id + "\")'/></div>"
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
                    style: {
                        marginLeft: '105px'
                    },
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    amunt: 0,
                    listeners: {
                        afterrender: function () {
                            var me = this;
                            var controller = Ext.create('CGP.mailhistory.controller.Controller');
                            if (createOrUpdate == 'edit') {
                                var data = configRecode.get('mailTemplateConfig')['attachments'];
                                if (!Ext.isEmpty(data)) {
                                    var controller = Ext.create('CGP.mailhistory.controller.Controller');
                                    for (var i = 0; i < data.length; i++) {
                                        var upLoadId = data[i].id;
                                        var fileName = data[i].name;
                                        var name=data[i].url.substring(data[i].url.lastIndexOf('/')+1,data[i].url.length)
                                        var url=data[i].url;
                                        var imgurl = path+'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png';
                                        var id = 'file' + (me.amunt++);
                                        var objDisplay = {
                                            id: id,
                                            width: 250,
                                            height: 30,
                                            fileName:fileName,
                                            name: name,
                                            hideLabel: true,
                                            uploadId: upLoadId,
                                            value: "<div id = '" + url + "' class='emailDiv'>" + fileName + " <img style='vertical-align: middle;width:15px; height:15px' src='" + imgurl + "' onclick='deleteEmail(\"" + id + "\")'/></div>"
                                        };
                                        var displayField = new Ext.form.field.Display(objDisplay);
                                        this.add(displayField);
                                    }
                                }
                            }
                        }
                    }
                }

            ],
            tbar: [
                {
                    xtype: 'button',
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function () {
                        var allFormValue = controller.getAllFormValue(this.ownerCt.ownerCt);
                        if (!Ext.isEmpty(allFormValue)) {
                            controller.saveFormValue(partnerId, allFormValue, createOrUpdate);

                        }
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'btnGrid',
                    text: i18n.getKey('grid'),
                    iconCls: 'icon_grid',
                    handler: function () {
                        JSOpen({
                            id: 'partnerOrderReportConfigManage',
                            url: path + 'partials/partnerorderreportconfigmanage/partnerOrderReportConfigManage.html?partnerId=' + partnerId + '&websiteId=' + null,
                            title: i18n.getKey('partnerOrderReportConfigManage') + '(' + i18n.getKey('partner') + i18n.getKey('id') + ':' + partnerId + ')',
                            refresh: true
                        })
                    }
                }
            ]
        }
        window.deleteFile = function (itemId) {
            var field = Ext.getCmp(itemId);
            field.ownerCt.remove(field);

        };
        me.callParent([applyConfig2]);
    },
    initComponent: function () {
        var me = this;

        me.callParent(arguments);
    }
})
