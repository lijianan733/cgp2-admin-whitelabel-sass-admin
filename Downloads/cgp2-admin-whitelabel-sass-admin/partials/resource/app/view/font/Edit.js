Ext.application({
    requires: 'Ext.container.Viewport',
    name: 'CGP.resource',
    appFolder: '../../../app',
    views: ['font.LanguageGridField'],
    models: ['Font'],
    controllers: [
        'Font'
    ],
    launch: function () {
        Ext.widget({
            block: 'resource/app/view/font',
            xtype: 'uxeditpage',
            accessControl: true,
            gridPage: 'main.html',
            formCfg: {
                model: 'CGP.resource.model.Font',
                remoteCfg: false,
                useForEach: true,
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
                        hidden: true,
                        value: 'com.qpp.cgp.domain.pcresource.font.Font'
                    },
                    {
                        name: 'fontFamily',
                        allowBlank: false,
                        xtype: 'textfield',
                        regex: /^\S+.*\S+$/,
                        regexText: '值的首尾不能存在空格！',
                        fieldLabel: i18n.getKey('fontFamily'),
                        itemId: 'fontFamily'
                    },
                    {
                        name: 'displayName',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('displayName'),
                        itemId: 'displayName'
                    },
                    {
                        name: 'wordRegExp',
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('wordRegExp'),
                        itemId: 'wordRegExp'
                    },
                    {
                        xtype: 'checkboxgroup',
                        name: 'supportedStyle',
                        fieldLabel: i18n.getKey('supportedStyle'),
                        // Arrange checkboxes into two columns, distributed vertically
                        columns: 2,
                        vertical: true,
                        items: [
                            {boxLabel: '加粗', width: 80, name: 'rb1', inputValue: 'BOLD'},
                            {boxLabel: '斜体', width: 80, name: 'rb2', inputValue: 'ITALIC'},
                            {boxLabel: '下划线', width: 80, name: 'rb3', inputValue: 'UNDERLINE'}
                        ]
                    },
                    {
                        name: 'thumbnail',
                        xtype: 'fileuploadv2',
                        fieldLabel: i18n.getKey('thumbnail'),
                        itemId: 'thumbnail',
                        valueUrlType: 'part',
                    },
                    {
                        name: 'languages',
                        xtype: 'languagefield',
                        colspan: 2,
                        fieldLabel: i18n.getKey('language'),
                        itemId: 'language',
                        id: 'language',
                        valueType: 'idRef'
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