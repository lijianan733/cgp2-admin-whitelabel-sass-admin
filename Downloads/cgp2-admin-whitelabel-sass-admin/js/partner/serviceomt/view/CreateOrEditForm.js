/**
 * Created by nan on 2018/1/25.
 */
Ext.Loader.syncRequire(['CGP.mailhistory.controller.overridesubmit'])
Ext.Loader.syncRequire([ 'Ext.ux.form.field.MultiCombo', 'Ext.ux.grid.column.ArrayColumn']);
Ext.syncRequire([ 'CGP.role.store.Role', 'Ext.ux.form.field.MultiCombo', 'CGP.partner.view.partnerorderreportconfigmanage.view.DiyEmailsFieldComponent']);
Ext.define('CGP.partner.serviceomt.view.CreateOrEditForm', {
    extend: 'Ext.ux.form.Panel',
    //CreateForm为FormPanel必须调用的生成form的方法，在该方法中可以定义form的校验
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
                    } else if (item.xtype == 'uxeditpage') {
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
        var localData = {
            "partnerName": null,
            "year": 0,
            "month": 0,
            "totalCount": 0,
            "totalPrice": 0.0,
            "context": {
                "yearMonth": null,
                "productSummaries": [
                    {
                        "productId": [
                            {

                            }
                        ],
                        "displayName": null,
                        "price": null,
                        "qty": 0,
                        "totalPrice": null
                    }
                ],
                "reportDetail": {
                    "dayDetails": [
                        {
                            "oneDayDetail": {
                                "dateFormatString": null,
                                "productOneDayDetails": [
                                    {
                                        "productId": [
                                            {

                                            }
                                        ],
                                        "qty": null
                                    }
                                ],
                                "totalQty": null
                            }
                        }
                    ],
                    "reportDetailHeaders": [
                        {

                        }
                    ]
                }
            }
        };
        if (!Ext.getCmp('CreateOrEditFormshowjsondatawindow1')) {
            var win = Ext.widget('showjsondatawindow', {
                id: 'CreateOrEditFormshowjsondatawindow1',
                rawData: localData,
                title: '查看可用占位符'
            });
            win.show();
        }
    },
    constructor: function (config) {
        var me = this;
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
                    name: 'to',
                    itemId: 'to',
                    xtype: 'diyemailsfieldcomponent',
                    fieldLabel: i18n.getKey('receiverName'),
                    colspan: 2,
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
                        width: 700,
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
                            allowBlank: false
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 10',
                            text: '查看所有可用占位符',
                            handler: function () {
                                this.ownerCt.ownerCt.showAllEnablePlaceholder();
                            }
                        }
                    ]
                },
                {
                    xtype: 'uxtextarea',
                    /*xtype:'htmleditor',*/
                    itemId: 'content',
                    name: 'content',
                    width: 800,
                    colspan: 2,
                    height: 300,
                    fieldLabel: i18n.getKey('content')/*,
                 enableColors: false,
                 enableLinks: false,
                 plugins: [Ext.create('CGP.partner.view.partnerorderreportconfigmanage.view.DiyPlugins')]*/

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
                                            var downLoadImgurl = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/downLoad.png';
                                            var imgurl = path + 'ClientLibs/extjs/resources//themes/images/shared/fam/remove.png';
                                            var id = Date() + '4';
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
                            var controller = Ext.create('CGP.partner.serviceomt.controller.Controller');
                            var formValue = controller.getFormValue(view.ownerCt.ownerCt);
                            controller.saveFormValue(formValue, view.ownerCt.ownerCt.createOrEdit, view.ownerCt.ownerCt.recordIdCopy);
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
                        cmsPageModel = null;
                        this.setDisabled(true);
                        window.parent.Ext.getCmp("servermailtpedit").setTitle(i18n.getKey('create') + "_" + i18n.getKey('server') + i18n.getKey('notifyEmailConfig'));
                        var form = this.ownerCt.ownerCt;
                        Ext.Array.each(form.items.items, function (item) {
                            form.recordIdCopy = null;
                            form.createOrEdit = 'create';
                        });
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
                            var controller = Ext.create('CGP.partner.serviceomt.controller.Controller');
                            var MailTemplateStore = Ext.create('CGP.partner.serviceomt.store.ServiceOmtStore', {
                                type: 'backstage',
                                params: {
                                    filter: '[{"name":"_id","value":"' + form.recordId + '","type":"string"}]'
                                }
                            });
                            MailTemplateStore.load(function () {
                                var record = {};
                                record = MailTemplateStore.getAt(0);
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
                        var mailTemplateTabs = window.parent.Ext.getCmp('mailTemplateTabs');
                        mailTemplateTabs.setActiveTab(window.parent.Ext.getCmp('servermailtemplate'));

                    }
                }
            ]
        }, config);
        window.deleteFile = function (itemId) {
            var field = Ext.getCmp(itemId);
            field.ownerCt.remove(field);
        };
        me.callParent([applyConfig2]);
    }
})
