Ext.Loader.syncRequire(['CGP.mailhistory.controller.overridesubmit'])
Ext.onReady(function () {

    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('customsCategory'),
        block: 'customscategory',
        editPage: 'edit.html',
        tbarCfg: {
            btnExport: {
                disabled: false,
                handler: function () {
                    var fileUrl = adminPath + 'api/customsCategory/excel?access_token=' + Ext.util.Cookies.get('token');
                    if (!Ext.isEmpty(fileUrl)) {
                        var a = document.createElement('a');
                        a.setAttribute('href', fileUrl);
                        a.setAttribute('download', null);
                        a.click();
                    }
                }
            },
            btnImport: {
                disabled: false,
                handler: function () {
                    var win = Ext.create('Ext.window.Window', {
                        title: i18n.getKey('导入Excel文件'),
                        height: 150,
                        width: 600,
                        resizable: Boolean,
                        constrain: true,
                        modal: true,
                        layout: 'fit',
                        items: {
                            xtype: 'form',
                            itemId: 'fileUpload',
                            border: false,
                            width: 600,
                            height: '100%',
                            bbar: ['->',
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('ok'),
                                    iconCls: 'icon_agree',
                                    id: 'changeReportTemplateFilePathBar',
                                    itemId: 'changeReportTemplateFilePathBar',
                                    amount: 0,
                                    handler: function (button) {
                                        var formPanel = this.ownerCt.ownerCt.ownerCt.getComponent('fileUpload');
                                        var file = formPanel.getComponent('file');
                                        if (!Ext.isEmpty(file.getRawValue())) {
                                            var myMask = new Ext.LoadMask(this.ownerCt.ownerCt.ownerCt, {msg: "上传中..."});
                                            myMask.show();
                                            formPanel.getForm().submit({
                                                url: adminPath + 'api/customsCategory/excel?access_token=' + Ext.util.Cookies.get('token'),
                                                method: 'POST',
                                                headers: {
                                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                                },
                                                success: function (form, action) {
                                                    myMask.hide();
                                                    var response = action.response;
                                                    if (response.success) {
                                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('upload') + i18n.getKey('success'), function () {
                                                            page.grid.store.load();
                                                        });
                                                    } else {
                                                        Ext.Msg.alert(i18n.getKey('prompt'), response.data.message)
                                                    }
                                                    formPanel.ownerCt.close();
                                                },
                                                failure: function (form, action) {
                                                    myMask.hide();
                                                }
                                            });
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'icon_cancel',
                                    text: i18n.getKey('cancel'),
                                    handler: function () {
                                        this.ownerCt.ownerCt.ownerCt.close();
                                    }
                                }
                            ],
                            items: [
                                {
                                    name: 'file',//有自定义的上传处理
                                    xtype: 'filefield',
                                    width: 500,
                                    padding: 20,
                                    id: 'fileUpload',
                                    allowBlank: true,
                                    enableKeyEvents: true,
                                    buttonText: i18n.getKey('choice'),
                                    labelAlign: 'right',
                                    fieldLabel: i18n.getKey('file'),
                                    itemId: 'file',
                                    listeners: {
                                        afterrender: function (obj, ops) {
                                            $("#fileUpload input").attr("accept", "application/vnd.ms-excel");
                                        },
                                        change: function (file, fieldName) {
                                            //校验文件类型
                                            var fileDir = fieldName;
                                            var suffix = fileDir.substr(fileDir.lastIndexOf("."));
                                            if ("" == fileDir) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), "选择需要导入的Excel文件！");
                                                return false;
                                            }
                                            if (".xls" != suffix && ".xlsx" != suffix) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), "选择Excel格式的文件导入！");
                                                file.reset();
                                                return false;
                                            }
                                            return true;
                                        }
                                    }
                                }
                            ]
                        }
                    });
                    win.show();
                }
            },
            btnHelp: {
                handler: function (btn) {
                    Ext.Msg.alert(i18n.getKey('prompt'),
                        '在表格中按下ctrl键即可实现多选<br>' +
                        'S:默认显示无对应属性，不能修改<br>' +
                        'N:默认为无值，不能修改<br>' +
                        'Y:必填')
                }
            }
        },
        gridCfg: {
            //store.js
            store: Ext.create("CGP.customscategory.store.CustomsCategory"),
            frame: false,
            columnDefaults: {
                tdCls: 'vertical-middle',
                autoSizeColumn: true
            },
            columns: [
                {
                    xtype: 'rownumberer',
                    width: 35
                },
                {
                    text: i18n.getKey('id'),
                    width: 70,
                    dataIndex: '_id',
                    itemId: '_id',
                    sortable: true
                },
                {
                    text: i18n.getKey('tagKeyCode'),
                    dataIndex: 'tagKeyCode',
                    width: 100,
                    itemId: 'tagKeyCode',
                    sortable: true
                },
                {
                    text: i18n.getKey('inName'),
                    dataIndex: 'inName',
                    width: 165,
                    itemId: 'inName',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip=' + value;
                        return value
                    }
                },
                {
                    text: i18n.getKey('inCode'),
                    dataIndex: 'inCode',
                    width: 120,
                    itemId: 'inCode'
                },

                {
                    text: i18n.getKey('outName'),
                    dataIndex: 'outName',
                    itemId: 'outName',
                    width: 165,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip=' + value;
                        return value
                    }
                },
                {
                    text: i18n.getKey('outCode'),
                    dataIndex: 'outCode',
                    itemId: 'outCode',
                    width: 120
                },
                {
                    text: i18n.getKey('unit'),
                    dataIndex: 'unit',
                    itemId: 'unit',
                    width: 80
                },
                {
                    text: i18n.getKey('remark'),
                    dataIndex: 'remark',
                    itemId: 'remark',
                    width: 120,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip=' + value;
                        return value
                    }
                },
                {
                    text: i18n.getKey('is') + i18n.getKey('show') + i18n.getKey('size'),
                    dataIndex: 'showSize',
                    width: 120,
                    itemId: 'isShowSize'
                },
                {
                    text: i18n.getKey('is') + i18n.getKey('show') + i18n.getKey('quantity'),
                    dataIndex: 'showCount',
                    itemId: 'isShowCount',
                    width: 120
                },
                {
                    text: i18n.getKey('is') + i18n.getKey('show') + i18n.getKey('brand'),
                    dataIndex: 'showBrand',
                    itemId: 'isShowBrand',
                    width: 120
                },
                {
                    text: i18n.getKey('is') + i18n.getKey('show') + i18n.getKey('specification'),
                    dataIndex: 'showSpecifications',
                    itemId: 'isShowSpecifications',
                    width: 120
                },
                {
                    text: i18n.getKey('is') + i18n.getKey('show') + i18n.getKey('model'),
                    dataIndex: 'showModel',
                    itemId: 'isShowModel',
                    width: 120
                },
                {
                    text: i18n.getKey('is') + i18n.getKey('show') + i18n.getKey('cargoNo'),
                    dataIndex: 'showFreightNum',
                    itemId: 'isShowFreightNum',
                    width: 120
                },
                {
                    text: i18n.getKey('is') + i18n.getKey('name') + i18n.getKey('patternNo'),
                    dataIndex: 'showStyleNum',
                    itemId: 'isShowStyleNum',
                    width: 120
                },
                {
                    text: i18n.getKey('isCommodityInspection'),
                    dataIndex: 'commodityInspection',
                    itemId: 'isCommodityInspection',
                    width: 120
                }
            ]
        },
        filterCfg: {
            minHeight: 125,
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'tagKeyCode',
                    name: 'tagKeyCode',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('tagKeyCode'),
                    itemId: 'tagKeyCode'
                },
                {
                    id: 'inName',
                    name: 'inName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('inName'),
                    itemId: 'inName'
                },
                {
                    id: 'inCode',
                    name: 'inCode',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('inCode'),
                    itemId: 'inCode'
                },
                {
                    id: 'outName',
                    name: 'outName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('outName'),
                    itemId: 'outName'
                },
                {
                    id: 'outCode',
                    name: 'outCode',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('outCode'),
                    itemId: 'outCode'
                }
            ]
        }
    });
});
