Ext.onReady(function(){


    var registerMailUrl = path + 'partials/config/' + '3.html' + window.location.search;
    var customerMailUrl = path + 'partials/config/' + '7.html' + window.location.search;
    var orderMailUrl = path + 'partials/config/' + '8.html' + window.location.search;
    var tabPanel = Ext.create('Ext.tab.Panel', {
        id: 'sendmailtabs',
        width: Ext.getBody().getWidth(),
        height: 800,
        region: 'center',
        items: [{
            id: 'registermail',
            title: i18n.getKey('register mail'),
            html: '<iframe id="tabs_iframe_' + 'registermail' + '" src="' + registerMailUrl + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: false
        },{
            id: 'customermail',
            title: i18n.getKey("customer mail"),
            html: '<iframe id="tabs_iframe_' + 'customermail' + '" src="' + customerMailUrl + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: false
        },{
            id: 'ordermail',
            title: i18n.getKey('order mail'),
            html: '<iframe id="tabs_iframe_' + 'ordermail' + '" src="' + orderMailUrl + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: false
        }],
        listeners: {
            resize: function () {
                this.setWidth(Ext.getBody().getWidth());
                this.setHeight(Ext.getBody().getHeight());
            }
        }
    });
    //用viewport进行布局
    new Ext.container.Viewport({
        layout: 'border',
        items: [tabPanel]
    })
    var tab = Ext.getCmp("registermail");
    tabPanel.setActiveTab(tab);
})