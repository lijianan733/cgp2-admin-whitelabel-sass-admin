/**
 * Created by nan on 2018/3/19.
 */
Ext.define('CGP.common.valueExV2.view.ManagerContinuousValueConstraintGrid', {
    extend: 'Ext.grid.Panel',
    id: 'managerSkuAttriConstraint',
    autoScroll: true,
    viewConfig: {
        enableTextSelection: true//设置grid中的文本可以选择
    },
    initComponent: function () {
        var me = this;
        me.columns = [
            {
                xtype: 'actioncolumn',
                tdCls: 'vertical-middle',
                itemId: 'actioncolumn',
                width: 60,
                sortable: false,
                resizable: false,
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        itemId: 'actionedit',
                        tooltip: 'Edit',
                        handler: function (view, rowIndex, colIndex,event,el,record) {
                            var recordId = me.store.getAt(rowIndex).get('_id');
                            me.controller.selectConstraintType( recordId, me.tabPanel, 'edit', me.inputTypeClazz, me.store.getAt(rowIndex).data, me.configurableId,record,me.currentPanel);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actionremove',
                        tooltip: 'Remove',
                        handler: function (view, rowIndex, colIndex,event,el,reocod) {
                            var recordId = me.store.getAt(rowIndex).get('_id');
                            Ext.Msg.confirm('提示', '确定删除？', callback);
                            function callback(id) {
                                if (id === 'yes') {
                                    me.store.remove(reocod);
                                    //重新编排行号
                                    for(var i=0;i<me.store.data.items.length;i++){
                                        me.store.data.items[i].index=i;
                                    }
                                    me.getView().refresh()
                                }
                            }
                        }
                    }

                ]
            },
            {
                xtype:'rownumberer',
                tdCls: 'vertical-middle'

            },
            {
                text: i18n.getKey('type'),
                dataIndex: 'clazz',
                tdCls: 'vertical-middle',
                sortable:false,
                sortable:false,
                width: 200,
                menuDisabled:true,
                renderer: function (value) {
                    return i18n.getKey('single') + i18n.getKey(value.substring(value.lastIndexOf('.') + 1, value.length));
                }

            },
            {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                tdCls: 'vertical-middle',
                menuDisabled:true,
                sortable:false,
                width: 200

            },
            {
                text: i18n.getKey('condition'),
                dataIndex: 'conditions',
                tdCls: 'vertical-middle',
                xtype: 'componentcolumn',
                menuDisabled:true,
                sortable:false,
                renderer: function (value, metadata, record) {
                    if (!Ext.isEmpty(value)) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('condition') + '</a>',
                            listeners: {
                                render: function (display) {
                                    display.getEl().on("click", function () {
                                        var valueString = JSON.stringify(value, null, "\t");
                                        var win = Ext.create("Ext.window.Window", {
                                            id: "layers",
                                            modal: true,
                                            constrain:true,
                                            layout: 'fit',
                                            title: i18n.getKey('check') + i18n.getKey('condition'),
                                            items: [
                                                {
                                                    xtype: 'textarea',
                                                    fieldLabel: false,
                                                    width: 600,
                                                    height: 400,
                                                    value: valueString
                                                }
                                            ]
                                        });
                                        win.show();
                                    });
                                }
                            }}
                    } else {
                        return null;
                    }
                }

            },
            {
                text: i18n.getKey('validExpression'),
                dataIndex: 'validExpression',
                tdCls: 'vertical-middle',
                width: 200,
                menuDisabled:true,
                sortable:false,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    if (!Ext.isEmpty(value)) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('validExpression') + '</a>',
                            listeners: {
                                render: function (display) {
                                    display.getEl().on("click", function () {
                                        var valueString = JSON.stringify(value, null, "\t");
                                        var win = Ext.create("Ext.window.Window", {
                                            modal: true,
                                            layout: 'fit',
                                            constrain:true,
                                            title: i18n.getKey('check') + i18n.getKey('validExpression'),
                                            items: [
                                                {
                                                    xtype: 'textarea',
                                                    fieldLabel: false,
                                                    width: 600,
                                                    height: 400,
                                                    value: valueString
                                                }
                                            ]
                                        });
                                        win.show();
                                    });
                                }
                            }}
                    } else {
                        return null;
                    }
                }
            }
        ];
        me.callParent(arguments);
    }
});