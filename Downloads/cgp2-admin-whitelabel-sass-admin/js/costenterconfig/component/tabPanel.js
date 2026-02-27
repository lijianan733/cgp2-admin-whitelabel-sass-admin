Ext.define('CGP.costenterconfig.component.tabPanel', {
    extend: 'Ext.tab.Panel',
    header: false,
    character: path + 'partials/costenterconfig/component/' + 'costEnterConfig.html',
    initComponent: function () {
        var me = this;
        me.laborCost = me.character + '?character=laborCost';
        me.dpctOfMcn = me.character + '?character=dpctOfMcn';
        me.overhead = me.character + '?character=overhead';
        me.items = [
            {
                id: 'laborCost',
                title: i18n.getKey('laborCost'),
                html: '<iframe id="tabs_iframe_' + 'character' + '" src="' + me.laborCost + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: false
            },
            {
                id: 'overhead',
                title: i18n.getKey('overhead'),
                html: '<iframe id="tabs_iframe_' + 'character' + '" src="' + me.overhead + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: false
            },
            {
                id: 'dpctOfMcn',
                title: i18n.getKey('dpctOfMcn'),
                html: '<iframe id="tabs_iframe_' + 'character' + '" src="' + me.dpctOfMcn + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: false
            },
        ];
        me.callParent(arguments);
    }
})