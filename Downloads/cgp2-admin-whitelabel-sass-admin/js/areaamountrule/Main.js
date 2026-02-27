/**
 * Created by nan on 2021/10/21.
 * 区域价格规则
 */
Ext.syncRequire([]);
Ext.onReady(function () {
    var store = Ext.create('CGP.areaamountrule.store.AreaAmountRuleStore', {});
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('areaAmountRule'),
        block: 'areaamountrule',
        editPage: 'edit.html',
        tbarCfg: {
            hiddenButtons: [],//按钮的名称
            disabledButtons: ['config']//按钮的名称
        },
        gridCfg: {
            store: store,
            frame: false,
            editAction: true,//是否启用edit的按钮
            deleteAction: true,//是否启用delete的按钮
            columnDefaults: {
                width: 200
            },
            columns: [
                {
                    dataIndex: '_id',
                    text: i18n.getKey('id'),
                    width: 100
                },
                {
                    dataIndex: 'name',
                    text: i18n.getKey('name')
                },
                {
                    dataIndex: 'description',
                    text: i18n.getKey('description')
                },
                {
                    dataIndex: 'areaAdjustAmounts',
                    text: i18n.getKey('areaAmountRule'),
                    xtype: 'componentcolumn',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" style="text-decoration: none")>查看</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        var configStore = {
                                            xtype: 'store',
                                            fields: [
                                                {
                                                    name: 'ratioOrLiteral',
                                                    type: 'boolean'
                                                },
                                                {
                                                    name: 'value',
                                                    type: 'string'
                                                },
                                                {
                                                    name: 'area',
                                                    type: 'object'
                                                }],
                                            data: value
                                        }
                                        var win = Ext.create('Ext.window.Window', {
                                            modal: true,
                                            constrain: true,
                                            title: i18n.getKey('areaAmountRule'),
                                            width: 500,
                                            height: 500,
                                            layout: 'fit',
                                            items: [
                                                {
                                                    xtype: 'grid',
                                                    store: configStore,
                                                    columns: [
                                                        {
                                                            dataIndex: 'area',
                                                            width: 220,
                                                            text: i18n.getKey('area'),
                                                            renderer: function (value, mateData, record) {
                                                                return value.country.name + ' ' + (value.state ? value.state.name : "") + ' ' + (value.city ? value.city : '');
                                                            }
                                                        },
                                                        {
                                                            dataIndex: 'price',
                                                            flex: 1,
                                                            text: i18n.getKey('price'),
                                                            renderer: function (value, mateData, record) {
                                                                var value = record.get('value');
                                                                var ratioOrLiteral = record.get('ratioOrLiteral');
                                                                var data = [];
                                                                if (!ratioOrLiteral) {
                                                                    data = [
                                                                        {
                                                                            title: i18n.getKey('type'),
                                                                            value: '指定价格'
                                                                        },
                                                                        {
                                                                            title: i18n.getKey('price'),
                                                                            value: value
                                                                        }
                                                                    ]
                                                                } else {
                                                                    data = [
                                                                        {
                                                                            title: i18n.getKey('type'),
                                                                            value: '原价倍率'
                                                                        },
                                                                        {
                                                                            title: i18n.getKey('倍率'),
                                                                            value: value
                                                                        }
                                                                    ]
                                                                }
                                                                return JSCreateHTMLTable(data)
                                                            }
                                                        }
                                                    ],
                                                    bbar: {
                                                        xtype: 'pagingtoolbar',
                                                        store: configStore
                                                    }
                                                }
                                            ]
                                        });
                                        win.show();
                                    });
                                }
                            }
                        };
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    itemId: '_id',
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    isLike: false
                },
                {
                    itemId: 'name',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name')
                },
                {
                    itemId: 'description',
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description')
                },
            ]
        }
    });
})
