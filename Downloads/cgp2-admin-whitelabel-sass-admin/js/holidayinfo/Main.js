Ext.onReady(function () {
    var countryStore = Ext.create('CGP.country.store.CountryStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('holiday') + i18n.getKey('info'),
        block: 'holidayinfo',
        editPage: 'edit.html',
        gridCfg: {
            store: Ext.create("CGP.holidayinfo.store.HolidayInfoStore"),
            frame: false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    width: 90,
                    dataIndex: '_id',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('holiday') + i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 120,
                    itemId: 'name'
                },
                {
                    text: i18n.getKey('country'),
                    dataIndex: 'country',
                    width: 100,
                    itemId: 'country',
                    renderer: function (value, mateData, record) {
                        return value.name;
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 120,
                    itemId: 'description'
                },
                {
                    text: i18n.getKey('remark'),
                    dataIndex: 'remark',
                    width: 165,
                    itemId: 'remark'
                },
                {
                    text: i18n.getKey('holiday') + i18n.getKey('rule'),
                    dataIndex: 'holidayStrategy',
                    flex: 1,
                    minWidth: 250,
                    itemId: 'holidayStrategy',
                    renderer: function (value, mateData, record) {
                        var result = [];
                        if (value.clazz == 'com.qpp.cgp.domain.preprocess.holiday.YearRepeat') {
                            result.push({
                                title: i18n.getKey('type'),
                                value: '每年重复指定日期'
                            })
                            result.push({
                                title: i18n.getKey('日期(某月某天)'),
                                value: value.month + '月' + value.day + '日'
                            })
                        } else if (value.clazz == 'com.qpp.cgp.domain.preprocess.holiday.WeekRepeat') {
                            result.push({
                                title: i18n.getKey('type'),
                                value: '每年重复某月第几周星期几'
                            })
                            result.push({
                                title: i18n.getKey('日期'),
                                value: value.month + '月第' + value.week + '周星期' + value.day
                            })
                        } else if (value.clazz == 'com.qpp.cgp.domain.preprocess.holiday.DirectAssign') {
                            result.push({
                                title: i18n.getKey('type'),
                                value: '指定年月日'
                            })
                            result.push({
                                title: i18n.getKey('日期(某年某月某天)'),
                                value: value.year + '年' + value.month + '月' + value.day + '日'
                            })
                        }
                        result.push({
                            title: i18n.getKey('holiday') + i18n.getKey('持续天数'),
                            value: value.continuousDays
                        })
                        return JSCreateHTMLTable(result);
                    }
                }
            ]
        },
        filterCfg: {
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'textfield',
                    isLike: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('holiday') + i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'remark',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('remark'),
                    itemId: 'remark'
                },
                {
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                },
                {
                    xtype: 'gridcombo',
                    itemId: 'country',
                    editable: false,
                    fieldLabel: i18n.getKey('country'),
                    name: 'country._id',
                    autoScroll: true,
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
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
                }
            ]
        }
    });
});
