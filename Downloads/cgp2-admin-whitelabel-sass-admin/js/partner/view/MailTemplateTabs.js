Ext.define('CGP.partner.view.MailTemplateTabs', {
    extend: 'Ext.tab.Panel',

    header: false,
    userTemplateUrl: path + 'partials/partner/' + 'mailtemplategrid' + '.html' + window.location.search,
    userTemplateFileUrl: path + 'partials/partner/' + 'customermailtemplatefile.html' + window.location.search,
    serverTemplateUrl: path + 'partials/partner/' + 'serviceomtgrid' + '.html' + window.location.search,
    managerTemplateFileUrl: path + 'partials/partner/' + 'managermailtemplatefile.html' + window.location.search,

    activeTab: 0,
    region: 'center',
    id: 'mailTemplateTabs',
    initComponent: function () {
        var me = this;

        //me.width = Ext.getBody().getWidth() * 0.8;
        //me.height = Ext.getBody().getHeight() * 0.8;
        me.partnerId = me.getQueryString('partnerId');
        me.websiteId = me.getQueryString('websiteId');
        var allOrderStatus = Ext.create('CGP.common.store.OrderStatuses');
        /*me.listeners= {
         show: function(){
         me.myMask.hide();
         }
         };*/
        me.items = [
            {
                id: 'usermailtemplate',
                /*listeners: {
                 added: function(){
                 me.myMask.hide();
                 }
                 },*/
                title: i18n.getKey('user') + i18n.getKey('notifyEmailConfig') + i18n.getKey('manager'),
                html: '<iframe id="tabs_iframe_' + "usermailtemplate" + '" ' +
                    'src="' + me.userTemplateUrl + '" width="100%" height="100%"' +
                    ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
                    '</iframe>',
                closable: false
            },
            {
                id: 'servermailtemplate',
                title: i18n.getKey('server') + i18n.getKey('notifyEmailConfig') + i18n.getKey('manager'),
                html: '<iframe id="tabs_iframe_' + 'servermailtemplate' + '" src="' + me.serverTemplateUrl + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: false
            }
            //去除没用到的旧的配置
            /*,
             {
             id: 'customerMailTemplateFile',
             title: i18n.getKey('customerMailTemplateFile'),
             html: '<iframe id="tabs_iframe_' + 'ticketreceiver' + '" src="' + me.userTemplateFileUrl + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
             closable: false
             },
             {
             id: 'managerMailTemplateFile',
             title: i18n.getKey('managerMailTemplateFile'),
             html: '<iframe id="tabs_iframe_' + 'ticketreceiver' + '" src="' + me.managerTemplateFileUrl + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
             closable: false
             }*/
        ];

        me.callParent(arguments);
    },
    //添加一个用户订单邮件模版   编辑页 到tabPanel中
    addCustEditTab: function (id, tabTitle) {
        var me = this;
        var urll = path + 'partials/' + 'partner' + '/' + 'mailtemplateedit' + '.html';
        var title = tabTitle + "_" + i18n.getKey('create');
        if (id != null && id != 'undefined') {
            urll = urll + '?id=' + id;
            title = tabTitle + "_" + i18n.getKey('edit');
        }

        var tab = Ext.getCmp('custmailtpedit');
        if (tab == null) {
            var tab = me.add({
                id: 'custmailtpedit',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    },
    //添加一个发送给客服的订单邮件模版  编辑页  到tabPanel页
    addServerEditTab: function (id, tabTitle) {
        var me = this;
        var urll = path + 'partials/' + 'partner' + '/' + 'serviceomtedit' + '.html';
        var title = tabTitle + "_" + i18n.getKey('create');
        if (id != null && id != 'undefined') {
            urll = urll + '?id=' + id;
            title = tabTitle + "_" + i18n.getKey('edit');
        }
        var tab = Ext.getCmp('servermailtpedit');
        if (tab == null) {
            var tab = me.add({
                id: 'servermailtpedit',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    },
    addCustFileEditTab: function (id, tabTitle) {
        var me = this;
        var urll = path + 'partials/' + 'partner' + '/' + 'customerfileedit' + '.html';
        var title = tabTitle + "_" + i18n.getKey('create');
        if (id != null && id != 'undefined') {
            urll = urll + '?id=' + id;
            title = tabTitle + "_" + i18n.getKey('edit');
        }

        var tab = Ext.getCmp('cutomertplfileedit');
        if (tab == null) {
            var tab = me.add({
                id: 'cutomertplfileedit',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    },
    addServerFileEditTab: function (id, tabTitle) {
        var me = this;
        var urll = path + 'partials/' + 'partner' + '/' + 'managerfileedit' + '.html';
        var title = tabTitle + "_" + i18n.getKey('create');
        if (id != null && id != 'undefined') {
            urll = urll + '?id=' + id;
            title = tabTitle + "_" + i18n.getKey('edit');
        }

        var tab = Ext.getCmp('servertplfileedit');
        if (tab == null) {
            var tab = me.add({
                id: 'servertplfileedit',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + urll + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

})
