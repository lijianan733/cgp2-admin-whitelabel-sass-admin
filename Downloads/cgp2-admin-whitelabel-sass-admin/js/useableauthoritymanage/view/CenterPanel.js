/**
 * Created by nan on 2018/8/27.
 */
Ext.define('CGP.useableauthoritymanage.view.CenterPanel', {
    extend: 'Ext.form.Panel',
    region: 'center',
    frame: false,
    itemId: 'centerPanel',
    formCreateOrEdit: 'create',//标记是否新建
    createOrEdit: null,
    recordId: null,
    layout: {
        type: 'table',
        columns: 1
    },
    defaults: {
        width: 400,
        margin: '5 5 5 5',
        labelWidth: 80,
        labelAlign: 'right',
        labelSeparator: ':<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>'
    },
    initComponent: function () {
        var me = this;
        var mask = new Ext.LoadMask(me, {
            msg: "加载中..."
        });

        var controller = Ext.create('CGP.useableauthoritymanage.controller.Controller');
        var authorityStore = me.authorityStore;
        me.tbar = Ext.create('Ext.ux.toolbar.Edit', {
            btnCreate: {
                hidden: true,
                handler: function () {
                }
            },
            btnCopy: {
                hidden: true,
                handler: function () {
                }
            },
            btnReset: {
                disabled: me.createOrEdit == 'create' ? true : false,
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    controller.gridLoadRecord(me.recordId, form, me.createOrEdit, mask);
                }
            },
            btnSave: {
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    var resetBtn = view.ownerCt.getComponent('btnReset');
                    controller.saveFormValue(form, resetBtn, mask, form.recordId);
                }
            },
            btnGrid: {
                text: i18n.getKey('switch') + i18n.getKey('view'),
                icon: path + 'ClientLibs/extjs/resources/themes/images/ux/switch.png',
                handler: function () {
                    var leftPanel = me.ownerCt.ownerCt.getComponent('leftPanel');
                    leftPanel.expand();
                }
            },
            btnConfig: {
                disabled: true,
                handler: function () {
                }
            },
            btnHelp: {
                handler: function () {
                }
            }
        });
        me.items = [
            {
                name: 'name',
                xtype: 'textfield',
                allowBlank: false,
                itemId: 'name',
                fieldLabel: i18n.getKey('name')
            },
            {
                name: 'description',
                xtype: 'textfield',
                allowBlank: false,
                itemId: 'description',
                fieldLabel: i18n.getKey('description')
            },
            {
                name: 'code',
                xtype: 'textfield',
                allowBlank: false,
                itemId: 'code',
                fieldLabel: i18n.getKey('code')
            },
            {
                name: 'operation',
                xtype: 'combo',
                allowBlank: false,
                itemId: 'operation',
                fieldLabel: i18n.getKey('operation'),
                store: me.operationStore,
                displayField: 'description',
                valueField: '_id',
                queryMode: 'local',
                forceSelection: true

            },
            {
                xtype: 'gridcombo',
                fieldLabel: i18n.getKey('resources'),
                allowBlank: false,
                valueField: '_id',
                displayField: 'name',
                itemId: 'resource',
                msgTarget: 'side',
                width: 600,
                store: me.resourcesStore,
                editable: false,
                name: 'resource',
                pickerAlign: 'bl',
                gridCfg: {
                    store: me.resourcesStore,
                    height: 300,
                    width: '100%',
                    viewConfig: {
                        enableTextSelection: true,
                        stripeRows: true
                    },
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            dataIndex: '_id',
                            text: i18n.getKey('id'),
                            width: 80
                        },
                        {
                            dataIndex: 'name',
                            text: i18n.getKey('name'),
                            flex: 3
                        },
                        {
                            dataIndex: 'description',
                            text: i18n.getKey('description'),
                            flex: 3
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: me.resourcesStore,
                        displayInfo: true,
                        displayMsg: '',
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            },
            {
                xtype: 'gridfieldv2',
                fieldLabel: i18n.getKey('permission'),
                itemId: 'privileges',
                width: 600,
                store: me.authorityStore,
                allowBlank: false,
                editable: false,
                multiSelect: true,
                name: 'privileges',
                gridConfig: {
                    store: me.authorityStore,
                    height: 500,
                    width: '100%',
                    selType: 'checkboxmodel',
                    viewConfig: {
                        stripeRows: true,
                        enableTextSelection: true
                    },
                    multiSelect: true,
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            dataIndex: '_id',
                            text: i18n.getKey('id'),
                            flex: 1
                        },
                        {
                            dataIndex: 'name',
                            text: i18n.getKey('name'),
                            flex: 3
                        },
                        {
                            dataIndex: 'description',
                            text: i18n.getKey('description'),
                            flex: 3
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: me.authorityStore,
                        displayInfo: true,
                        displayMsg: '',
                        emptyMsg: i18n.getKey('noData')
                    }),
                    listeners: {
                        afterrender: function (view) {
                            var form = me;
                            view.store.on('load', function () {
                                for (var i = 0; i < form.items.items.length; i++) {
                                    var item = form.items.items[i];
                                    item.setDisabled(true);
                                    item.hide();
                                }
                            }, this, {
                                single: true
                            })
                        }
                    }

                }
            }
        ];
        me.callParent();

    }
})