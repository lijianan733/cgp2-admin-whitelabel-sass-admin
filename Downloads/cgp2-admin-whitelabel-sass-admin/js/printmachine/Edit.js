Ext.syncRequire(['CGP.printmachine.model.PrintMachine']);
Ext.onReady(function () {

    var page = Ext.widget({
        block: 'printmachine',
        xtype: 'uxeditpage',
        accessControl:true,
        gridPage: 'Main.html',
        formCfg: {
            model: 'CGP.printmachine.model.PrintMachine',
            remoteCfg: false,
            items: [{
                name: 'name',
                xtype: 'textfield',
                regex: /^\S+.*\S+$/,
                regexText: '值的首尾不能存在空格！',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                allowBlank: false
            }, {
                name: 'code',
                xtype: 'textfield',
                allowBlank: false,
                fieldLabel: i18n.getKey('code') ,
                itemId: 'code'
            }]
        }
    });
});