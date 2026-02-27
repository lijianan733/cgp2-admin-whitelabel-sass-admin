Ext.onReady(function () {


    var managerTemplateFileUrl = path+'partials/config/' + 'managermailtemplatefile.html' + window.location.search;
    
    var tabPanel = Ext.create('Ext.tab.Panel', {
        id: 'ordertemplatetabs',
        width: Ext.getBody().getWidth(),
        height: 800,
        region: 'center',
        items: [{
            id: 'managerMailTemplateFile',
            title: i18n.getKey('managerMailTemplateFile'),
            html: '<iframe id="tabs_iframe_' + 'ticketreceiver' + '" src="' + managerTemplateFileUrl + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
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
    /*var tab = Ext.getCmp("usermailtemplate");
    tabPanel.setActiveTab(tab);*/


});


function addServerFileEditTab (id, tabTitle) {
    var urll = path + 'partials/' + 'config' + '/' + 'managerfileedit' + '.html';
    var title = tabTitle + "_" + i18n.getKey('create');
    if (id != null && id != 'undefined') {
        urll = urll + '?id=' + id;
        title = tabTitle + "_" + i18n.getKey('edit');
    }
    var tabPanel = Ext.getCmp('ordertemplatetabs');
    var tab = Ext.getCmp('servertplfileedit');
    if (tab == null) {
        var tab = tabPanel.add({
            id: 'servertplfileedit',
            title: title,
            html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: true
        });
    } else {
        tab.setTitle(title);
        tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

    }
    tabPanel.setActiveTab(tab);
}