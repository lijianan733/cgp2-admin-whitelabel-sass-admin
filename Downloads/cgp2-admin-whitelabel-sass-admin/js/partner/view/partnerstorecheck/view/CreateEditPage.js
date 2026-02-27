/**
 * @author xiu
 * @date 2025/5/15
 */
Ext.define('CGP.partner.view.partnerstorecheck.view.CreateEditPage', {
    extend: 'Ext.ux.ui.EditPage',
    alias: 'widget.createEditPage',
    block: 'partnerstorecheck',
    gridPage: 'main.html',
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.manufactureproductionconfig.controller.Controller'),
            defaults = Ext.create('CGP.manufactureproductionconfig.defaults.ManufactureproductionconfigDefaults'),
            countriesStore = Ext.create('CGP.shippingquotationtemplatemanage.store.CountriesStore', {
                autoLoad: true,
            });

        me.config = {
            block: me.block,
            tbarCfg: {
                hiddenButtons: ['create', 'clear', 'delete', 'config', 'help', 'copy', 'reset'],
                btnGrid: {
                    handler: function () {
                        JSOpen({
                            id: me.block + 'page',
                            url: path + 'partials/' + me.block + '/' + me.gridPage,
                            title: i18n.getKey('生产基地配置'),
                            refresh: true
                        })
                    }
                }
            },
            formCfg: {
                model: 'CGP.manufactureproductionconfig.model.ManufactureproductionconfigModel',
                remoteCfg: false,
                layout: 'vbox',
                items: [
                    {
                        xtype: 'textfield',
                        name: 'id',
                        itemId: 'id',
                        hidden: true,
                        fieldLabel: i18n.getKey('id'),
                    },
                    {
                        xtype: 'textfield',
                        name: 'name',
                        itemId: 'name',
                        allowBlank: false,
                        fieldLabel: i18n.getKey('name'),
                    },
                    {
                        xtype: 'textfield',
                        name: 'code',
                        itemId: 'code',
                        allowBlank: false,
                        fieldLabel: i18n.getKey('code'),
                    },
                    {
                        xtype: 'gridcombo',
                        name: 'countryCode',
                        itemId: 'countryCode',
                        fieldLabel: i18n.getKey('country'),
                        allowBlank: false,
                        haveReset: true,
                        isHiddenCheckSelected: true,
                        displayField: 'isoCode2',
                        valueField: 'isoCode2',
                        store: countriesStore,
                        editable: false,
                        multiSelect: false,
                        matchFieldWidth: false,
                        defaultListConfig: {
                            multiSelect: false,
                        },
                        diyGetValue: function () {
                            var me = this,
                                value = me.getValue(),
                                result = Object.keys(value)

                            return result;
                        },
                        diySetValue: function (data) {
                            var me = this,
                                url = adminPath + 'api/countries?_dc=1747814438229&page=1&start=0&limit=1000&filter=' + Ext.JSON.encode([
                                    {"name": "isoCode2", "operator": "exactMatch", "value": `${data}`, "type": "string"}
                                ]),
                                data = controller.getQuery(url)[0];

                            data && me.setValue(data);
                        },
                        gridCfg: {
                            store: countriesStore,
                            height: 400,
                            width: 800,
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    autoSizeColumn: false,
                                    itemId: 'rownumberer',
                                    width: 45,
                                    resizable: true,
                                    menuDisabled: true,
                                    tdCls: 'vertical-middle'
                                },
                                {
                                    text: i18n.getKey('id'),
                                    width: 120,
                                    dataIndex: 'id',
                                },
                                {
                                    text: i18n.getKey('name'),
                                    dataIndex: 'name',
                                    width: 250,
                                },
                                {
                                    text: i18n.getKey('code'),
                                    dataIndex: 'isoCode2',
                                    flex: 1
                                },
                            ],
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: countriesStore,
                                displayInfo: true,
                            })
                        },
                        filterCfg: {
                            layout: {
                                type: 'column',
                                columns: 3
                            },
                            defaults: {
                                margin: 5,
                                isLike: false,
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('id'),
                                    name: 'id',
                                    itemId: 'id',
                                    hideTrigger: true,
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('name'),
                                    name: 'name',
                                    itemId: 'name'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('code'),
                                    name: 'isoCode2',
                                    itemId: 'isoCode2'
                                },
                            ]
                        },
                    },
                    {
                        xtype: 'textfield',
                        name: 'state',
                        itemId: 'state',
                        fieldLabel: i18n.getKey('state'),
                    },
                    {
                        xtype: 'textfield',
                        name: 'city',
                        itemId: 'city',
                        fieldLabel: i18n.getKey('city'),
                    },
                ]
            },
            diyGetValue: function () {
                var me = this,
                    items = me.items.items,
                    result = {};

                items.forEach(item => result[item.itemId] = item.diyGetValue ? item.diyGetValue() : item.getValue());
                return result;
            },
        }
        me.callParent();
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
})