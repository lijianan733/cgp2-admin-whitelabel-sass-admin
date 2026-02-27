Ext.Loader.syncRequire([
    'CGP.organizations.model.OrganizationModel',
    'CGP.country.store.CountryStore',
    'CGP.country.model.CountryModel',
]);
Ext.onReady(function () {
    var currencyStore = Ext.create('CGP.currency.store.Currency');
    var localCountryStore = Ext.create('Ext.data.Store', {
        model: 'CGP.country.model.CountryModel',
        data: [],
        proxy: {
            type: 'pagingmemory',
        },
    });
    var page = Ext.widget({
        xtype: 'uxeditpage',
        block: 'organizations',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.organizations.model.OrganizationModel',
            remoteCfg: false,
            layout: 'auto',
            items: [
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    allowBlank: false,
                    itemId: 'name',
                },
                {
                    name: 'code',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('code'),
                    allowBlank: false,
                    itemId: 'code',
                },
                {
                    name: 'currency',
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('currency'),
                    allowBlank: false,
                    editable: false,
                    haveReset: true,
                    //表格部分
                    autoScroll: true,
                    multiSelect: false, //复选择器
                    displayField: 'displayName',
                    valueField: 'id',
                    width: 380,
                    labelWidth: 100,
                    labelAlign: 'right',
                    store: currencyStore,
                    matchFieldWidth: false,
                    gridCfg: {
                        store: currencyStore,
                        height: 300,
                        width: 500,
                        columns: [
                            {
                                text: 'id',
                                width: 90,
                                dataIndex: 'id',
                            },
                            {
                                text: 'name',
                                width: 120,
                                dataIndex: 'title',
                            },
                            {
                                text: 'code',
                                flex: 1,
                                dataIndex: 'code',
                            },

                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: currencyStore,
                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                            emptyText: i18n.getKey('noDat'),
                        },
                    },
                    diySetValue: function (data) {
                        var me = this;
                        me.setInitialValue([data.id]);
                    },
                },
                {
                    xtype: 'gridfieldhascomplementarydata',
                    itemId: 'countries',
                    name: 'countries',
                    model: 'CGP.organizations.model.OrganizationModel',
                    width: 600,
                    isFormField: true,
                    allowBlank: false,
                    autoScroll: true,
                    maxHeight: 350,
                    minHeight: 100,
                    fieldLabel: i18n.getKey('country'),
                    dataWindowCfg: {
                        width: 600,
                        height: 400,
                        excludeIdType: 'Number'
                    },
                    searchGridCfg: {
                        gridCfg: {
                            editAction: false,
                            deleteAction: false,
                            storeCfg: {//配置store的所有参数，只是把创建store推后到新建弹窗时
                                clazz: 'CGP.country.store.CountryStore',
                            },
                        },
                        filterCfg: {
                            hidden: true,
                        },
                    },
                    gridConfig: {
                        autoScroll: true,
                        viewConfig: {
                            enableTextSelection: true,
                        },
                        store: localCountryStore,
                        bbar: {//底端的分页栏
                            xtype: 'pagingtoolbar',
                            store: localCountryStore,
                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                            emptyMsg: i18n.getKey('noData'),
                        },
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 90,
                                dataIndex: 'id',
                                itemId: 'id',
                                isLike: false,
                                sortable: true,
                            },
                            {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                width: 190,
                                itemId: 'fontFamily',
                            },
                            {
                                text: i18n.getKey('code'),
                                dataIndex: 'isoCode3',
                                flex: 1,
                                itemId: 'displayName',
                            },
                        ],
                    },
                    diyGetValue: function () {
                        var me = this;
                        return me._grid.store.proxy.data;
                    },
                },
            ],
        },
    });


});