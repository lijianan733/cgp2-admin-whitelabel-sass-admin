Ext.syncRequire(['CGP.costenterconfig.method.method']);

Ext.define('CGP.costenterconfig.component.edit.accountingConfig', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.accountingconfig',
    layout: {
        type: 'table',
        columns: 3,
        tdAttrs: {
            style: {
                'transform': 'translateX(-60px)'
            }
        }
    },
    initComponent: function () {
        var me = this;
        var method = Ext.create('CGP.costenterconfig.method.method');
        me.defaults = Ext.Object.merge({
            xtype: 'numberfield',
            editable: true,
            hideTrigger: true,
        }, me.defaults);
        me.items = [
            {
                itemId: 'unitCost',
                name: 'unitCost',
                allowBlank: false,
                fieldLabel: i18n.getKey('unitCost') + i18n.getKey('(HKD/小时)'),
                labelWidth: 180,
                width: 420,
            },
            {
                itemId: 'averageWorkingHours',
                name: 'averageWorkingHours',
                maxValue: 24,
                minValue: 1,
                allowBlank: false,
                fieldLabel: i18n.getKey('averageWorkingHours') + i18n.getKey('(小时)'),
                labelWidth: 180,
                width: 420,
            },
            {
                xtype: 'button',
                itemId: 'detailWorkingHours',
                name: 'detailWorkingHours',
                border: false,
                text: i18n.getKey('detailWorkingHours'),
                allowBlank: true,
                gridData: [],
                margin: '0 40',
                getValue: function () {
                    var me = this;
                    me.gridData.forEach(item => {
                        var stringDate = item['date'];
                        item['date'] = method.TimestampToTime(stringDate, 'POST');
                    })
                    return me.gridData;
                },
                setValue: function (data) {
                    var me = this;
                    me.gridData = data;
                },
                getName: function () {
                    var me = this;
                    return me.name;
                },
                handler: function () {
                    var me = this;
                    var gridData = me.gridData;
                    var win = Ext.create('Ext.window.Window', {
                        title: i18n.getKey('detailWorkingHours'),
                        layout: 'fit',
                        height: 400,
                        width: 500,
                        modal: true,
                        autoScroll: false,
                        items: [
                            {
                                xtype: 'gridwithcrud',
                                itemId: 'rule',
                                border: false,
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
                                    data: gridData,
                                }),
                                winConfig: {
                                    winTitle: i18n.getKey('add') + i18n.getKey('detailWorkingHours'),
                                    formConfig: {
                                        items: [
                                            {
                                                xtype: 'datefield',
                                                fieldLabel: i18n.getKey('date'),
                                                name: 'date',
                                                itemId: 'date',
                                                format: 'Y年m月d日',
                                                editable: false,
                                                allowBlank: false,
                                                diyGetValue: function () {
                                                    var me = this;
                                                    return me.getValue().getTime();
                                                },
                                                diySetValue: function (data) {
                                                    var me = this;
                                                    me.setValue(new Date(data));
                                                },
                                            },
                                            {
                                                xtype: 'numberfield',
                                                fieldLabel: i18n.getKey('manHour'),
                                                allowBlank: false,
                                                minValue: 1,
                                                maxValue: 24,
                                                itemId: 'value',
                                                name: 'value',
                                            },
                                        ]
                                    }
                                },
                                bbar: ['->', {
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
                        ]
                    })
                    win.show();
                }
            }
        ];
        me.callParent();
    }
})