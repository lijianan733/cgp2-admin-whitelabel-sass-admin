Ext.syncRequire(['CGP.costenterconfig.method.method'])

Ext.onReady(function () {
    var method = Ext.create('CGP.costenterconfig.method.method');
    var store = Ext.create('CGP.costenterconfig.store.processCostConfigStore');
    var character = JSGetQueryString('character');

    Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('costEnterConfig'),
        block: 'costenterconfig',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function () {
                    JSOpen({
                        id: 'costenterconfig' + '_edit',
                        url: path + "partials/" + 'costenterconfig' + "/" + 'edit.html' + '?character=' + character,
                        title: i18n.getKey('create') + '_' + i18n.getKey('costEnterConfig'),
                        refresh: true
                    });
                }
            },
        },
        gridCfg: {
            store: store,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 150,
                    renderer: function () {
                        return i18n.getKey(character)
                    }
                },
                {
                    xtype: 'componentcolumn',
                    text: i18n.getKey('accountingConfig'),
                    dataIndex: 'value',
                    flex: 1,
                    minWidth: 240,
                    renderer: function (value) {
                        var result = [];
                        var unitCost = value.unitCost;
                        var newData = value.detailWorkingHours;
                        var averageWorkingHours = value.averageWorkingHours;
                        var detailWorkingHoursValue = i18n.getKey('without');
                        if (newData) {
                            if (newData.length > 0) {
                                detailWorkingHoursValue = '<a href="#">' + i18n.getKey('check') + '</a>'
                            }
                        }
                        result.push(
                            {
                                title: i18n.getKey('unitCost'),
                                value: unitCost
                            },
                            {
                                title: i18n.getKey('averageWorkingHours'),
                                value: averageWorkingHours
                            },
                        );
                        return {
                            xtype: 'displayfield',
                            value: JSCreateHTMLTable(result) + i18n.getKey('detailWorkingHours') + ': ' + detailWorkingHoursValue,
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    if (a) {
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            if (newData.length > 0) {
                                                var win = Ext.create('Ext.window.Window', {
                                                    title: i18n.getKey('checkInfo'),
                                                    modal: true,
                                                    height: 400,
                                                    width: 500,
                                                    layout: 'fit',
                                                    items: [
                                                        {
                                                            xtype: 'grid',
                                                            name: 'rule',
                                                            itemId: 'rule',
                                                            layout: 'fit',
                                                            store: Ext.create('Ext.data.Store', {
                                                                fields: [
                                                                    {
                                                                        type: 'number',
                                                                        name: 'date'
                                                                    },
                                                                    {
                                                                        type: 'number',
                                                                        name: 'value'
                                                                    }
                                                                ],
                                                                proxy: {
                                                                    type: 'memory'
                                                                },
                                                                data: newData
                                                            }),
                                                            bbar: ['->',
                                                                {
                                                                    xtype: 'button',
                                                                    iconCls: 'icon_agree',
                                                                    text: i18n.getKey('ok'),
                                                                    handler: function () {
                                                                        win.close();
                                                                    }
                                                                }],
                                                            columns: [
                                                                {
                                                                    xtype: 'rownumberer'
                                                                },
                                                                {
                                                                    dataIndex: 'date',
                                                                    text: i18n.getKey('date'),
                                                                    flex: 1,
                                                                    renderer: function (value) {
                                                                        return method.TimestampToTime(value, 'SHOW');
                                                                    }
                                                                },
                                                                {
                                                                    dataIndex: 'value',
                                                                    text: i18n.getKey('manHour'),
                                                                    flex: 1,
                                                                }
                                                            ],
                                                        }
                                                    ],
                                                })
                                                win.show();
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    },
                },
                {
                    text: i18n.getKey('effectiveTime'),
                    dataIndex: 'effectiveDuration',
                    flex: 1,
                    minWidth: 240,
                    renderer: function (value) {
                        var result = [];
                        var startTime = value.startTime;
                        var endTime = value.endTime;
                        var newStartTime = method.TimestampToTime(startTime, 'SHOW');
                        var newEndTime = method.TimestampToTime(endTime, 'SHOW');
                        result.push(
                            {
                                title: i18n.getKey('startTime'),
                                value: newStartTime
                            },
                            {
                                title: i18n.getKey('endTime'),
                                value: newEndTime
                            }
                        )
                        return JSCreateHTMLTable(result);
                    }
                },
                {
                    text: i18n.getKey('processCharacter'),
                    dataIndex: 'processcharacter',
                    flex: 2,
                },
            ],
        },
        filterCfg: {
            height: 80,
            defaults: {
                width: 350,
            },
            items: [
                {
                    xtype: 'numberfield',
                    name: '_id',
                    itemId: '_id',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                },
                {
                    xtype: 'combo',
                    name: 'name',
                    itemId: 'name',
                    fieldLabel: i18n.getKey('name'),
                    displayField: 'value',
                    valueField: 'key',
                    hidden: true,
                    value: character,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'key'],
                        data: [
                            {
                                value: 'laborCost',
                                key: 'laborCost'
                            },
                            {
                                value: 'overhead',
                                key: 'overhead'
                            },
                            {
                                value: 'dpctOfMcn',
                                key: 'dpctOfMcn'
                            }
                        ]
                    }),
                },
                {
                    xtype: 'uxfieldcontainer',
                    layout: {
                        type: 'table',
                        columns: 2,
                    },
                    defaults: {
                        haveReset: true,
                        width: "90%",
                    },
                    items: [
                        {
                            xtype: 'datefield',
                            name: 'effectiveDuration.startTime@from',
                            itemId: 'startTime',
                            format: 'Y年m月d日',
                            editable: false,
                            emptyText: i18n.getKey('startTime'),
                            fieldLabel: i18n.getKey('effectiveTime'),
                            diyGetValue: function () {
                                var me = this;
                                if (me.getValue()) {
                                    var date = me.getValue().getTime();
                                    return new Date(method.TimestampToTime(date, 'POST'));
                                }
                            },
                            listeners: {
                                change: function () {
                                    var me = this;
                                    var form = me.ownerCt;
                                    var value = me.getValue();
                                    var endTime = form.getComponent('endTime');
                                    endTime.setMinValue(value);
                                }
                            }
                        },
                        {
                            xtype: 'datefield',
                            name: 'effectiveDuration.endTime@to',
                            itemId: 'endTime',
                            format: 'Y年m月d日',
                            editable: false,
                            emptyText: i18n.getKey('endTime'),
                            bodyStyle: {
                                'transform': 'translateX(50px)'
                            },
                            diyGetValue: function () {
                                var me = this;
                                if (me.getValue()) {
                                    var date = me.getValue().getTime();
                                    return new Date(method.TimestampToTime(date, 'POST'));
                                }
                            },
                            listeners: {
                                change: function () {
                                    var me = this;
                                    var form = me.ownerCt;
                                    var value = me.getValue();
                                    var endTime = form.getComponent('startTime');
                                    endTime.setMaxValue(value);
                                }
                            }
                        },
                    ]
                },
            ]
        },
    })
})