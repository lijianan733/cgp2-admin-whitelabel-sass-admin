Ext.syncRequire('CGP.multilingualconfig.model.LanguageResource');
Ext.onReady(function () {

    var page = Ext.widget({
        block: 'multilingualconfig',
        xtype: 'uxeditpage',
        //accessControl:true,
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.multilingualconfig.model.LanguageResource',
            remoteCfg: false,
            columnCount: 1,
            isValidForItems: true,
            fieldDefaults: {
                width: 150,
            },
            useForEach: true,
            items: [
                {
                    name: 'entityClass',
                    xtype: 'textfield',
                    width: 600,
                    regex: /^\S+.*\S+$/,
                    regexText: '值的首尾不能存在空格！',
                    fieldLabel: i18n.getKey('entityClass'),
                    itemId: 'entityClass',
                    allowBlank: false
                },
                {
                    name: 'attributeNames',
                    xtype: 'arraydatafield',
                    width: 600,
                    height: 100,
                    allowBlank: false,
                    resultType: 'Array',//该组件获取结果和设置值的数据类型
                    fieldLabel: i18n.getKey('needMultilingualAttr'),
                    itemId: 'attributeNames',
                }
            ]
        }
    });
});