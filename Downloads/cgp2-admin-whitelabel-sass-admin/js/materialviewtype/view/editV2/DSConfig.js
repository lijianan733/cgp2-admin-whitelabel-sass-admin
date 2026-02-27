Ext.Loader.syncRequire(["CGP.dsdatasource.view.DatasourceCombo"]);
Ext.define('CGP.materialviewtype.view.editV2.DSConfig', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    requires:[],
    title: i18n.getKey('DS')+i18n.getKey('config'),
    layout: {
        type: 'table',
        columns: 1
    },
    bodyStyle: 'padding:10px',
    autoScroll: true,
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 120,
        msgTarget: 'side',
        validateOnChange: false,
        plugins: [
            {
                ptype: 'uxvalidation'
            }
        ]
    },

    initComponent: function () {
        var me=this;
        var controller = Ext.create('CGP.materialviewtype.controller.Controller');
        var storePcsPlaceholder = Ext.create("CGP.materialviewtype.store.PcsPlaceholder", {
            data: []
        });
        me.items=[
            {
                name: 'dsDataSourceId',
                xtype: 'datasourcecombo',
                itemId: 'dsDataSourceId',
                fieldLabel: i18n.getKey('dsDataSource'),
                allowBlank: false,
                haveReset:true,
                editable: false,
                width: 380
            },
            {
                xtype: 'toolbar',
                border: '0',
                margin: 0,
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
                isValid: function () {
                    return true;
                },
                items: [
                    {
                        xtype: 'displayfield',
                        width: 100,
                        value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('pcsPlaceholders') + '</font>',
                    },
                ]
            },
            // {
            //     xtype: 'placeholders',
            //     itemId: 'placeholders',
            //     name: 'placeholders',
            //     width: "100%",
            //     border: 0,
            //     maxHeight: 248,
            // },

            {
                xtype: 'gridfieldwithcrudv2',
                itemId: 'pcsPlaceholders',
                name: 'pcsPlaceholders',
                fieldLabel: '',
                padding:"0 10",
                hideLabel:true,
                // minHeight: 200,
                width: 900,
                gridConfig: {
                    // renderTo:JSGetUUID(),
                    addHandler:function (btn){
                        var store = btn.ownerCt.ownerCt.getStore();
                        controller.editPcsPlaceholder('new', store, null);
                    },
                    store: storePcsPlaceholder,
                    columns:[
                        {
                            xtype: 'actioncolumn',
                            itemId: 'actioncolumn',
                            sortable: false,
                            resizable: false,
                            width: 70,
                            tdCls: 'vertical-middle',
                            menuDisabled: true,
                            items: [
                                {
                                    iconCls: 'icon_edit icon_margin',
                                    tooltip: i18n.getKey('edit'),
                                    handler: function (view, rowIndex, colIndex, a, b) {
                                        var store = view.getStore();
                                        var record = store.getAt(rowIndex);
                                        controller.editPcsPlaceholder('edit', store, record);
                                    }
                                },
                                {
                                    iconCls: 'icon_remove icon_margin',
                                    itemId: 'actiondelete',
                                    tooltip: i18n.getKey('remove'),
                                    handler: function (view, rowIndex, colIndex, a, b, record) {
                                        var store = view.store;
                                        Ext.Msg.confirm('提示', '确定删除？', callback);
                                        function callback(id) {
                                            if (id === 'yes') {
                                                store.removeAt(rowIndex);
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            text: i18n.getKey('selector'),
                            sortable: false,
                            width: 100,
                            dataIndex: 'selector',
                            menuDisabled:true,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }

                        },
                        {
                            text: i18n.getKey('attributes'),
                            dataIndex: 'attributes',
                            sortable: false,
                            menuDisabled:true,
                            width: 100,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('description'),
                            dataIndex: 'description',
                            sortable: false,
                            menuDisabled:true,
                            width: 200,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('expression'),
                            dataIndex: 'expression',
                            sortable: false,
                            menuDisabled:true,
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        }
                    ],
                },
            }
        ]
        me.callParent(arguments);
    },
    listeners:{
        afterrender:function (comp){
            if(comp.data){
                comp.setValue(comp.data);
            }
        }
    }
})