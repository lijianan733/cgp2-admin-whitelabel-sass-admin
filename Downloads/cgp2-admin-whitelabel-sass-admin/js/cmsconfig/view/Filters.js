/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.define('CGP.cmsconfig.view.Filters', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.filters',
    viewConfig: {
        markDirty: false,
    },
    categoryProductInfoStore: null,
    title: i18n.getKey('产品筛选'),
    store: {
        xtype: 'store',
        fields: [
            {
                name: 'name',
                type: 'string'
            },
            {
                name: 'attributes',
                type: 'array'
            }, {
                name: 'options',
                type: 'array'
            }
        ],
        data: []
    },
    tbar: [
        {
            xtype: 'splitbutton',
            iconCls: 'icon_add',
            text: i18n.getKey('add'),
            menu: [
                {
                    text: '根据属性筛选',
                    handler: function (btn) {
                        var filterPanel = btn.ownerCt.ownerButton.ownerCt.ownerCt;
                        var tab = filterPanel.ownerCt;
                        var win = tab.getComponent('EditFilterWin');
                        if (win) {
                            filterPanel.ownerCt.setActiveTab(win);
                        } else {
                            win = Ext.create('CGP.cmsconfig.view.EditFilterWin', {
                                outGrid: filterPanel,
                                record: null,
                                categoryProductInfoStore: filterPanel.categoryProductInfoStore
                            });
                            filterPanel.ownerCt.add(win);
                        }
                        filterPanel.ownerCt.setActiveTab(win);
                    }
                },
                {
                    text: '指定产品筛选',
                    handler: function (btn) {
                        var filterPanel = btn.ownerCt.ownerButton.ownerCt.ownerCt;
                        var tab = filterPanel.ownerCt;
                        var win = tab.getComponent('EditProductFilterWin');
                        if (win) {
                            filterPanel.ownerCt.setActiveTab(win);
                        } else {
                            win = Ext.create('CGP.cmsconfig.view.EditProductFilterWin', {
                                outGrid: filterPanel,
                                record: null,
                                categoryProductInfoStore: filterPanel.categoryProductInfoStore
                            });
                            filterPanel.ownerCt.add(win);
                        }
                        filterPanel.ownerCt.setActiveTab(win);
                    }
                }
            ],

        }
    ],
    optionalProductInfoStore: null,//可选产品信息
    columns: [
        {
            xtype: 'actioncolumn',
            width: 50,
            items: [
                {
                    iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                    tooltip: 'Edit',
                    handler: function (gridView, rowIndex, colIndex, a, b, record) {
                        var filterPanel = gridView.ownerCt;
                        var options = record.get('options');
                        if (options[0].relationOptions) {
                            var win = Ext.create('CGP.cmsconfig.view.EditFilterWin', {
                                outGrid: filterPanel,
                                record: record,
                                categoryProductInfoStore: filterPanel.categoryProductInfoStore
                            });
                        } else {
                            var win = Ext.create('CGP.cmsconfig.view.EditProductFilterWin', {
                                outGrid: filterPanel,
                                record: record,
                                categoryProductInfoStore: filterPanel.categoryProductInfoStore
                            });
                        }

                        filterPanel.ownerCt.add(win);
                        filterPanel.ownerCt.setActiveTab(win);
                    }
                },
                {
                    iconCls: 'icon_remove icon_margin',
                    tooltip: 'Delete',
                    handler: function (view, rowIndex, colIndex, a, b, record) {
                        var store = view.getStore();
                        var constraintId = record.getId();
                        Ext.Msg.confirm('提示', '确定删除？', callback);

                        function callback(id) {
                            if (id === 'yes') {
                                store.remove(record);
                            }
                        }
                    }
                }
            ]
        },
        {

            text: i18n.getKey('过滤参数名'),
            dataIndex: 'name',
            width: 350,
        },
        {
            text: i18n.getKey('过滤参数选项'),
            dataIndex: 'options',
            xtype: 'arraycolumn',
            flex: 1,
            valueField: 'name',
        },
        {
            text: i18n.getKey('type'),
            dataIndex: 'options',
            flex: 1,
            renderer: function (value) {
                if (value[0].relationOptions) {
                    return '根据属性筛选'
                } else {
                    return '根据产品筛选'
                }
            }
        }
    ],
    isValid: function () {
        return true;
    },
    diyGetValue: function () {
        var me = this;
        var result = [];
        for (var i = 0; i < me.store.getCount(); i++) {
            var record = me.store.data.items[i]
            result.push(record.getData());
        }
        return {
            filters: result
        };
    },
    diySetValue: function (data) {
        var me = this;
        var result = [];
        me.store.proxy.data = data.filters || [];
        me.store.load();
    },
    initComponent: function () {
        var me = this;
        me.callParent();
    }
})