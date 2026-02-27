/*
* Created by nan on 2025/05/1
*
*/
Ext.Loader.syncRequire([
    'CGP.qpmn_tax.view.CountryGridField',
    'Ext.ux.form.field.ToggleButton',
    'Ext.ux.grid.column.ATagColumn',
    'CGP.product_price_component.controller.Controller'
]);
Ext.onReady(function () {
    var controller = Ext.create('CGP.product_price_component.controller.Controller', {})
    var defaultConfig = controller.getSystemDefaultConfig();
    console.log(defaultConfig);
    var taxConfigStore = Ext.create("CGP.product_price_component.store.ProductPriceComponentStore");
    var gridPage = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('产品价格组成'),
        block: 'product_price_component',
        editPage: 'edit.html',
        gridCfg: {
            store: taxConfigStore,
            frame: false,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('operator'),
                    dataIndex: '_id',
                    width: 250,
                    getDisplayName: function (value, metadata, record, rowIndex, colIndex, store, view, ela) {
                        return `<a class="atag_display" tag="Stage"  configId= "${defaultConfig.Stage._id}" currentId="${value}" style="color: red;visibility: ${defaultConfig.Stage?.productPriceComponent?._id == value ? 'hidden' : 'visible'};">设为Stage默认</a>` +
                            `<a class="atag_display" tag="Production"  configId= "${defaultConfig.Production._id}" currentId="${value}" style="color: green;margin-left: 30px;visibility: ${defaultConfig.Production?.productPriceComponent?._id == value ? 'hidden' : 'visible'}">设为Production默认</a>`;
                    },
                    clickHandler: function (value, metadata, record, rowIndex, colIndex, store, view, ela) {
                        var grid = view.ownerCt;
                        var env = ela.getAttribute('tag');
                        var configId = ela.getAttribute('configId');
                        var currentId = ela.getAttribute('currentId');
                        controller.setSystemDefaultConfig(env, configId, currentId, function () {
                            defaultConfig = controller.getSystemDefaultConfig();
                            grid.store.load();
                        });
                    }
                }, {
                    xtype: 'auto_bread_word_column',
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 250,
                }, {
                    xtype: "atagcolumn",
                    text: i18n.getKey('价格组成规则'),
                    dataIndex: 'priceComponents',
                    getDisplayName: function () {
                        return `<a class="atag_display">查看</a>`;
                    },
                    clickHandler: function (value, metaData, record) {
                        var win = Ext.create('Ext.window.Window', {
                            modal: true,
                            constrain: true,
                            title: '价格组成规则',
                            width: 800,
                            items: [
                                {
                                    xtype: 'grid',
                                    store: {
                                        fields: [
                                            {
                                                name: 'code',
                                                type: 'string'
                                            },
                                            {
                                                name: 'name',
                                                type: 'string'
                                            },
                                            {
                                                name: 'percentage',
                                                type: 'number'
                                            },
                                            {
                                                name: 'sortOrder',
                                                type: 'number'
                                            },
                                            {
                                                name: 'title',
                                                type: 'string'
                                            },
                                        ],
                                        proxy: {
                                            type: 'memory'
                                        },
                                        data: value
                                    },
                                    autoScroll: true,
                                    columns: [
                                        {
                                            xtype: 'rownumberer'
                                        },
                                        {
                                            xtype: 'auto_bread_word_column',
                                            dataIndex: 'code',
                                            flex: 1,
                                            text: i18n.getKey('code')
                                        },
                                        {
                                            xtype: 'auto_bread_word_column',
                                            dataIndex: 'name',
                                            flex: 1,
                                            text: i18n.getKey('name')
                                        },
                                        {
                                            xtype: 'auto_bread_word_column',
                                            text: i18n.getKey('title'),
                                            dataIndex: 'title',
                                            flex: 1,
                                        },
                                        {
                                            dataIndex: 'percentage',
                                            text: i18n.getKey('比例'),
                                            renderer: function (value) {
                                                return value + '%'
                                            },
                                        },
                                    ]
                                }
                            ]
                        });
                        win.show(null, function () {
                            var me = this;
                            me.center();
                        });
                    }
                },
                {
                    dataIndex: '_id',
                    text: '备注',
                    flex: 1,
                    renderer: function (value, metaData, record) {
                        var resultStr = '';
                        if (defaultConfig.Stage?.productPriceComponent?._id == value) {
                            resultStr += '<font color="red"  style="font-weight: bold">Stage环境默认价格组成配置;</font><br>';
                        }
                        if (defaultConfig.Production.productPriceComponent?._id == value) {
                            resultStr += '<font color="green" style="font-weight: bold">Production环境默认价格组成配置;</font><br>';
                        }
                        return resultStr;
                    }
                }
            ]
        },
        filterCfg: {
            items: [{
                name: '_id',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: '_id'
            }, {
                xtype: 'textfield',
                name: 'description',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            },]
        }
    });
});