Ext.define('CGP.threedmodelconfig.view.EditAssetForm', {
    extend: 'Ext.window.Window',

    width: 450,
    modal: true,
    layout: 'fit',
    bodyStyle: 'padding:10px',
    autoShow: true,
    initComponent: function () {
        var me = this;

        me.title = i18n.getKey('selectWebsite');
        me.bbar = [
            '->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                handler: function cinfirm() {
                    if (me.form.isValid()) {
                        var data = {};
                        me.form.items.each(function (item) {
                            data[item.name] = item.getValue();
                            me.record.set(item.name, item.getValue());
                        });
                        me.close();

                    }
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                handler: function (btn) {
                    me.close();
                }
            }];
        var form = {
            xtype: 'form',
            border: false,
            listeners: {
                afterrender: function (comp) {
                    var items = me.form.items.items;
                    var data = me.record.data;
                    Ext.Array.each(items, function (item) {
                        item.setValue(data[item.name]);
                    })
                }
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                value: '123',
                name: 'name'
            }, {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                name: 'description'
            }, {
                name: 'type',
                xtype: 'combo',
                fieldLabel: i18n.getKey('type'),
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [{name: 'Dynamic', value: 'Dynamic'}, {name: 'Mesh', value: 'Mesh'}, {
                        name: 'Fix',
                        value: 'Fix'
                    }]
                }),
                value: 'Dynamic',
                valueField: 'value',
                displayField: 'name',
                queryMode: 'local',
                itemId: 'type'
            }, {
                name: 'useTransparentMaterial',
                xtype: 'checkbox',
                fieldLabel: i18n.getKey('useTransparentMaterial'),
                itemId: 'useTransparentMaterial'
            }, {
                name: 'index',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('index'),
                itemId: 'index'
            },
                {
                    xtype: 'fileupload',
                    name: 'defaultImage',
                    itemId: 'modelFileName',
                    formFileName: 'file',
                    aimFileServerUrl: imageServer + 'upload/static?dirName=model-preview/data/image',//指定文件夹
                    fieldLabel: i18n.getKey('modelFileName'),
                    height: 80,
                    uploadHandler: function () {
                        var formPanel = this.ownerCt.ownerCt;
                        var win = formPanel.ownerCt;
                        var file = formPanel.getComponent('file');
                        var url = win.fileUpLoadField.aimFileServerUrl;
                        var filePath = win.fileUpLoadField.getComponent('filePath');
                        if (!Ext.isEmpty(file.getRawValue())) {
                            var myMask = new Ext.LoadMask(win, {msg: "上传中..."});
                            myMask.show();
                            formPanel.getForm().submit({
                                url: url,
                                method: 'POST',
                                success: function (form, action) {
                                    myMask.hide();
                                    var data = Ext.JSON.decode(action.response.data);
                                    filePath.setValue(data[0].path);
                                    win.close();
                                },
                                failure: function (form, action) {
                                    myMask.hide();
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('上传失败'));
                                }
                            });
                        }
                    },
                    listeners: {
                        afterrender: function () {
                            var me = this;
                            var downLoadBtn = me.getComponent('buttonGroup').getComponent('downloadBtn');
                            downLoadBtn.hide();
                        }
                    }
                }, {
                    xtype: 'textfield',
                    name: 'clazz',
                    hidden: true,
                    value: 'com.qpp.cgp.dto.product.config.model.AssetsInfo',

                }]
        };
        me.items = [form];
        me.callParent(arguments);
        me.form = me.down('form');
    }
})
