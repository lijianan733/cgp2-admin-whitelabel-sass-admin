/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.splitBarTitle',
    'CGP.customerordermanagement.view.CreateQpsonOrderTotalComp',
    'CGP.customerordermanagement.store.QpsonOrderItemStore',
])
//发货信息
Ext.define('CGP.customerordermanagement.view.CreateShippingContainerComp', {
    extend: 'Ext.form.Panel',
    alias: 'widget.shipping_container',
    bodyStyle: 'border-top:0;border-color:white;',
    defaults: {
        labelAlign: 'left', margin: '0 0 3 6',
    },
    margin: '5 0 20 0',
    width: '100%',
    layout: {
        type: 'vbox'
    },
    getContainerComp: function () {
        var me = this;
        return me.getComponent('uxfieldcontainer');
    },
    diySetValue: function (data) {
        var me = this, items = me.items.items, result = {};

        items.forEach(item => {
            // item.diySetValue ? item.diySetValue(data) : item.setValue(data);
        })
    },
    initComponent: function () {
        const me = this,
            customerOrderId = JSGetQueryString('customerOrderId'),
            controller = Ext.create('CGP.customerordermanagement.controller.Controller'),
            {config, test} = Ext.create('CGP.customerordermanagement.defaults.CustomerordermanagementDefaults'),
            {qpson_order_item} = config,
            {columnsText, filtersText} = qpson_order_item,
            columns = controller.getColumnsType(columnsText),
            filters = controller.getFiltersType(filtersText)

        me.items = [
            {
                xtype: 'splitBarTitle',
                title: '多地址订单',
                itemId: 'splitBarTitle',
                btnSetContainerHideId: 'uxfieldcontainer',
                addButton: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('展开所有'),
                        iconCls: 'icon_expandAll',
                        isExpandAll: true,
                        itemId: 'expandAll',
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt,
                                text = btn.isExpandAll ? '折叠所有' : '展开所有',
                                executionText = btn.isExpandAll ? '正在展开' : '正在折叠',
                                iconCls = btn.isExpandAll ? 'icon_collapseAll' : 'icon_expandAll',
                                uxfieldcontainer = form.getComponent('uxfieldcontainer'),
                                items = uxfieldcontainer.items.items,
                                completed = 0; // 计数器

                            btn.setDisabled(true);
                            items.forEach((item, index) => {
                                setTimeout(() => {
                                    item.setExpanded(btn.isExpandAll);
                                    completed++; // 每次完成一个项，计数加一
                                    btn.setText(`${executionText} ${index + 1}/${items.length}`);

                                    // 检查是否所有项都已完成
                                    if (completed === items.length) {
                                        btn.isExpandAll = !btn.isExpandAll; // 所有项完成后再切换状态
                                        btn.setIconCls(iconCls); // 设置图标
                                        btn.setText(text); // 设置文本
                                        btn.setDisabled(false);
                                    }
                                }, index * 300);
                            });
                        }
                    }
                ]
            },
            {
                xtype: 'uxfieldcontainer',
                itemId: 'uxfieldcontainer',
                width: '100%',
                margin: '5 0 5 20',
                layout: 'vbox',
                defaultType: 'displayfield',
                autoScroll: true,
                diySetValue: function (data) {
                    var me = this;
                    me.setComponentItem(data);
                },
                setComponentItem: function (arr) {
                    var me = this,
                        compArrs = [],
                        form = me.ownerCt,
                        splitBarTitle = form.getComponent('splitBarTitle'),
                        expandAllBtn = splitBarTitle.getComponent('expandAll');

                    if (arr) {
                        arr.forEach(function (data, index) {
                            var {shipmentRequirementId} = data,
                                qpsonOrderItemStore = Ext.create('CGP.customerordermanagement.store.QpsonOrderItemStore', {
                                    customerOrderId: customerOrderId,
                                    shipmentRequirementId: shipmentRequirementId
                                });

                            compArrs.push({
                                xtype: 'uxfieldset',
                                layout: 'vbox',
                                defaults: {
                                    labelWidth: 100,
                                    width: '100%',
                                    margin: '5 25',
                                },
                                title: index + 1,
                                margin: '20 5',
                                width: '90%',
                                minWidth: 600,
                                itemId: JSGetUUID() + `_` + index,
                                collapsible: true,
                                collapsed: index !== 0, //默认展开第一个
                                diySetValue: function (data) {
                                    if (data) {
                                        var me = this, items = me.items.items
                                        items.forEach(item => {
                                            var name = item['name'];
                                            if (name) {
                                                item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                                                item.setVisible(!!data[name]);
                                            }
                                        })
                                    }
                                },
                                items: [
                                    {
                                        xtype: 'displayfield',
                                        name: 'billingAddressValue',
                                        itemId: 'billingAddressValue',
                                        fieldLabel: i18n.getKey('账单地址'),
                                    },
                                    {
                                        xtype: 'displayfield',
                                        name: 'deliveryAddressValue',
                                        itemId: 'deliveryAddressValue',
                                        fieldLabel: i18n.getKey('收件人地址'),
                                    },
                                    {
                                        xtype: 'displayfield',
                                        name: 'shippingMethod',
                                        itemId: 'shippingMethod',
                                        fieldLabel: i18n.getKey('配送方式'),
                                    },
                                    {
                                        xtype: 'splitBarTitle',
                                        title: '店铺订单项列表',
                                        margin: 5,
                                        btnSetContainerHideId: 'items',
                                        addButton: [
                                            {
                                                xtype: 'button',
                                                iconCls: 'icon_expandAll',
                                                text: '切换全屏',
                                                handler: function (btn) {
                                                    var fieldset = btn.ownerCt.ownerCt,
                                                        grid = fieldset.getComponent('items')
                                                    JSCreateToggleFullscreenWindowGrid('订单项列表', grid);
                                                }
                                            }
                                        ],
                                    },
                                    {
                                        xtype: 'grid',
                                        width: '100%',
                                        name: 'items',
                                        itemId: 'items',
                                        margin: '5 5 10 5',
                                        maxHeight: 500,
                                        autoScroll: true,
                                        diySetValue: function (data) {
                                            var me = this,
                                                store = me.store;

                                           /* store.proxy.data = data || [];
                                            store.load();*/
                                        },
                                        store: qpsonOrderItemStore,
                                        columns: Ext.Array.merge([
                                            {
                                                xtype: 'rownumberer',
                                                tdCls: 'vertical-middle',
                                                align: 'center',
                                                width: 60
                                            }
                                        ], columns || []),
                                        bbar: {
                                            xtype: 'pagingtoolbar',
                                            store: qpsonOrderItemStore,
                                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                            emptyText: i18n.getKey('noDat')
                                        }
                                    },
                                ],
                                listeners: {
                                    afterrender: function (comp) {
                                        comp.diySetValue(data);
                                    }
                                }
                            }) 
                        })
                    }

                    me.add(compArrs);
                    expandAllBtn.handler(expandAllBtn);
                },
                items: [],
                listeners: {
                    afterrender: function (comp) {
                        controller.getQPSONCustomerOrderInfoV2(customerOrderId, function (recode) {
                            comp.diySetValue(recode);
                        })
                    }
                }
            },
        ];
        me.callParent();
    },
})