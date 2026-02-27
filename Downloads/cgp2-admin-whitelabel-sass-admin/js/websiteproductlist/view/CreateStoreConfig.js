/**
 * @author xiu
 * @date 2025/7/30
 */
/**
 * @author xiu
 * @date 2023/8/22
 */
//发货项
Ext.Loader.syncRequire([
    'CGP.orderitemsmultipleaddress.view.singleAddress.tool.splitBarTitle',
    'CGP.websiteproductlist.store.StoreConfigStore'
])
Ext.define('CGP.websiteproductlist.view.CreateStoreConfig', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.store_config',
    bodyStyle: 'border-top:0;border-color:white;',
    margin: '5 0 25 0',
    defaults: {},
    diySetValue: Ext.emptyFn,
    readOnly: false,
    order: null,
    settingId: null,
    initComponent: function () {
        const me = this,
            controller = Ext.create('CGP.websiteproductlist.controller.Controller'),
            store = Ext.create('CGP.websiteproductlist.store.StoreConfigStore', {
                settingId: me.settingId,
            }),
            title = '店铺配置',
            splitBarTitle = me.readOnly ? title + JSCreateFont('red', true, ' (只读)', 15) : title;

        me.items = [
            {
                xtype: 'splitBarTitle',
                title: splitBarTitle,
            },
            {
                xtype: 'container',
                width: '100%',
                margin: '10 0 5 5',
                itemId: 'container',
                layout: 'vbox',
                items: [
                    {
                        xtype: 'gridfieldwithcrudv2',
                        name: 'files',
                        itemId: 'files',
                        fieldLabel: i18n.getKey('店铺配置'),
                        width: '80%',
                        readOnly: me.readOnly,
                        minHeight: 100,
                        allowBlank: true,
                        valueSource: 'storeProxy',
                        gridConfig: {
                            autoScroll: true,
                            minHeight: 100,
                            maxHeight: 350,
                            store: store,
                            columns: [
                                {
                                    xtype: 'componentcolumn',
                                    text: i18n.getKey('店铺类型'),
                                    width: 220,
                                    dataIndex: 'platform',
                                    sortable: true,
                                    renderer: function (value, metadata, record) {
                                        var iconUrl = controller.getPlatFormIcon(value);
                                        
                                        return {
                                            xtype: 'fieldcontainer',
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle' // 垂直居中
                                            },
                                            width: '100%',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    icon: iconUrl,
                                                    tooltip: value,
                                                    width: 'auto',
                                                    margin: '0 5 0 0',
                                                    componentCls: "btnOnlyIcon",
                                                },
                                                {
                                                    xtype: 'displayfield',
                                                    value: JSCreateFont('#000', true, `${value} 店铺`),
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    text: i18n.getKey('产品简述'),
                                    dataIndex: 'value',
                                    flex: 1,
                                    sortable: false,
                                    renderer: function (value, metadata, record) {
                                        var {shortDesc} = value;
                                        metadata.tdAttr = 'data-qtip="' + shortDesc + '"';

                                        return JSAutoWordWrapStr(shortDesc);
                                    }
                                },
                                {
                                    text: i18n.getKey('产品描述'),
                                    dataIndex: 'value',
                                    flex: 1,
                                    sortable: false,
                                    renderer: function (value, metadata, record) {
                                        var {productDesc} = value;
                                        metadata.tdAttr = 'data-qtip="' + productDesc + '"';

                                        return JSAutoWordWrapStr(productDesc);
                                    }
                                },
                            ],
                            selModel: {
                                selType: 'checkboxmodel'
                            },
                            defaults: {
                                align: 'center',
                            },
                            editHandler: function (view, rowIndex, colIndex, icon, event, record) {
                                var grid = view.ownerCt,
                                    me = grid.ownerCt.ownerCt.ownerCt,
                                    page = me.ownerCt,
                                    id = record.get('_id'),
                                    defaultDetailSetting = page.getComponent('defaultDetailSetting'),
                                    defaultConfig = defaultDetailSetting.diyGetValue(),
                                    store = grid.store;

                                controller.createStoreConfigWin(record.data, defaultConfig, me.readOnly, me.settingId, function (result) {
                                    // 发送更新请求
                                    controller.upDataStoreConfigDataHandler(me.settingId, id, result, function () {
                                        store.load();
                                    })
                                })
                            },
                            deleteHandler: function (view, rowIndex, colIndex, icon, event, record) {
                                var id = record.get('_id'),
                                    grid = view.ownerCt;

                                controller.deleteStoreConfigDataHandler(me.settingId, id, function () {
                                    grid.store.load();
                                })
                            },
                            tbar: {
                                btnCreate: {
                                    width: 160,
                                    text: '添加店铺个性化配置',
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerCt,
                                            me = grid.ownerCt.ownerCt.ownerCt,
                                            page = me.ownerCt,
                                            defaultDetailSetting = page.getComponent('defaultDetailSetting'),
                                            defaultConfig = defaultDetailSetting.diyGetValue(),
                                            store = grid.store;

                                        controller.createStoreConfigWin(null, defaultConfig, me.readOnly, me.settingId, function (result) {
                                            // 发送新建请求
                                            controller.upDataStoreConfigDataHandler(me.settingId, null, result, function () {
                                                store.load();
                                            })
                                        })
                                    }
                                },
                                btnDelete: {
                                    hidden: false,
                                    disabled: false,
                                    width: 100,
                                    text: '批量删除',
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerCt,
                                            selRecord = grid.getSelectionModel().getSelection();

                                        if (selRecord.length) {
                                            Ext.Msg.confirm('提示', '确定删除？', function (selector) {
                                                if (selector === 'yes') {
                                                    selRecord.forEach(record => {
                                                        var id = record.get('_id'),
                                                            url = adminPath + `api/store-settings/${me.settingId}/platform-store-settings/${id}`;

                                                        controller.deleteQuery(url);
                                                    })
                                                    grid.store.load();
                                                }
                                            });
                                        } else {
                                            Ext.Msg.confirm('提示', '请至少选择一条数据!')
                                        }
                                    }
                                }
                            },
                            bbar: {
                                xtype: 'pagingtoolbar',
                                store: store,
                                displayInfo: true, // 是否 ? 示， 分 ? 信息
                            }
                        },
                        winConfig: {
                            formConfig: {
                                items: []
                            }
                        },
                    },
                ]
            },
        ];
        me.callParent();
    },
})