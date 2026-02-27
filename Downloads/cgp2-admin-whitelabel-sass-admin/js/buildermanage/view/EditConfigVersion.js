Ext.define('CGP.buildermanage.view.EditConfigVersion', {
    extend: 'Ext.window.Window',
    modal: true,
    resizable: false,
    layout: {
        type: 'table',
        // The total column count must be specified here
        columns: 2
    },
    minHeight: 600,
    height: 650,
    width: 950,
    //全局页面的编辑状态
    globalStatus: 'edit',
    autoScroll: true,
    defaults: {
        width: 350
    },
    grid: null,
    data: null,
    title: i18n.getKey('edit') + i18n.getKey('model'),
    draggable: true,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.buildermanage.controller.Controller');
        var languageStore = Ext.create('CGP.language.store.LanguageStore')
        me.title = i18n.getKey(me.editOrNew) + i18n.getKey('model');
        var form = Ext.create('Ext.ux.form.ErrorStrickForm', {
            itemId: 'editConfigForm',
            modal: true,
            resizable: false,
            width: '100%',
            border: false,
            layout: {
                type: 'table',
                // The total column count must be specified here
                columns: 2
            },
            defaults: {
                width: 350,
                labelAlign: 'left',
                msgTarget: 'side',
                validateOnChange: false
            },
            listeners: {
                afterrender: function (){
                    me.refreshData();
                    if(me.editOrNew == 'new'){
                        //me.form.getComponent('version').setValue(me.lastVersionId + 1);
                    }
                }
            },
            bodyStyle: {
                padding: '10px'
            },
            items: [
                {
                    name: 'publishVersion',
                    xtype: 'numberfield',
                    disabled: true,
                    fieldLabel: i18n.getKey('version'),
                    autoStripChars: true,
                    maskRe: /[PE0-9.]/,
                    listeners: {
                        afterrender: function (){
                            if(me.editOrNew == 'new'){
                                var form = me.getComponent('editConfigForm');
                                form.getComponent('version').setValue(me.lastVersionId + 1);
                            }
                        }
                    },
                    itemId: 'version'
                }, {
                    name: 'status',
                    xtype: 'combo',
                    editable: false,
                    allowBlank: false,
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: '草稿', value: 3
                            },
                            {
                                type: '测试', value: 2
                            }, {
                                type: '上线', value: 1
                            }
                        ]
                    }),
                    value: 1,
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'
                },
                {
                    name: 'platform',
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('platform'),
                    allowBlank: false,
                    itemId: 'platform',
                    editable: false,
                    valueField: 'value',
                    value: 'PC',
                    displayField: 'display',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                value: 'PC',
                                display: 'PC'
                            }, {
                                value: 'Mobile',
                                display: 'Mobile'
                            }
                        ]
                    })
                },{
                    name: 'supportLanguage',
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('supportLanguage'),
                    allowBlank: false,
                    itemId: 'supportLanguage',
                    displayField: 'name',
                    valueField: 'id',
                    msgTarget: 'side',
                    store: languageStore,
                    matchFieldWidth: false,
                    editable: false,
                    pickerAlign: 'bl',
                    multiSelect: true,
                    gridCfg: {
                        store: languageStore,
                        height: 280,
                        width: 800,
                        selType: 'checkboxmodel',
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: 'id',
                                xtype: 'gridcolumn',
                                itemId: 'id',
                                sortable: true
                            }, {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                xtype: 'gridcolumn',
                                itemId: 'name',
                                sortable: true
                            }, {
                                text: i18n.getKey('locale'),
                                dataIndex: 'locale',
                                xtype: 'gridcolumn',
                                itemId: 'locale',
                                sortable: true,
                                renderer: function (v) {
                                    if (v) {
                                        return v.name + '(' + v.code + ')';
                                    }
                                }
                            }, {
                                text: i18n.getKey('code'),
                                dataIndex: 'code',
                                xtype: 'gridcolumn',
                                itemId: 'code',
                                sortable: true,
                                renderer: function (v) {
                                    return v.code;
                                }
                            }, {
                                text: i18n.getKey('image'),
                                dataIndex: 'image',
                                xtype: 'gridcolumn',
                                minWidth: 120,
                                itemId: 'image',
                                sortable: true,
                                renderer: function (v) {
                                    var url = imageServer + v + '/64/64/png';
                                    return '<img src="' + url + '" />';
                                }
                            }, {
                                text: i18n.getKey('directory'),
                                dataIndex: 'directory',
                                xtype: 'gridcolumn',
                                itemId: 'directory',
                                sortable: true
                            }, {
                                text: i18n.getKey('sortOrder'),
                                dataIndex: 'sortOrder',
                                xtype: 'gridcolumn',
                                itemId: 'sortOrder',
                                sortable: true
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: languageStore,
                            displayInfo: true,
                            width: 275,
                            displayMsg: '',
                            emptyMsg: i18n.getKey('noData')
                        })
                    }
                }, {
                    name: 'builderUrl',
                    xtype: 'textarea',
                    height: 60,
                    fieldLabel: i18n.getKey('builderUrl'),
                    itemId: 'builderUrl',
                    allowBlank: false
                },
                {
                    name: 'userPreviewUrl',
                    xtype: 'textarea',
                    height: 60,
                    fieldLabel: i18n.getKey('userPreviewUrl'),
                    allowBlank: true,
                    itemId: 'userPreviewUrl',
                },
                {
                    name: 'manufacturePreviewUrl',
                    xtype: 'textarea',
                    height: 60,
                    fieldLabel: i18n.getKey('manufacturePreviewUrl'),
                    allowBlank: true,
                    itemId: 'manufacturePreviewUrl',
                }]
        });
        me.items = [
            form
        ];
        me.bbar= ['->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                itemId: 'saveBtn',
                handler: function (btn) {
                    var data = me.getValue();
                    controller.editConfigVersion(data,me.editOrNew,me.store,me,me.record,me.globalStatus);
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function () {
                    me.close();
                }
            }
        ]
        me.callParent(arguments);
    },

    getValue: function () {
        var me = this;
        var resultData = {};
        if(!Ext.isEmpty(me.configModelId)){
            resultData.builder = {
                _id: me.configModelId,
                clazz: 'com.qpp.cgp.domain.product.config.v2.builder.SystemBuilderConfigV2'
            };
        }
        var form = me.getComponent('editConfigForm');
        if(form.isValid()){
            var items = form.items.items;
            Ext.Array.each(items, function (item) {
                if(item.name == 'supportLanguage'){
                    resultData[item.name] = item.getArrayValue();
                }else{
                    resultData[item.name] = item.getValue();
                }

            });
            console.log(resultData);
        }
        return resultData;

    },

    refreshData: function () {
        var me = this, form = this.getComponent('editConfigForm');
        if(me.editOrNew == 'edit'){
            me.data = me.record.getData();
            var items = form.items.items;
            Ext.Array.each(items, function (item) {
                if(item.name == 'views'){
                    item.setSubmitValue(me.data[item.name]);
                }else{
                    item.setValue(me.data[item.name]);
                }

            })
        }

    }
})
