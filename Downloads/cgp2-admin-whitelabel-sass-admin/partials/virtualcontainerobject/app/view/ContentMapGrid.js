/**
 * Created by miao on 2021/10/08.
 */
Ext.define("CGP.virtualcontainerobject.view.ContentMapGrid", {
    extend: 'Ext.ux.form.GridField',
    alias: 'widget.contentmapgrid',
    bodyStyle: "overflow-x:hidden;overflow-y:auto",
    width: '100%',
    rawvctItems: null,
    vctItems: null,
    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.virtualcontainerobject.store.ContentMapItem', {
            storeId: 'contentMapStore',
        });
        me.gridConfig = {
            margin: '5 28 5 20',
            renderTo: JSGetUUID(),
            store: me.store,
            minHeight: 200,
            layout: 'fit',
            tbar: {
                hidden: true,
                items: [
                    {
                        xtype: 'displayfield',
                        width: 2
                    },
                    {
                        itemId: 'itemAdd',
                        text: i18n.getKey('add'),
                        iconCls: 'icon_add',
                        hidden: me.vctItems ? me.getStore().count() >= me.vctItems.length : true,
                        disabled: me.vctItems ? me.getStore().count() >= me.vctItems.length : true,
                    }
                ]
            },
            columns: [
                {
                    xtype: 'rownumberer',
                    text: i18n.getKey('seqNo'),
                    sortable: false,
                    width: 50
                },
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    dataIndex: '_id',
                    width: 50,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex, icon, event, record) {
                                var grid = view.ownerCt;
                                Ext.create('Ext.window.Window', {
                                    layout: 'fit',
                                    modal: true,
                                    constrain: true,
                                    width: 600,
                                    height: 200,
                                    title: i18n.getKey('ContentMapEdit'),
                                    record: record,
                                    items: [
                                        {
                                            xtype: 'form',
                                            itemId: 'gridEdit',
                                            layout: {
                                                type: 'table',
                                                columns: 2
                                            },
                                            items: [
                                                {
                                                    padding: 20,
                                                    name: 'childObject',
                                                    xtype: 'vcocombo',
                                                    fieldLabel: i18n.getKey('childObject'),
                                                    itemId: 'childObject',
                                                    displayField: 'displayName',
                                                    valueField: '_id',
                                                    width: 380,
                                                    editable: false,
                                                    store: Ext.create('CGP.virtualcontainerobject.store.VirtualContainerObject', {
                                                        storeId: 'itemVCOStore',
                                                        listeners: {
                                                            load: function (store, rec, successful) {
                                                                // if (successful) {
                                                                //     var vctId = JSGetQueryString('vctId');
                                                                //     if (vctId) {
                                                                //         me.getComponent('containerType').setSubmitValue(vctId);
                                                                //     }
                                                                // }
                                                            }
                                                        },
                                                        ///todo:添加筛选条件
                                                        // params:{
                                                        //     filter:Ext.JSON.encode([{
                                                        //         name: 'argumentBuilder',
                                                        //         type: 'object',
                                                        //         value: productId
                                                        //     }])
                                                        // }
                                                    }),
                                                    matchFieldWidth: false,
                                                    multiSelect: false,
                                                    allowBlank: false
                                                },
                                                {
                                                    xtype: 'button',
                                                    itemId: 'addVCO',
                                                    text: 'addVCO',
                                                    iconCls: 'icon_add',
                                                    margin: '0 0 0 5',
                                                    handler: function (btn) {
                                                        var controller = Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');
                                                        controller.selectVCT(btn, 'itemAddVCO');
                                                    }
                                                }
                                            ],
                                            bbar: [
                                                '->',
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'icon_save',
                                                    text: i18n.getKey('confirm'),
                                                    handler: function (btn) {
                                                        var form = btn.ownerCt.ownerCt;
                                                        var win = form.ownerCt;
                                                        var vcoCombo = form.getComponent('childObject');
                                                        var value0 = null;
                                                        if (!vcoCombo.isValid()) {
                                                            return false;
                                                        }
                                                        value0 = Ext.Object.getValues(vcoCombo.getValue())[0];
                                                        win.record.set('childObject', {
                                                            _id: value0._id,
                                                            clazz: value0.clazz
                                                        });
                                                        win.close();
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'icon_cancel',
                                                    text: i18n.getKey('cancel'),
                                                    handler: function (btn) {
                                                        var form = btn.ownerCt.ownerCt;
                                                        var win = form.ownerCt;
                                                        win.close();
                                                    }
                                                }
                                            ]
                                        }
                                    ],

                                }).show();
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            hidden: function (view, rowIndex, colIndex, item, record) {
                                return record?.raw?.required;
                            },
                            handler: function (view, rowIndex, colIndex) {
                                if (view.store.getAt(rowIndex)?.raw?.required) {
                                    Ext.Msg.alert(i18n.getKey('info'), 'isRequire is true Cannot be deleted!');
                                    return false;
                                }
                                Ext.Msg.confirm(i18n.getKey('info'), i18n.getKey('deleteConfirm'), function (select) {
                                    if (select == 'yes') {
                                        var store = view.getStore();
                                        store.removeAt(rowIndex);
                                        me.setItemAdd();
                                    }
                                });
                            }
                        },
                    ]
                },
                // {
                //     text: i18n.getKey('childVCT'),
                //     sortable: false,
                //     dataIndex: 'childVCT',
                //     width: 100,
                //     renderer: function (value, metadata) {
                //         metadata.tdAttr = 'data-qtip ="' + value._id + '"';
                //         return value._id;
                //     }
                // },
                {
                    // xtype: 'componentcolumn',
                    text: i18n.getKey('name'),
                    sortable: false,
                    dataIndex: 'name',
                    width: 160,
                    renderer: function (value, metadata, rec) {
                        // metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value || rec?.raw?.name;
                    }
                },
                {
                    // xtype: 'componentcolumn',
                    text: i18n.getKey('required'),
                    sortable: false,
                    dataIndex: 'required',
                    width: 80,
                    renderer: function (value, metadata, rec) {
                        // metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return i18n.getKey(value);
                    }
                },
                {
                    xtype: 'componentcolumn',
                    text: i18n.getKey('childObject'),
                    dataIndex: 'childObject',
                    flex: 1,
                    renderer: function (value, metadata, rec) {
                        // return value?._id;
                        return {
                            xtype: 'container',
                            layout: {
                                type: 'hbox'
                            },
                            border: 0,
                            style: {borderColor: '#000000', borderStyle: 'solid', borderWidth: '1px'},
                            defaults: {},
                            items: [
                                {
                                    name: 'childObject',
                                    xtype: 'vcocombo',
                                    fieldLabel: i18n.getKey('childObject'),
                                    itemId: 'childObject',
                                    displayField: 'displayName',
                                    valueField: '_id',
                                    width: 200,
                                    hideLabel: true,
                                    editable: false,
                                    // allowBlank: false,
                                    store: Ext.create('CGP.virtualcontainerobject.store.VirtualContainerObject', {
                                        storeId: 'itemVCOStore',
                                        listeners: {
                                            load: function (store, rec, successful) {
                                                if (successful && me.data) {
                                                    var itemvcoId = me.data['childObject']?._id;
                                                    if (itemvcoId) {
                                                        me.getComponent('childObject').setSubmitValue(itemvcoId);
                                                    }
                                                }
                                            }
                                        },
                                        ///todo:添加筛选条件
                                        // params:{
                                        //     filter:Ext.JSON.encode([{
                                        //         name: 'argumentBuilder',
                                        //         type: 'object',
                                        //         value: productId
                                        //     }])
                                        // }
                                    }),
                                    matchFieldWidth: false,
                                    multiSelect: false,
                                    listeners: {
                                        afterrender: function (comp) {
                                            value ? comp.setInitialValue([value?._id]) : null;
                                        },
                                        change: function (comp, newValue, oldValue) {
                                            if (newValue && !Ext.Object.isEmpty(newValue)) {
                                                var value0 = Ext.Object.getValues(newValue)[0];
                                                if (value?._id != value0._id)
                                                    rec.set('childObject', {_id: value0._id, clazz: value0.clazz});
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'addVCO',
                                    text: i18n.getKey('create') + i18n.getKey('VCO'),
                                    iconCls: 'icon_add',
                                    margin: '0 0 0 5',
                                    handler: function (btn) {
                                        var controller = Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');
                                        controller.selectVCT(btn, 'itemAddVCO');
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        };
        me.callParent(arguments);
    },
    diyGetValue: function () {
        var me = this, data = [];
        data = me.getSubmitValue();
        return data;
    },
    setItemAdd: function () {
        var me = this;
        var itemAdd = Ext.ComponentQuery.query("[itemId='itemAdd']")[0];
        if (me.rawvctItems ? me.getStore().count() < me.rawvctItems.length : false) {
            itemAdd.show();
            itemAdd.enable();
        } else {
            itemAdd.hide();
            itemAdd.disable();
        }
    },
    isValid: function () {
        var me = this, isValid = true;
        var data = me.getSubmitValue();
        if (data && Ext.isArray(data)) {
            for (var d of data) {
                if (Ext.isEmpty(d.childObject)) {
                    isValid = false;
                    break;
                }
            }
        }
        return isValid;
    }
})



