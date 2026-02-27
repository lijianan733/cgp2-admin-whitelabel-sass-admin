/**
 *详细页
 **/
Ext.define('CGP.threedpreviewplan.view.NavigationConfigForm', {
    extend: 'Ext.form.Panel',
    /*padding: 30,
    defaultType: 'textfield',
    defaults: {
        width: 450
    },*/
    //bodyStyle: 'border-top:0;border-color:white;',
    //itemId: 'baseInfo',
    /*layout: {
        type: 'table',
        columns: 1
    },*/
    padding: 10,
    data: [],
    //layout: 'fit',
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('navigation') + i18n.getKey('config');
        var navigationStore = Ext.create('Ext.data.Store', {
            autoSync: true,
            fields: [
                {name: 'x', type: 'number'},
                {name: 'y', type: 'number'},
                {name: 'z', type: 'number'},
                {name: 'icon', type: 'string'},
                {
                    name: 'clazz',
                    type: 'string',
                    defaultValue: 'com.qpp.cgp.domain.product.config.model.ThreeDView'
                }
            ],
            data: []
        });
        me.items = [{
            xtype: 'fieldcontainer',
            hideLabel: true,
            layout: 'hbox',
            name: 'subject',
            width: 800,
            defaults: {
                width: 80,
                labelAlign: 'right',
                labelWidth: 30
            },
            itemId: 'subject',
            getName: function () {
                return this.name
            },
            getValue: function () {

                return this.items.items[0].getValue()
            },
            items: [
                {
                    name: 'x',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    autoStripChars: true,
                    value: 0,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('x'),
                    itemId: 'positionX'
                }, {
                    name: 'y',
                    xtype: 'numberfield',
                    value: 0,
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('y'),
                    itemId: 'positionY'
                }, {
                    name: 'z',
                    xtype: 'numberfield',
                    value: 0,
                    hideTrigger: true,
                    autoStripChars: true,
                    allowExponential: false,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('z'),
                    itemId: 'positionZ'
                }, {
                    xtype: 'fileupload',
                    name: 'icon',
                    width: 250,
                    itemId: 'icon',
                    formFileName: 'file',
                    aimFileServerUrl: imageServer + 'upload/static?dirName=model-preview/data/image',//指定文件夹
                    fieldLabel: i18n.getKey('icon'),
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
                }
                ,
                {
                    xtype: 'button',
                    margin: '0 0 0 10',
                    iconCls: 'icon_add',
                    text: i18n.getKey('add') + i18n.getKey('navigation'),
                    handler: function () {
                        me.showAllEnablePlaceholder();
                    }
                },
                {
                    xtype: 'textfield',
                    name: 'clazz',
                    value: 'com.qpp.cgp.domain.product.config.model.ThreeDView',
                    hidden: true,

                }
            ]
        }, {
            xtype: 'gridfieldwithcrudv2',
            hideLabel: true,
            itemId: 'views',
            name: 'views',
            colspan: 2,
            minHeight: 100,
            width: 700,
            listeners: {
                render: function (comp) {
                    if (me.data) {
                        comp.setSubmitValue(me.data);
                    }
                }
            },
            winConfig: {
                formConfig: {
                    width: 500,
                    defaults: {
                        width: 450
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            name: 'x',
                            itemId: 'x',
                            fieldLabel: i18n.getKey('x')
                        }, {
                            xtype: 'numberfield',
                            name: 'y',
                            itemId: 'y',
                            fieldLabel: i18n.getKey('y')
                        },
                        {
                            xtype: 'numberfield',
                            name: 'z',
                            itemId: 'z',
                            fieldLabel: i18n.getKey('z')
                        },
                        {
                            xtype: 'fileuploadv2',
                            name: 'icon',
                            itemId: 'icon',
                            formFileName: 'file',
                            staticDir: 'model-preview/data/image',
                            fieldLabel: i18n.getKey('icon'),
                            valueUrlType: 'part',
                        }
                    ],
                },
            },
            //hidden: true,
            //disabled: true,
            gridConfig: {
                tbar: {hidden: true},
                store: navigationStore,
                columns: [
                    {
                        text: i18n.getKey('x'),
                        dataIndex: 'x',
                        tdCls: 'vertical-middle'
                    },
                    {
                        text: i18n.getKey('y'),
                        dataIndex: 'y',
                        tdCls: 'vertical-middle'
                    },
                    {
                        text: i18n.getKey('z'),
                        dataIndex: 'z',
                        tdCls: 'vertical-middle'
                    }, {
                        text: i18n.getKey('icon'),
                        dataIndex: 'icon',
                        tdCls: 'vertical-middle'
                    }
                ]
            },

        }];
        me.listeners = {
            render: function () {
                if (me.data) {
                    //me.setValue(me.data);
                }
            }

        };
        me.callParent(arguments);

    },
    getValue: function () {
        var me = this;
        if (!me.rendered) {
            return me.data;
        }
        var views = me.getComponent('views').getSubmitValue();
        return views;
    },
    setValue: function (data) {
        var me = this;
        me.data = data;
        if (me.rendered) {
            var views = this.getComponent('views');
            views.setSubmitValue(data);
        }

    },
    addNavigation: function (store, data) {
        store.add(data);
    }


});
