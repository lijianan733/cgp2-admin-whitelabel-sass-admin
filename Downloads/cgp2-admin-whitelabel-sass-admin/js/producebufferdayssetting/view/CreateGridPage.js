/**
 * @author xiu
 * @date 2025/9/26
 */
Ext.Loader.syncRequire([
    'CGP.producebufferdayssetting.controller.Controller',
    'CGP.producebufferdayssetting.store.ProduceBufferDaysSettingStore'
])
Ext.define('CGP.producebufferdayssetting.view.CreateGridPage', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.createGridPage',
    store: null,
    block: 'producebufferdayssetting',
    editPage: 'edit.html',
    i18nblock: i18n.getKey('producebufferdayssetting'),
    // 刷新数据
    loadPageFn: function (store, callBack) {
        var controller = Ext.create('CGP.producebufferdayssetting.controller.Controller'),
            queryData = controller.getProduceBufferDaysSettingData();

        JSSetLoading(true);
        setTimeout(item => {
            store.proxy.data = queryData?.table || [];
            store.load();
            callBack && callBack();
            JSSetLoading(false);
        }, 1000)
    },
    // 更新数据
    upDataStoreFn: function (store, configId, callBack) {
        var controller = this,
            url = adminPath + `api/produceBufferDaysSetting/${configId}`,
            result = {
                _id: configId,
                clazz: "com.qpp.cgp.domain.produce.ProduceBufferDaysSetting",
                description: '',
                table: store.proxy.data
            }

        JSAsyncEditQuery(url, result, true, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText),
                    data = responseText?.data;
                
                if (responseText.success) {
                    controller.loadPageFn(store, function () {
                        callBack && callBack(data);
                    });
                } else {
                    var errorCode = data?.code;

                    controller.loadPageFn(store);
                    
                    if (errorCode === 300622){  
                        Ext.Msg.alert('提示','项数区间必须为连续区间!');
                    }
                }
            }
        }, true)
    },
    // 删除数据
    deleteDataStoreFn: function (store, ids, configId, callBack) {
        var controller = this,
            storeData = store.proxy.data,
            filterData = storeData.filter(item => {
                var itemId = item['id'];

                return !ids.includes(itemId);
            })

        store.proxy.data = filterData;
        store.load();
        controller.upDataStoreFn(store, configId, callBack);
    },
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.producebufferdayssetting.controller.Controller'),
            defaults = Ext.create('CGP.producebufferdayssetting.defaults.ProduceBufferDaysSettingDefaults'),
            queryData = controller.getProduceBufferDaysSettingData(),
            {config, test} = defaults,
            {id} = config,
            configId = queryData?._id,
            store = Ext.create('CGP.producebufferdayssetting.store.ProduceBufferDaysSettingStore', {
                data: queryData?.table || []
            });


        me.config = {
            block: me.block,
            tbarCfg: {
                hiddenButtons: ['export', 'import'],
                btnCreate: {
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt,
                            store = grid.store;

                        controller.createProduceBufferDaysSettingFormWindow(null, store, function (data) {
                            store.proxy.data.push(data);
                            store.load();
                            me.upDataStoreFn(store, configId, function () {
                                Ext.Msg.alert('提示', '添加成功!');
                            });
                        });
                    }
                },
                btnConfig: {
                    disabled: false,
                    hidden: true,
                    text: i18n.getKey('描述'),
                    handler: function () {
                        controller.createSystemDefaultProductDaysConfigFormWindow();
                    }
                },
                btnHelp: {
                    disabled: false,
                    text: '',
                    componentCls: "btnOnlyIcon",
                    tooltip: "当订单中存在多个订单项时,<br>其订单的生产天数最大值在该 '订单项项数区间' 的范围内时,<br>便会在该订单的原生产天数的基础上添加对应的 '生产天数区间' 作为多订单项生产的缓冲天数。<br><br>" +
                        "(因为当存在多订单项时订单的基础生产天数是取订单项中的最大生产天数,这种情况是将所有订单项默认同时生产,但是在实际情况中并不能保证所有订单项可以同时生产,继而添加生产缓冲天数的概念!)",
                    handler: function () {

                    }
                },
                btnDelete: {
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt,
                            selected = grid.getSelectionModel().getSelection(),
                            ids = selected.map(item => {
                                return item['internalId'];
                            }),
                            store = grid.store;

                        if (ids?.length) {
                            Ext.Msg.confirm('提示', '是否删除选中数据!', function (select) {
                                if (select === 'yes') {
                                    me.deleteDataStoreFn(store, ids, configId, function () {
                                        Ext.Msg.alert('提示', '删除成功!');
                                    })
                                }
                            })
                        } else {
                            Ext.Msg.alert('提示', '请选择您需要删除的数据!');
                        }
                    }
                }
            },
            gridCfg: {
                store: store,
                editActionHandler: function (view, rowIndex, colIndex, obj, event, record, dom) {
                    var grid = view.ownerCt,
                        store = grid.store;

                    controller.createProduceBufferDaysSettingFormWindow(record.data, store, function (data) {
                        var dataId = data['id'];

                        store.proxy.data.forEach((item, index) => {
                            if (item['id'] === dataId) {
                                store.proxy.data[index] = data;
                            }
                        })

                        store.load();
                        me.upDataStoreFn(store, configId, function () {
                            Ext.Msg.alert('提示', '修改成功!');
                        });
                    });
                },
                deleteActionHandler: function (view, rowIndex, colIndex, obj, event, record, dom) {
                    var grid = view.ownerCt,
                        store = grid.store,
                        id = record.get('id')

                    Ext.Msg.confirm('提示', '是否删除该数据!', function (select) {
                        if (select === 'yes') {
                            me.deleteDataStoreFn(store, [id], configId, function () {
                                Ext.Msg.alert('提示', '删除成功!');
                            })
                        }
                    })
                },
                columns: [
                    {
                        text: i18n.getKey('订单项项数区间'),
                        width: 400,
                        dataIndex: 'qtySpace',
                        sortable: true
                    },
                    {
                        text: i18n.getKey('生产天数区间'),
                        flex: 1,
                        dataIndex: 'daySpace',
                        sortable: true
                    },
                ],
                pagingBar: false,
                dockedItems: [
                    {
                        xtype: 'pagingtoolbar',
                        store: store, // same store GridPanel is using
                        dock: 'bottom',
                        displayInfo: true,
                        height: 40,
                        inputItemWidth: 45,
                        width: 500,
                        doRefresh: function () {
                            var queryData = controller.getProduceBufferDaysSettingData();

                            JSSetLoading(true);
                            setTimeout(() => {
                                JSSetLoading(false);
                                store.proxy.data = queryData?.table;
                                store.load();
                            }, 1000);
                        },
                    }
                ]
            },
            filterCfg: {
                hidden: true,
                items: [
                    {
                        xtype: 'numberfield',
                        name: '_id',
                        itemId: '_id',
                        hideTrigger: true,
                        isLike: false,
                        fieldLabel: i18n.getKey('id'),
                    },
                ]
            }
        }
        me.callParent();
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
})