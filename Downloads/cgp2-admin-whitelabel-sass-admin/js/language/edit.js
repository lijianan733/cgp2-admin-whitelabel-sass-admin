/**
 * 语言设置添加修改 的编辑页面ExtJS
 *
 */
Ext.onReady(function () {

    var codeStore = Ext.create('CGP.language.store.CodeStore');
    var zoneStore = Ext.create('CGP.zone.store.Zone');
    var page = Ext.widget({
        block: 'language',
        xtype: 'uxeditpage',
        gridPage: 'language.html',
        tbarCfg: {
            btnSave: {
                //disabled: true,
                handler: function () {
                    var formpanel = Ext.create("Ext.ux.form.Panel", {

                        hidden: true,
                        items: []
                    });
                    var image = page.form.getComponent('file');
                    //					Ext.fly(image.getEl()).down('input').dom.name = 'file';
                    var name = image.getName();
                    var clone = image.cloneConfig();
                    if (image.getValue().indexOf(':') != -1) {
                        formpanel.add(image);
                        page.form.insert(3, clone);
                        formpanel.submit({
                            url: adminPath + 'api/files',
                            method: 'POST',
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (form, action) {
                                //page.form.insert(3,image);
                                page.form.getComponent('image').setValue(action.response.data[0].name);
                                page.form.submitForm({
                                    callback: function (data, operation, success) {
                                        if (success) {
                                            page.form.getComponent('file').setRawValue(operation.records[0].data.image);
                                            page.toolbar.buttonCreate.enable();
                                            page.toolbar.buttonCopy.enable();
                                        }
                                    }
                                });
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert();
                            }
                        });
                    } else {
                        page.form.submitForm({
                            callback: function (data, operation, success) {
                                if (success) {
                                    page.form.getComponent('file').setRawValue(operation.records[0].data.image);
                                    page.toolbar.buttonCreate.enable();
                                    page.toolbar.buttonCopy.enable();
                                }
                            }
                        });
                    }
                }
            }
        },
        formCfg: {
            model: 'CGP.language.model.LanguageModel',
            remoteCfg: false,
            items: [{
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                allowBlank: false,
                itemId: 'name'
            }, {
                name: 'locale',
                fieldLabel: i18n.getKey('locale'),
                itemId: 'locale',
                xtype: 'gridcombo',
                haveReset:true,
                allowBlank: true,
                multiSelect: false,
                displayField: 'code',
                valueField: 'id',
                labelAlign: 'right',
                editable: false,
                store: zoneStore,
                matchFieldWidth: false,
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setInitialValue([data.id])
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    if (me.getSubmitValue().length > 0) {
                        return {
                            id: me.getSubmitValue()[0],
                            clazz: 'com.qpp.cgp.domain.common.Zone'
                        }
                    }
                    return null;

                },
                gridCfg: {
                    height: 300,
                    width: 500,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 80,
                            dataIndex: 'id'
                        },
                        {
                            text: i18n.getKey('name'),
                            width: 100,
                            dataIndex: 'name'
                        },
                        {
                            text: i18n.getKey('code'),
                            width: 100,
                            dataIndex: 'code'
                        },
                        {
                            text: i18n.getKey('country'),
                            flex: 1,
                            dataIndex: 'country',
                            renderer: function (v) {
                                return v.name;
                            }
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: zoneStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            }, {
                name: 'code',
                xtype: 'gridcombo',
                fieldLabel: i18n.getKey('code'),
                allowBlank: false,
                itemId: 'code',
                multiSelect: false,
                displayField: 'code',
                valueField: 'id',
                labelAlign: 'right',
                editable: false,
                store: codeStore,
                matchFieldWidth: false,
                diySetValue: function (data) {
                    console.log(data);
                    var me = this;
                    if (data) {
                        me.setInitialValue([data.id])
                    }

                },
                diyGetValue: function () {
                    var me = this;
                    return {
                        id: me.getSubmitValue()[0],
                        clazz: 'com.qpp.cgp.domain.common.LanguageCode'
                    }
                },
                gridCfg: {
                    height: 300,
                    width: 500,
                    store: codeStore,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 80,
                            dataIndex: 'id'
                        },
                        {
                            text: i18n.getKey('name'),
                            width: 200,
                            dataIndex: 'name'
                        },
                        {
                            text: i18n.getKey('code'),
                            flex: 1,
                            dataIndex: 'code'
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: codeStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            }, {
                id: 'file',
                name: 'files',
                xtype: 'filefield',
                buttonText: i18n.getKey('choice'),
                fieldLabel: i18n.getKey('image'),
                itemId: 'file',
                listeners: {
                    change: function (component, value) {
                        var src;
                    }
                }
            }, {
                name: 'directory',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('directory'),
                itemId: 'directory'
            }, {
                name: 'sortOrder',
                xtype: 'numberfield',
                autoStripChars: true,
                fieldLabel: i18n.getKey('sortOrder'),
                itemId: 'sortOrder'
            }, {
                name: 'image',
                xtype: 'hidden',
                itemId: 'image',
                listeners: {
                    change: function (hidden, newValue) {
                        hidden.ownerCt.getComponent('file').setRawValue(hidden.getValue());
                        var url, html;
                        if (newValue != null && newValue != '') {
                            if (newValue.indexOf(":") == -1) {
                                url = imageServer + newValue + "/64/64/png";
                                //html = '<img src="' + url + '" />';
                                var wrappedImage = hidden.ownerCt.getComponent('browseImage');
                                if (wrappedImage == null) {
                                    wrappedImage = Ext.create('Ext.form.field.Display', {
                                        fieldLabel: i18n.getKey('languageImgText') + ':',
                                        width: 300,
                                        itemId: 'browseImage',
                                        value: '<img src="' + url + '" />',
                                        style: {
                                            marginLeft: 45
                                        }
                                        //
                                    });
                                    hidden.ownerCt.insert(6, wrappedImage);

                                } else {
                                    wrappedImage.setValue('<img src="' + url + '" />');
                                }

                            } else {
                                var wrappedImage = hidden.ownerCt.getComponent('browseImage');
                                if (wrappedImage != null) {
                                    wrappedImage.disabled();
                                }
                            }
                        }
                    }
                }
            }]
        },
        listeners: {
            'afterload': function (page) {
                console.log(page.form);
            }
        }
    });
});
