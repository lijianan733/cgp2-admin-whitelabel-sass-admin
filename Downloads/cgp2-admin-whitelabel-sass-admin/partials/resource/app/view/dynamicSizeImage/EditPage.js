Ext.application({
    requires: [
        'Ext.container.Viewport',
    ],
    name: 'CGP.resource',
    appFolder: '../../../app',
    models: ['DynamicSizeImage'],
    controllers: [
        'DynamicSizeImage'
    ],
    launch: function () {
        Ext.widget({
            block: 'resource/app/view/dynamicSizeImage',
            xtype: 'uxeditpage',
            accessControl: true,
            gridPage: 'main.html',
            formCfg: {
                model: 'CGP.resource.model.DynamicSizeImage',
                remoteCfg: false,
                layout: {
                    layout: 'table',
                    columns: 1,
                    tdAttrs: {
                        style: {
                            'padding-right': '120px'
                        }
                    }
                },
                items: [
                    {
                        name: '_id',
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('id'),
                        itemId: '_id',
                        hidden: true
                    },
                    {
                        name: 'clazz',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('clazz'),
                        itemId: 'clazz',
                        hidden: true
                    },
                    {
                        margin: '0 0 0 50',
                        xtype: 'displayfield',
                        labelStyle: 'font-weight: bold',
                        value: i18n.getKey('information'),
                        itemId: 'information',
                        fieldStyle: 'color:black;font-weight: bold'
                    },
                    {
                        xtype: 'dsbaseinfor',
                        itemId: 'dsBaseinfor',
                        bodyStyle: 'border-width: 1px 0 0 0;',
                        margin: '5 10',
                    },
                    {
                        margin: '10 0 0 50',
                        xtype: 'displayfield',
                        labelStyle: 'font-weight: bold',
                        value: i18n.getKey('createRule'),
                        itemId: 'createRule',
                        fieldStyle: 'color:black;font-weight: bold'
                    },
                    {
                        xtype: 'ruleinfor',
                        itemId: 'ruleInfor',
                        bodyStyle: 'border-width: 1px 0 0 0;',
                        margin: '5 10',
                    },

                ],
            },
            listeners: {
                afterload: function (page) {

                }
            }
        });
    }
});
