Ext.Loader.syncRequire(['CGP.common.commoncomp.UploadPanel']);
Ext.define('CGP.common.field.TemplateUpload', {
    extend: 'Ext.form.FieldContainer',
    alias: ['widget.templatefield'],
    border: false,
    layout: {
        type: 'hbox',
        align: 'stretch '
    },
    isShowCompleteUrl: false,//显示url
    noLog: false,//不保存上传log标识，false保存，true不保存
    url: composingPath + 'api/templates/upload?type=PAGE',
    useType: '',//上传文件用途分类
    allowFileType: null,//允许上传文件格式 ['.svg','.pdf','.jpg']|['.*']
    formFileName: 'files',//请求上传接口的参数名
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'textarea',
                itemId: 'fileName',
                flex: 1,
                minHeight: 60,
                allowBlank: me.allowBlank,
                listeners: {
                    afterrender: function (comp) {
                        comp.emptyText = me.allowFileType ? me.allowFileType.join('/') : ''
                    },
                    change: function (field, newValue, oldValue) {
                        var thumbnail = field.ownerCt.getComponent('thumbnail');
                        var url = me.downloadUrl + newValue;
                        var isImageType = function (url) {
                            var str = url.split('.').pop();
                            return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(str.toLowerCase()) !== -1
                        }
                        if (isImageType(url)) {
                            thumbnail.setSrc(url);
                            thumbnail.show();
                        } else {
                            thumbnail.hide();
                        }
                    }
                }
            }, {
                xtype: 'container',
                margin: '0 5 0 5',
                layout: {
                    type: 'vbox',
                    align: 'center',
                    page: 'center'
                },
                defaults: {
                    xtype: 'button',
                    width: 60,
                    margin: '5 0 5 0',
                },
                items: [
                    {
                        text: i18n.getKey('upload'),
                        handler: me.uploadHandler,
                    },
                    {
                        text: i18n.getKey('download'),
                        disabled: Ext.isEmpty(me.downloadUrl),
                        handler: function () {
                            var fileName = me.getComponent('fileName').getValue();
                            if (fileName) {
                                JSDownload(me.downloadUrl + fileName, fileName);
                            } else {
                                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('下传失败'));
                            }
                        }
                    },
                ]
            },
            {
                xtype: 'imagedisplayfield',
                height: '100%',
                itemId: 'thumbnail',
                hidden: true,
                width: 80,
                title: '查看图片',
            }
        ];
        me.callParent(arguments);
    },

    uploadHandler: function (btn) {
        var templateField = btn.ownerCt.ownerCt;
        var wind = Ext.create('Ext.window.Window', {
            itemId: "windUpload",
            title: i18n.getKey('file') + i18n.getKey('upload'),
            modal: true,
            bodyPadding: 5,
            width: 500,
            height: 150,
            layout: 'fit',
            fileUpLoadField: templateField,
            items: [
                {
                    xtype: 'form',
                    itemId: 'fileUpload',
                    border: false,
                    items: [
                        {
                            name: templateField.formFileName,
                            xtype: 'filefield',
                            width: 440,
                            labelWidth: 50,
                            padding: 20,
                            allowBlank: true,
                            enableKeyEvents: true,
                            buttonText: i18n.getKey('choice'),
                            fieldLabel: i18n.getKey('file'),
                            itemId: 'file',
                            supporMultFn: function (field, typeArray) {
                                //允许使用的文件类型
                                var fileDom = field.getEl().down('input[type=file]');
                                fileDom.dom.setAttribute("accept", typeArray.join(","));
                                if (!Ext.isEmpty(this.uploadFolder) && this.uploadFolder == true) {
                                    fileDom.dom.setAttribute('webkitdirectory', 'webkitdirectory');
                                }
                            },
                            listeners: {
                                afterrender: function (comp) {
                                    var container = wind.fileUpLoadField;
                                    if (container.allowFileType) {
                                        comp.supporMultFn(comp, container.allowFileType);
                                    }
                                }
                            }
                        }
                    ]
                }
            ],
            bbar: ['->',
                {
                    xtype: 'button',
                    text: i18n.getKey('ok'),
                    iconCls: 'icon_agree',
                    itemId: 'changeReportTemplateFilePathBar',
                    amount: 0,
                    handler: function (button) {
                        var win = button.ownerCt.ownerCt;
                        var formPanel = win.down('form');
                        var file = formPanel.getComponent('file');
                        var url = win.fileUpLoadField.url + win.fileUpLoadField.useType;
                        var filePath = win.fileUpLoadField.getComponent('fileName');
                        if (!Ext.isEmpty(file.getRawValue())) {
                            wind.setLoading("上传中...");
                            formPanel.getForm().submit({
                                url: url,
                                method: 'POST',
                                success: templateField.fnSuccess || function (form, action) {
                                    // myMask.hide();
                                    wind.setLoading(false);
                                    if (win.fileUpLoadField.isShowCompleteUrl) {
                                        filePath.setValue(imageServer + '/' + action.response.data[0].name);
                                    } else {
                                        filePath.setValue(action.response.data[0].name);
                                    }
                                    win.close();
                                },
                                failure: function (form, action) {
                                    // myMask.hide();
                                    wind.setLoading(false);
                                    var message = action.response.data.message || '文件上传失败';
                                    Ext.Msg.alert(i18n.getKey('prompt'), message);
                                },
                            });
                        }
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'icon_cancel',
                    text: i18n.getKey('cancel'),
                    handler: function () {
                        this.ownerCt.ownerCt.close();
                    }
                }
            ],
        });
        wind.show();
    },

    fnSuccess: function (fp, action) {
        var wind = fp.owner.ownerCt;
        var me = wind.fileUpLoadField;
        var f = action.response.data[0];
        var fileName = f.fileName;
        if (!me.noLog) {
            var logData = [{
                "clazz": "com.qpp.composing.domain.TemplateUploadLog",
                fileName: f.fileName,
                md5: f.md5,
                templateType: me.useType,
                createdBy: Ext.JSON.decode(Ext.util.Cookies.get('user')) ? Ext.JSON.decode(Ext.util.Cookies.get('user')).userId : null,
                format: f.fileName.substr(f.fileName.lastIndexOf('.') + 1)
            }];
            //保存上传记录
            var method = "POST", url;
            url = composingPath + 'api/templates/logs';
            Ext.Ajax.request({
                url: url,
                method: method,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: logData,
                success: function (response, options) {
                    wind.setLoading(false);
                    var resp = Ext.JSON.decode(response.responseText);
                    if (!resp.success) {
                        console.log(i18n.getKey('saveFailure') + resp.data.message);
                    }
                },
                failure: function (response, options) {
                    var object = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
                },
                callback: function () {
                    wind.setLoading(false);
                }
            });
        }
        me.getComponent('fileName').setValue(fileName);
        wind.close();
    },

    isValid: function () {
        var me = this;
        var isValid = true;
        var fileNameComp = me.getComponent('fileName');
        if (!fileNameComp.allowBlank && !fileNameComp.isValid())
            isValid = false;
        return isValid;
    },
    getValue: function () {
        var me = this;
        var fileNameComp = me.getComponent('fileName');
        return fileNameComp.getValue();
    },
    getErrors: function () {
        return '不允许为空'
    },
    setValue: function (data) {
        var me = this;
        me.getComponent('fileName').setValue(data);

    },
    getName: function () {
        var me = this;
        return me.name;
    },
    setReadOnly: function () {
        var me = this;
        return;
    },
    reset: function () {
        var me = this;
        me.items.items[0].reset();
    }
})
