Ext.Loader.require("CGP.customscategory.model.CustomsCategory");
Ext.onReady(function () {

    var page = Ext.widget({
        block: 'customscategory',
        xtype: 'uxeditpage',

        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.customscategory.model.CustomsCategory',
            remoteCfg: false,
            items: [
                {
                    name: 'tagKeyCode',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('tagKeyCode'),
                    itemId: 'tagKeyCode',
                    allowBlank: false
                },
                {
                    name: 'inName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('inName'),
                    itemId: 'inName',
                    allowBlank: false
                },
                {
                    name: 'inCode',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('inCode'),
                    allowBlank: false,
                    itemId: 'inCode'
                },
                {
                    name: 'outName',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('outName'),
                    itemId: 'outName',
                    allowBlank: false
                },
                {
                    name: 'outCode',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('outCode'),
                    itemId: 'outCode',
                    allowBlank: false
                },
                {
                    name: 'unit',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('unit'),
                    itemId: 'unit',
                    allowBlank: false
                },
                {
                    name: 'remark',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('remark'),
                    itemId: 'remark',
                    allowBlank: false
                },
                {
                    name: 'showSize',
                    xtype: 'radiogroup',
                    allowBlank: false,
                    defaults: {
                        name: 'showSize',
                        width: 100
                    },
                    width: 380,
                    columns: 3,
                    items: [
                        {
                            inputValue: 'S',
                            boxLabel: 'S'
                        },
                        {
                            inputValue: 'Y',
                            boxLabel: 'Y'

                        }, {
                            inputValue: 'N',
                            boxLabel: 'N'
                        }
                    ],
                    fieldLabel: i18n.getKey('is') + i18n.getKey('show') + i18n.getKey('size'),
                    itemId: 'isShowSize'
                },
                {
                    name: 'showCount',
                    xtype: 'radiogroup',
                    allowBlank: false,
                    vertical: true,
                    defaults: {
                        name: 'showCount',
                        width: 100
                    },
                    items: [
                        {
                            inputValue: 'S',
                            boxLabel: 'S'
                        },
                        {
                            inputValue: 'Y',
                            boxLabel: 'Y'
                        }, {
                            inputValue: 'N',
                            boxLabel: 'N'
                        }
                    ],
                    fieldLabel: i18n.getKey('is') + i18n.getKey('show') + i18n.getKey('quantity'),
                    itemId: 'isShowCount'
                },
                {
                    name: 'showBrand',
                    xtype: 'radiogroup',
                    allowBlank: false,
                    vertical: true,
                    defaults: {
                        name: 'showBrand',
                        width: 100
                    },
                    items: [
                        {
                            inputValue: 'S',
                            boxLabel: 'S'
                        },
                        {
                            inputValue: 'Y',
                            boxLabel: 'Y'
                        }, {
                            inputValue: 'N',
                            boxLabel: 'N'
                        }
                    ],
                    fieldLabel: i18n.getKey('is') + i18n.getKey('show') + i18n.getKey('brand'),
                    itemId: 'isShowBrand'
                },
                {
                    name: 'showSpecifications',
                    xtype: 'radiogroup',
                    allowBlank: false,
                    vertical: true,
                    defaults: {
                        name: 'showSpecifications',
                        width: 100
                    },
                    items: [
                        {
                            inputValue: 'S',
                            boxLabel: 'S'
                        },
                        {
                            inputValue: 'Y',
                            boxLabel: 'Y'
                        }, {
                            inputValue: 'N',
                            boxLabel: 'N'
                        }
                    ],
                    fieldLabel: i18n.getKey('is') + i18n.getKey('show') + i18n.getKey('specification'),
                    itemId: 'isShowSpecifications'
                },
                {
                    name: 'showModel',
                    xtype: 'radiogroup',
                    allowBlank: false,
                    vertical: true,
                    defaults: {
                        name: 'showModel',
                        width: 100
                    },
                    items: [
                        {
                            inputValue: 'S',
                            boxLabel: 'S'
                        },
                        {
                            inputValue: 'Y',
                            boxLabel: 'Y'
                        }, {
                            inputValue: 'N',
                            boxLabel: 'N'
                        }
                    ],
                    fieldLabel: i18n.getKey('is') + i18n.getKey('show') + i18n.getKey('model'),
                    itemId: 'isShowModel'
                },
                {
                    name: 'showFreightNum',
                    xtype: 'radiogroup',
                    allowBlank: false,
                    vertical: true,
                    defaults: {
                        name: 'showFreightNum',
                        width: 100
                    },
                    items: [
                        {
                            inputValue: 'S',
                            boxLabel: 'S'
                        },
                        {
                            inputValue: 'Y',
                            boxLabel: 'Y'
                        }, {
                            inputValue: 'N',
                            boxLabel: 'N'
                        }
                    ],
                    fieldLabel: i18n.getKey('is') + i18n.getKey('show') + i18n.getKey('cargoNo'),
                    itemId: 'isShowFreightNum'
                },
                {
                    name: 'showStyleNum',
                    xtype: 'radiogroup',
                    allowBlank: false,
                    vertical: true,
                    defaults: {
                        name: 'showStyleNum',
                        width: 100
                    },
                    items: [
                        {
                            inputValue: 'S',
                            boxLabel: 'S'
                        },
                        {
                            inputValue: 'Y',
                            boxLabel: 'Y'
                        }, {
                            inputValue: 'N',
                            boxLabel: 'N'
                        }
                    ],
                    fieldLabel: i18n.getKey('is') + i18n.getKey('name') + i18n.getKey('patternNo'),
                    itemId: 'isShowStyleNum'
                },
                {
                    name: 'commodityInspection',
                    xtype: 'radiogroup',
                    allowBlank: true,
                    vertical: true,
                    defaults: {
                        name: 'commodityInspection',
                        width: 100
                    },
                    items: [
                        {
                            inputValue: 'S',
                            boxLabel: 'S'
                        },
                        {
                            inputValue: 'Y',
                            boxLabel: 'Y'
                        }, {
                            inputValue: 'N',
                            boxLabel: 'N'
                        }
                    ],
                    fieldLabel: i18n.getKey('isCommodityInspection'),
                    itemId: 'isCommodityInspection'
                }
            ]
        }
    });
});
