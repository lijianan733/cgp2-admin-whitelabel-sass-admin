/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.define('CGP.customerordermanagement.view.CreateGridPage', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.createGridPage',
    block: 'customerordermanagement',
    editPage: 'edit.html',
    i18nblock: i18n.getKey('customerordermanagement'),
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.customerordermanagement.controller.Controller'),
            {config, test} = Ext.create('CGP.customerordermanagement.defaults.CustomerordermanagementDefaults'),
            {customer_order_management} = config,
            {columnsText, filtersText} = customer_order_management,
            columns = controller.getColumnsType(columnsText),
            filters = controller.getFiltersType(filtersText),
            store = Ext.create('CGP.customerordermanagement.store.CustomerordermanagementStore', {});

        me.config = {
            block: me.block,
            tbarCfg: {
                hiddenButtons: ['create', 'help', 'export', 'import'],
                btnDelete: {
                    handler: function (btn) {
                        var queryGrid = btn.ownerCt.ownerCt.ownerCt,
                            grid = queryGrid.grid,
                            ids = grid.selectedRecords.keys;

                        if (ids.length) {
                            console.log(ids);
                            Ext.Msg.confirm(i18n.getKey('prompt'), '是否取消选中订单!', function (select) {
                                if (select === 'yes') {
                                    ids.forEach(item => {
                                        controller.deleteCustomerOrderFn(item);
                                    })
                                    grid.store.load();
                                }
                            })
                        }else {
                            JSShowNotification({
                                type: 'info',
                                title: '请选择需要删除的订单!',
                            });
                        }
                    }
                },
                btnConfig: {
                    disabled: false,
                    text: i18n.getKey('取消'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        var queryGrid = btn.ownerCt.ownerCt.ownerCt,
                            grid = queryGrid.grid,
                            cancelOrderIds = grid.selectedRecords.items.filter(item=>{ //过滤掉不可取消订单
                                var storeRetailOrderStatus = item.get('storeRetailOrderStatus'),
                                 storeInfo = item.get('storeInfo'),
                                    platformCode = storeInfo?.platformCode;
                                    
                                return storeRetailOrderStatus.name !== 'cancelled' && platformCode === 'PopUp' 
                            }),
                            ids = cancelOrderIds.map(item=>{
                                return item.get('_id');
                            });

                        if (ids.length) {
                            Ext.Msg.confirm(i18n.getKey('prompt'), '是否取消选中订单!<br>(将过滤不可取消订单)', function (select) {
                                if (select === 'yes') {
                                    ids.forEach(item => {
                                        controller.cancelCustomerOrderFn(item);
                                    })
                                    grid.store.load();
                                }
                            })
                        }else{
                            JSShowNotification({
                                type: 'info',
                                title: '请选择可取消的订单!',
                            });
                        }
                    }
                }
            },
            filterCfg: {
                items: filters
            },
            gridCfg: {
                store: store,
                // editActionHandler: function (grid, rowIndex, colIndex) {},
                editAction: false,
                deleteAction: false,
                columns: columns
            },
        }
        me.callParent();
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
})