/**
 * Created by nan on 2018/1/8.
 */
Ext.define('CGP.product.view.managerskuattribute.view.ManagerSkuAttrConstraint', {
    extend: 'Ext.grid.Panel',
    id: 'managerSkuAttriConstraint',
    closable: true,
    autoScroll: true,
    viewConfig: {
        enableTextSelection: true//设置grid中的文本可以选择
    },
    configurableId: null,
    initComponent: function () {
        var me = this;

        var inputTypeClazz = (Ext.Array.contains(['DropList', 'CheckBox', 'RadioButtons', 'Color'], me.inputType)) ? 'com.qpp.cgp.domain.product.attribute.constraint2.single.DiscreteValueConstraint' : 'com.qpp.cgp.domain.product.attribute.constraint2.single.ContinuousValueConstraint';
        me.title = i18n.getKey('managerSkuAttriConstraint') + '(' + me.skuAttributeId + ')';
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('add'),
                iconCls: 'icon_create',
                handler: function () {
                    //新的store
                    var newStore = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainter.store.SkuAttributeConstraintStore', {
                        skuAttributeId: me.skuAttributeId
                    });
                    newStore.load(function () {
                        me.controller.selectConstraintType(me.skuAttributeId, newStore, '', me.tabPanel, 'create', me.inputType, '', me.configurableId);
                    });
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('refresh'),
                iconCls: 'icon_reset',
                handler: function (button) {
                    var lm = me.setLoading();
                    me.store.load(function () {
                        lm.hide();
                    });
                }
            }
        ];
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
                        handler: function (view, rowIndex, colIndex) {
                            var recordId = me.store.getAt(rowIndex).get('_id');
                            me.controller.selectConstraintType(me.skuAttributeId, me.store, recordId, me.tabPanel, 'edit', me.inputType, me.store.getAt(rowIndex).data, me.configurableId);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actionremove',
                        tooltip: 'Remove',
                        handler: function (view, rowIndex, colIndex) {
                            var recordId = me.store.getAt(rowIndex).get('_id');
                            Ext.Msg.confirm('提示', '确定删除？', callback);

                            function callback(id) {
                                if (id === 'yes') {
                                    Ext.Ajax.request({
                                        url: adminPath + 'api/skuAttributeConstraints/v2/' + recordId,
                                        method: 'DELETE',
                                        headers: {
                                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                        },
                                        success: function (response) {
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            if (responseMessage.success) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                                                me.store.reload();
                                            } else {
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                            }
                                        },
                                        failure: function (response) {
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                        }
                                    });
                                }
                            }

                        }
                    }

                ]
            },
            {
                text: i18n.getKey('id'),
                dataIndex: '_id',
                tdCls: 'vertical-middle'

            },
            {
                text: i18n.getKey('type'),
                dataIndex: 'clazz',
                tdCls: 'vertical-middle',
                width: 200,
                renderer: function (value) {
                    return i18n.getKey('single') + i18n.getKey(value.substring(value.lastIndexOf('.') + 1, value.length));
                }

            },
            {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                tdCls: 'vertical-middle',
                width: 200

            },
            {
                text: i18n.getKey('condition'),
                dataIndex: 'conditions',
                tdCls: 'vertical-middle',
                xtype: 'componentcolumn',
                hidden: !(inputTypeClazz == 'com.qpp.cgp.domain.product.attribute.constraint2.single.ContinuousValueConstraint'),
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
                            }
                        }
                    } else {
                        return null;
                    }
                }

            },
            {
                text: i18n.getKey('validateExpression'),
                dataIndex: 'validateExpression',
                tdCls: 'vertical-middle',
                width: 200,
                xtype: 'componentcolumn',
                hidden: !(inputTypeClazz == 'com.qpp.cgp.domain.product.attribute.constraint2.single.ContinuousValueConstraint'),
                renderer: function (value, metadata, record) {
                    if (!Ext.isEmpty(value)) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('validateExpression') + '</a>',
                            listeners: {
                                render: function (display) {
                                    display.getEl().on("click", function () {
                                        var valueString = JSON.stringify(value, null, "\t");
                                        var win = Ext.create("Ext.window.Window", {
                                            modal: true,
                                            layout: 'fit',
                                            title: i18n.getKey('check') + i18n.getKey('validateExpression'),
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
                            }
                        }
                    } else {
                        return null;
                    }
                }

            },
            {
                text: i18n.getKey('items'),
                dataIndex: 'items',
                tdCls: 'vertical-middle',
                width: 200,
                hidden: !(inputTypeClazz == 'com.qpp.cgp.domain.product.attribute.constraint2.single.DiscreteValueConstraint'),
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    if (!Ext.isEmpty(value)) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('items') + '</a>',
                            listeners: {
                                render: function (display) {
                                    display.getEl().on("click", function () {
                                        var valueString = JSON.stringify(value, null, "\t");
                                        var win = Ext.create("Ext.window.Window", {
                                            modal: true,
                                            layout: 'fit',
                                            title: i18n.getKey('check') + i18n.getKey('items'),
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
                            }
                        }
                    } else {
                        return null;
                    }
                }
            }
        ];
        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: me.store,   // GridPanel中使用的数据
                dock: 'bottom',    //摆放的位置
                displayInfo: true   //是否显示分页信息
            }
        ];
        me.callParent(arguments);

        me.on('afterrender', function () {
            var page = this;
            var productId = page.configurableId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    }
});
