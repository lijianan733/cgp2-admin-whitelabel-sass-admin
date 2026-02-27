Ext.Loader.syncRequire(['Ext.ux.form.GridField', "CGP.holidayinfo.model.HolidayInfoModel"]);
Ext.onReady(function () {
    var countryStore = Ext.create('CGP.country.store.CountryStore');
    var page = Ext.widget({
        block: 'holidayinfo',
        xtype: 'uxeditpage',
        tbarCfg: {
            btnCopy: {}
        },
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.holidayinfo.model.HolidayInfoModel',
            useForEach: true,
            items: [
                {
                    name: '_id',
                    itemId: '_id',
                    hidden: true,
                    allowBlank: true,
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('_id'),
                },
                {
                    name: 'name',
                    itemId: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                },
                {
                    name: 'remark',
                    itemId: 'remark',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('remark'),
                },
                {
                    name: 'description',
                    itemId: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                },
                {
                    xtype: 'gridcombo',
                    itemId: 'country',
                    editable: false,
                    fieldLabel: i18n.getKey('country'),
                    name: 'country',
                    autoScroll: true,
                    multiSelect: false,
                    allowBlank: false,
                    displayField: 'name',
                    valueField: 'id',
                    width: 380,
                    colspan: 2,
                    store: countryStore,
                    isFormField: true,
                    matchFieldWidth: false,
                    gridCfg: {
                        store: countryStore,
                        height: 300,
                        width: 400,
                        columns: [{
                            text: 'id',
                            width: 40,
                            dataIndex: 'id'
                        }, {
                            text: 'name',
                            width: 120,
                            dataIndex: 'name'
                        }, {
                            text: 'code',
                            flex: 1,
                            dataIndex: 'code'
                        }],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: countryStore,
                            emptyMsg: i18n.getKey('noData')
                        })
                    },
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            me.setInitialValue([data.id]);
                        }
                    },
                    diyGetValue: function () {
                        var me = this;
                        return me.getArrayValue();
                    }
                },
                {
                    name: 'holidayStrategy',
                    itemId: 'holidayStrategy',
                    xtype: 'uxfieldcontainer',
                    displayField: 'display',
                    value: 'value',
                    labelAlign: 'top',
                    defaults: {},
                    fieldLabel: i18n.getKey('holiday') + i18n.getKey('rule'),
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            var clazz = me.getComponent('clazz');
                            var continuousDays = me.getComponent('continuousDays');
                            clazz.setValue(data.clazz);
                            continuousDays.setValue(data.continuousDays);
                            if (data.clazz == 'com.qpp.cgp.domain.preprocess.holiday.YearRepeat') {
                                var yearRepeat = me.getComponent('yearRepeat');
                                yearRepeat.setValue(data.month + '/' + data.day + '/' + 2021);

                            } else if (data.clazz == 'com.qpp.cgp.domain.preprocess.holiday.WeekRepeat') {
                                var weekRepeat = me.getComponent('weekRepeat');
                                weekRepeat.setValue(data);
                            } else if (data.clazz == 'com.qpp.cgp.domain.preprocess.holiday.DirectAssign') {
                                var directAssign = me.getComponent('directAssign');
                                directAssign.setValue(data.month + '/' + data.day + '/' + data.year);
                            }
                        }
                    },
                    diyGetValue: function () {
                        var me = this;
                        var result = {
                            clazz: me.getComponent('clazz').getValue(),
                            continuousDays: me.getComponent('continuousDays').getValue()
                        };
                        if (result.clazz == 'com.qpp.cgp.domain.preprocess.holiday.YearRepeat') {
                            var yearRepeat = me.getComponent('yearRepeat');
                            var date = yearRepeat.getValue();
                            result['month'] = date.getMonth() + 1;
                            result['day'] = date.getDate();

                        } else if (result.clazz == 'com.qpp.cgp.domain.preprocess.holiday.WeekRepeat') {
                            var weekRepeat = me.getComponent('weekRepeat');
                            weekRepeat.getValue();
                            var date = weekRepeat.getValue();
                            result['month'] = date.month;
                            result['week'] = date.week;
                            result['day'] = date.day;
                        } else if (result.clazz == 'com.qpp.cgp.domain.preprocess.holiday.DirectAssign') {
                            //指定日期的需要额外字段date
                            var directAssign = me.getComponent('directAssign');
                            directAssign.getValue();
                            var date = directAssign.getValue();
                            result['month'] = date.getMonth() + 1;
                            result['day'] = date.getDate();
                            result['year'] = date.getFullYear();
                            result['date'] = date.getTime();
                        }
                        return result;
                    },
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('type'),
                            valueField: 'value',
                            itemId: 'clazz',
                            displayField: 'display',
                            editable: false,
                            value: 'com.qpp.cgp.domain.preprocess.holiday.YearRepeat',
                            mapping: {
                                common: ['clazz', 'continuousDays'],
                                'com.qpp.cgp.domain.preprocess.holiday.YearRepeat': [
                                    'yearRepeat'
                                ],
                                'com.qpp.cgp.domain.preprocess.holiday.WeekRepeat': [
                                    'weekRepeat'
                                ],
                                'com.qpp.cgp.domain.preprocess.holiday.DirectAssign': [
                                    'directAssign'
                                ]
                            },
                            store: Ext.create('Ext.data.Store', {
                                fields: ['value', 'display'],
                                data: [
                                    {
                                        value: 'com.qpp.cgp.domain.preprocess.holiday.YearRepeat',
                                        display: '每年重复指定日期'
                                    },
                                    {
                                        value: 'com.qpp.cgp.domain.preprocess.holiday.WeekRepeat',
                                        display: '每年重复某月第几周星期几'
                                    },
                                    {
                                        value: 'com.qpp.cgp.domain.preprocess.holiday.DirectAssign',
                                        display: '指定具体年月日'
                                    }
                                ]
                            }),
                            listeners: {
                                change: function (combo, newValue, oldValue) {
                                    var container = combo.ownerCt;
                                    for (var i = 0; i < container.items.items.length; i++) {
                                        var item = container.items.items[i];
                                        if (Ext.Array.contains(combo.mapping['common'], item.itemId)) {

                                        } else if (Ext.Array.contains(combo.mapping[newValue], item.itemId)) {
                                            item.show();
                                            item.setDisabled(false);
                                        } else {
                                            item.hide();
                                            item.setDisabled(true);
                                        }

                                    }
                                }
                            }
                        },
                        {
                            name: 'continuousDays',
                            itemId: 'continuousDays',
                            xtype: 'numberfield',
                            allowDecimals: false,
                            allowBlank: false,
                            fieldLabel: i18n.getKey('holiday') + i18n.getKey('持续天数'),
                        },
                        {
                            name: 'yearRepeat',
                            itemId: 'yearRepeat',
                            format: 'm/d',
                            editable: false,
                            allowBlank: false,
                            xtype: 'datefield',
                            fieldLabel: i18n.getKey('日期(某月某天)'),
                        },
                        {
                            xtype: 'uxfieldcontainer',
                            layout: 'hbox',
                            hidden: true,
                            disabled: true,
                            allowBlank: false,
                            itemId: 'weekRepeat',
                            name: 'weekRepeat',
                            labelAlign: 'left',
                            fieldLabel: i18n.getKey('日期（第几周星期几）'),
                            defaults: {
                                flex: 1
                            },
                            items: [
                                {
                                    name: 'month',
                                    itemId: 'month',
                                    xtype: 'combo',
                                    valueField: 'value',
                                    displayField: 'display',
                                    editable: false,
                                    store: Ext.create('Ext.data.Store', {
                                        fields: [
                                            'value', 'display'
                                        ],
                                        data: [
                                            {
                                                value: 1,
                                                display: '1月'
                                            }, {
                                                value: 2,
                                                display: '2月'
                                            }, {
                                                value: 3,
                                                display: '3月'
                                            }, {
                                                value: 4,
                                                display: '4月'
                                            }, {
                                                value: 5,
                                                display: '5月'
                                            }, {
                                                value: 6,
                                                display: '6月'
                                            }, {
                                                value: 7,
                                                display: '7月'
                                            }, {
                                                value: 8,
                                                display: '8月'
                                            }, {
                                                value: 9,
                                                display: '9月'
                                            }, {
                                                value: 10,
                                                display: '10月'
                                            }, {
                                                value: 11,
                                                display: '11月'
                                            }, {
                                                value: 12,
                                                display: '12月'
                                            },
                                        ]
                                    }),
                                },
                                {
                                    name: 'week',
                                    itemId: 'week',
                                    xtype: 'combo',
                                    valueField: 'value',
                                    displayField: 'display',
                                    margin: '0 5 0 5',
                                    editable: false,
                                    store: Ext.create('Ext.data.Store', {
                                        fields: [
                                            'value', 'display'
                                        ],
                                        data: [
                                            {
                                                value: 1,
                                                display: '第1周'
                                            }, {
                                                value: 2,
                                                display: '第2周'
                                            }, {
                                                value: 3,
                                                display: '第3周'
                                            }, {
                                                value: 4,
                                                display: '第4周'
                                            }, {
                                                value: 5,
                                                display: '第5周'
                                            }
                                        ]
                                    }),
                                },
                                {
                                    name: 'day',
                                    itemId: 'day',
                                    xtype: 'combo',
                                    valueField: 'value',
                                    displayField: 'display',
                                    editable: false,
                                    store: Ext.create('Ext.data.Store', {
                                        fields: [
                                            'value', 'display'
                                        ],
                                        data: [
                                            {
                                                value: 1,
                                                display: '星期一'
                                            }, {
                                                value: 2,
                                                display: '星期二'
                                            }, {
                                                value: 3,
                                                display: '星期三'
                                            }, {
                                                value: 4,
                                                display: '星期四'
                                            }, {
                                                value: 5,
                                                display: '星期五'
                                            }, {
                                                value: 6,
                                                display: '星期六'
                                            }, {
                                                value: 7,
                                                display: '星期日'
                                            }
                                        ]
                                    }),
                                },
                            ]
                        },
                        {
                            name: 'directAssign',
                            itemId: 'directAssign',
                            format: 'm/d/Y',
                            editable: false,
                            xtype: 'datefield',
                            hidden: true,
                            allowBlank: false,
                            disabled: true,
                            fieldLabel: i18n.getKey('日期(年月日)'),
                        },
                    ],

                },
            ]
        },
    });
});
