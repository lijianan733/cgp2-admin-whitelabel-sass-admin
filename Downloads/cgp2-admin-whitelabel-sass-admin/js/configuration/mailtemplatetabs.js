Ext.onReady(function () {


    
    var refundUrl = path + 'partials/config/' + 'refundomtgrid' + '.html' + window.location.search;
	var serverTemplateUrl = path + 'partials/config/' + 'serviceomtgrid' + '.html' + window.location.search;
    var userTemplateUrl = path + 'partials/config/' + 'mailtemplategrid' + '.html' + window.location.search;
    var invoiceTemplateUrl = path + 'partials/config/' + 'invoiceomtgrid' + '.html' + window.location.search;
    var ticketReceiverUrl = path + 'partials/config/' + 'ticket.html' + window.location.search;
    var userTemplateFileUrl = path+'partials/config/' + 'customermailtemplatefile.html' + window.location.search;
    var managerTemplateFileUrl = path+'partials/config/' + 'managermailtemplatefile.html' + window.location.search;
    
    var tabPanel = Ext.create('Ext.tab.Panel', {
        id: 'ordertemplatetabs',
        width: Ext.getBody().getWidth(),
        height: 800,
        region: 'center',
        items: [{
            id: 'usermailtemplate',
            title: i18n.getKey('user')+i18n.getKey('notifyEmailConfig')+i18n.getKey('manager'),
            html: '<iframe id="tabs_iframe_' + 'usermailtemplate' + '" src="' + userTemplateUrl + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: false
        },{
        	id: 'servermailtemplate',
            title: i18n.getKey('server')+i18n.getKey('notifyEmailConfig')+i18n.getKey('manager'),
            html: '<iframe id="tabs_iframe_' + 'servermailtemplate' + '" src="' + serverTemplateUrl + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: false
        },{
        	id: 'refundmailtemplate',
            title: i18n.getKey('Refund Mail Template'),
            html: '<iframe id="tabs_iframe_' + 'refundmailtemplate' + '" src="' + refundUrl + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: false
        },{
        	id: 'invoicemailtemplate',
            title: i18n.getKey('Invoice Mail Template'),
            html: '<iframe id="tabs_iframe_' + 'invoicemailtemplate' + '" src="' + invoiceTemplateUrl + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: false
        },{
            id: 'ticketreceiver',
            title: i18n.getKey('ticketReceiver'),
            html: '<iframe id="tabs_iframe_' + 'ticketreceiver' + '" src="' + ticketReceiverUrl + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: false
        },{
            id: 'customerMailTemplateFile',
            title: i18n.getKey('customerMailTemplateFile'),
            html: '<iframe id="tabs_iframe_' + 'ticketreceiver' + '" src="' + userTemplateFileUrl + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: false
        },{
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

//添加一个用户订单邮件模版   编辑页 到tabPanel中
function addCustEditTab(id,tabTitle) {

    var urll = path + 'partials/' + 'config' + '/' + 'edit' + '.html';
    var title = tabTitle +"_"+i18n.getKey('create');
    if (id != null && id != 'undefined') {
        urll = urll + '?id=' + id;
        title = tabTitle +"_"+ i18n.getKey('edit');
    }
    var tabPanel = Ext.getCmp('ordertemplatetabs');
    var tab = Ext.getCmp('custmailtpedit');
    if (tab == null) {
        var tab = tabPanel.add({
            id: 'custmailtpedit',
            title: title,
            html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: true
        });
    } else {
    	tab.setTitle(title);
        tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

    }
    tabPanel.setActiveTab(tab);
};
function returnUserMailTemplate() {
    var tabPanel = Ext.getCmp('ordertemplatetabs');
    var tab = Ext.getCmp('usermailtemplate');
    tabPanel.setActiveTab(tab);
};
function returnServerMailTemplate() {
    var tabPanel = Ext.getCmp('ordertemplatetabs');
    var tab = Ext.getCmp('servermailtemplate');
    tabPanel.setActiveTab(tab);
}


//添加一个发送给客服的订单邮件模版  编辑页  到tabPanel页
function addServerEditTab(id,tabTitle) {
    var urll = path + 'partials/' + 'config' + '/' + 'serviceedit' + '.html';
    var title = tabTitle +"_"+ i18n.getKey('create');
    if (id != null && id != 'undefined') {
        urll = urll + '?id=' + id;
        title = tabTitle +"_"+ i18n.getKey('edit');
    }
    var tabPanel = Ext.getCmp('ordertemplatetabs');
    var tab = Ext.getCmp('servermailtpedit');
    if (tab == null) {
        var tab = tabPanel.add({
            id: 'servermailtpedit',
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

//添加一个退款的订单邮件模版   编辑页  到tabPanel页
function addRefundEditTab(id,tabTitle) {

    var urll = path + 'partials/' + 'config' + '/' + 'refundedit' + '.html';
    var title = tabTitle +"_"+ i18n.getKey('create');
    if (id != null && id != 'undefined') {
        urll = urll + '?id=' + id;
        title = tabTitle +"_"+ i18n.getKey('edit');
    }
    var tabPanel = Ext.getCmp('ordertemplatetabs');
    var tab = Ext.getCmp('refundmailtpedit');
    if (tab == null) {
        var tab = tabPanel.add({
            id: 'refundmailtpedit',
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

//添加一个发票邮件模版  编辑页到 tabs页
function addInvoiceEditTab(id,tabTitle) {

    var urll = path + 'partials/' + 'config' + '/' + 'invoiceedit' + '.html';
    var title = tabTitle +"_"+ i18n.getKey('create');
    if (id != null && id != 'undefined') {
        urll = urll + '?id=' + id;
        title = tabTitle +"_"+ i18n.getKey('edit');
    }
    var tabPanel = Ext.getCmp('ordertemplatetabs');
    var tab = Ext.getCmp('invoicermailtpedit');
    if (tab == null) {
        var tab = tabPanel.add({
            id: 'invoicermailtpedit',
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
function addCustFileEditTab (id, tabTitle) {
    var urll = path + 'partials/' + 'config' + '/' + 'customerfileedit' + '.html';
    var title = tabTitle + "_" + i18n.getKey('create');
    if (id != null && id != 'undefined') {
        urll = urll + '?id=' + id;
        title = tabTitle + "_" + i18n.getKey('edit');
    }
    var tabPanel = Ext.getCmp('ordertemplatetabs');
    var tab = Ext.getCmp('cutomertplfileedit');
    if (tab == null) {
        var tab = tabPanel.add({
            id: 'cutomertplfileedit',
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