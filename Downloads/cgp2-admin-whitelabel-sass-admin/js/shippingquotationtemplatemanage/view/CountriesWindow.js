/**
 * Create by shirley on 2021/8/30
 * 计费规则国家选择窗口
 * */
Ext.Loader.syncRequire([
    'CGP.shippingquotationtemplatemanage.store.CountriesStore',
    'CGP.shippingquotationtemplatemanage.view.ZoneCodeSelectWindow'
])
Ext.define('CGP.shippingquotationtemplatemanage.view.CountriesWindow', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    createOrEdit: 'create',
    width: 770,
    height: 500,
    record: null,
    store: null,
    selectCountries: null,
    modal: true,
    readOnly: false,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('add') + '' + i18n.getKey('country');
        //TODO 添加国家过过滤查询，接口请求是自动过滤countryCode数组中的国家
        var selectCountryCode = me.store.data.items;
        var countryCodeArray = [];
        selectCountryCode.forEach(function (ele) {
            var countryCode = ele.data.countryCode;
            countryCodeArray.push(countryCode);
        })
        var CountriesStore = Ext.create('CGP.shippingquotationtemplatemanage.store.CountriesStore');
        me.items = [
            {
                xtype: 'searchcontainer',
                border: false,
                defaults: {
                    allowBlank: false
                },
                filterCfg: {
                    minHeight: 80,
                    header: false,
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    border: false,
                    defaults: {
                        margin: '5 25 5 25',
                    },
                    items: [
                        {
                            name: 'id',
                            xtype: 'numberfield',
                            fieldLabel: i18n.getKey('id'),
                            itemId: 'id',
                            isLike: false
                        }, {
                            name: 'name',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            itemId: 'name'
                        },
                        {
                            name: 'isoCode2',
                            xtype: 'textfield',
                            isLike: false,
                            fieldLabel: i18n.getKey('isoCode2'),
                            itemId: 'isoCode2'
                        },
                        {
                            name: 'excludeIsoCode2s',
                            hidden: true,
                            isLike: false,
                            xtype: 'textfield',
                            itemId: 'excludeIsoCode2s',
                            value: JSON.stringify(countryCodeArray)
                        }
                    ]
                },
                gridCfg: {
                    store: CountriesStore,
                    frame: false,
                    editAction: false,
                    deleteAction: false,
                    pagingBar: false,
                    selType: 'checkboxmodel',
                    simpleSelect: true,
                    tbar: [{
                        itemId: 'btnInvertSelection',
                        text: i18n.getKey('toggleSelect'),
                        iconCls: 'icon_create',
                        handler: function (btn) {
                            var me = this;
                            var grid = this.ownerCt.ownerCt;
                            var selModel = grid.getSelectionModel();
                            var selected = selModel.getSelection();
                            var notSelected = [];
                            grid.getStore().each(function (model) {
                                if (!Ext.Array.contains(selected, model)) {
                                    notSelected.push(model);
                                }
                            });
                            selModel.deselect(selected);
                            selModel.select(notSelected);
                        }
                    }],
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: 'id',
                            xtype: 'gridcolumn',
                            itemId: 'id',
                            sortable: true,
                            flex: 1,
                            renderer: function (value, metaData, record, rowIndex) {
                                metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                            xtype: 'gridcolumn',
                            itemId: 'name',
                            width: 250,
                            sortable: true,
                            flex: 3,
                            renderer: function (value, metaData, record, rowIndex) {
                                metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                return value;
                            }
                        }, {
                            text: i18n.getKey('isoCode2'),
                            dataIndex: 'isoCode2',
                            xtype: 'gridcolumn',
                            width: 450,
                            itemId: 'isoCode2',
                            sortable: true,
                            flex: 3,
                            renderer: function (value, metaData, record, rowIndex) {
                                metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                return value;
                            }
                        }]
                }
            }
        ];
        me.bbar = {
            hidden: me.readOnly,
            items: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('nextStep'),
                    iconCls: 'icon_next_step',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var form = btn.ownerCt.ownerCt.items.items[0];
                        var selected = form.grid.getSelectionModel().getSelection();
                        if (Ext.isEmpty(selected)) {
                            window.alert("Please select the country you want to add.");
                            return;
                        }
                        var selectData = [];
                        selected.forEach(function (item) {
                            var itemData = {
                                countryCode: item.data.isoCode2,
                                zoneCode: null
                            };
                            selectData.push(itemData);
                        });
                        win.selectCountries = selectData;
                        //跳转zone页面
                        var win = Ext.create('CGP.shippingquotationtemplatemanage.view.ZoneCodeSelectWindow', {
                            selectCountries: win.selectCountries,
                            store: win.store,
                            _panel: win
                        });
                        win.show();
                    },
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        me.close();
                    }
                }
            ]
        };
        me.callParent();
    }
})