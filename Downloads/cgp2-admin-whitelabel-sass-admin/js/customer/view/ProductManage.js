/**
 * ProductManage
 * @Author: miao
 * @Date: 2022/3/12
 */
/**
 * Created by nan on 2017/12/11.
 * 自定义的弹窗使用的grid
 */
Ext.define("CGP.customer.view.ProductManage", {
    extend: "CGP.common.commoncomp.QueryGrid",
    alias: 'widget.productmanage',

    initComponent: function () {
        var me = this;
        var email = JSGetQueryString('email');
        var controller = Ext.create('CGP.customer.controller.Customer');
        var store = Ext.create('CGP.customer.store.Product', {
            email: email
        });
        var loginUser=Ext.JSON.decode(Ext.util.Cookies.get("user"));

        me.gridCfg = {
            autoScroll: true,
            editAction: false,//是否启用edit的按钮
            deleteAction: false,//是否启用delete的按钮
            store: store,
            selType: 'checkboxmodel',

            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_create',
                    hidden:loginUser?.email==email,
                    handler: function () {
                        var store = this.ownerCt.ownerCt.getStore();
                        controller.addProductWindow(email, store)
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('delete'),
                    iconCls: 'icon_delete',
                    handler: function (btn) {
                        var productIds = [];
                        var selectedRec = me.grid.getSelectionModel().getSelection();
                        if (selectedRec.length > 0) {
                            selectedRec.forEach(function (item){
                                productIds.push(item.get('id'));
                            })
                            controller.deleteUserProduct(email, productIds, store);
                        }
                        else {
                            Ext.Msg.alert(i18n.getKey('prompt'), '请先选择要删除的产品');
                        }
                    }
                }
            ],
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
                    dataIndex: 'name',
                    renderer: function (value, metadata, record, index, count, store) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('sku'),
                    width: 200,
                    dataIndex: 'sku',
                    renderer: function (value, metadata, record, index, count, store) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('model'),
                    dataIndex: 'model',
                    width: 200,
                    itemId: 'model',
                    renderer: function (value, metadata, record, index, count, store) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'type',
                    width: 150,
                    itemId: 'type'
                }
            ]
        };
        me.filterCfg = {
            width: '100%',
            minHeight: 100,
            layout: {
                type: 'table',
                columns: 3
            },
            header: false,
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('product') + i18n.getKey('id'),
                    itemId: 'productId',
                    minValue: 1,
                    allowDecimals: false,
                    allowExponential: false,
                    hideTrigger: true
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'sku',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('sku'),
                    itemId: 'sku'
                },
                {
                    name: 'model',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('model'),
                    itemId: 'model'
                },
                {
                    name: 'type',
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'type',
                    xtype: 'combo',
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: 'Sku', value: 'SKU'
                            },
                            {
                                type: 'Configurable', value: 'Configurable'
                            }
                        ]
                    }),
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'

                },
            ]
        };
        me.callParent(arguments);
    }
});