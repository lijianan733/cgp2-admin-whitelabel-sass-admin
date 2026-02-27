/**
 * ParamsGrid
 * @Author: miao
 * @Date: 2021/12/18
 */
Ext.define("CGP.exception.view.ParamsGrid", {
    extend: 'Ext.ux.form.GridField',
    alias: 'widget.paramsgrid',
    requires: [],
    layout: 'fit',
    autoScroll:true,
    bodyStyle: 'padding:10px',
    Defaults: {
        width: 80
    },
    data:null,

    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.exception.controller.BusinessException');
        me.store = Ext.create('Ext.data.Store', {
            fields: ['name', 'description'],
            data: me.data
        });
        me.gridConfig = {
            renderTo: JSGetUUID(),
            selType: 'checkboxmodel',
            layout: 'fit',
            height:230,
            multiSelect: true,
            autoScroll:true,
            store: me.store,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                hidden:me.readOnly,
                items: [
                    {
                        text: i18n.getKey('add'),
                        iconCls: 'icon_add',
                        itemId: 'addParams',
                        handler: function (btn) {
                            var paramsGrid = btn.ownerCt.ownerCt;
                            controller.addParams(paramsGrid, null);
                        }
                    },
                    {
                        text: i18n.getKey('delete'),
                        iconCls: 'icon_delete',
                        itemId: 'deleteParams',
                        handler: function (btn) {
                            var paramsGrid = btn.ownerCt.ownerCt;
                            controller.deleteParams(paramsGrid, null);
                        }
                    },
                ]
            }],

            columns: [
                // {
                //     xtype: 'rownumberer',
                //     text: i18n.getKey('seqNo'),
                //     sortable: false,
                //     width: 50
                // },
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    dataIndex: '_id',
                    width: 50,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    hidden:me.readOnly,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex) {

                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                controller.addParams(view, record);
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                Ext.Msg.confirm(i18n.getKey('info'), i18n.getKey('deleteConfirm'), function (select) {
                                    if (select == 'yes') {
                                        var store = view.getStore();
                                        store.removeAt(rowIndex);
                                    }
                                });
                            }
                        },
                    ]
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 200,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    flex: 1,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    }
                }
            ]
        };
        me.callParent(arguments);
    },

    diyGetValue: function () {
        var me = this;
        var data = me.data || [];
        data = me.getSubmitValue();
        return data;
    },
    diySetValue: function (data) {
        var me = this;
        me.data = data;
        me.setSubmitValue(data);
    },
})

