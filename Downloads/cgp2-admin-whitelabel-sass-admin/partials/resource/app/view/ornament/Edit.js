Ext.application({
    requires: 'Ext.container.Viewport',
    name: 'CGP.resource',
    appFolder: '../../../app',
    controllers: [
        'Ornament'
    ],
    launch: function () {
        Ext.widget({
            block: 'resource/app/view/ornament',
            xtype: 'uxeditpage',
            accessControl: true,
            gridPage: 'main.html',
            formCfg: {
                model: 'CGP.resource.model.Ornament',
                remoteCfg: false,
                items: [
                    {
                        name: '_id',
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('id'),
                        itemId: '_id',
                        hidden: true
                    },
                    {
                        name: 'name',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('name'),
                        itemId: 'name',
                        allowBlank: false
                    },
                    {
                        name: 'clazz',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('clazz'),
                        itemId: 'clazz',
                        hidden: true,
                        value: 'com.qpp.cgp.domain.pcresource.Ornament'
                    },
                ]
            },
            listeners: {
                afterload: function (page) {

                }
            }
        });
    }
});