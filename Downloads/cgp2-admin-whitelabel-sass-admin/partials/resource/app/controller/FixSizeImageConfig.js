Ext.define('CGP.resource.controller.FixSizeImageConfig', {
    extend: 'Ext.app.Controller',
    stores: [
        'FixSizeImageConfig'
    ],
    models: ['FixSizeImageConfig'],
    views: [
        'dynamicSizeImage.fixSizeImageConfig.Main',
        // 'dynamicSizeImage.fixSizeImageConfig.Edit',
    ],
    init: function () {
        this.control({
            // 'viewport>panel button[itemId=btnSaveFixDC]': {
            //     click: this.saveData
            // },
            'viewport>panel grid button[itemId=createbtn]': {
                click: this.editHandler
            },
        });
    },
    editHandler: function (but, id) {
        var resourcePanel = window.parent.Ext.getCmp('compositeDisplayObjectSRC').ownerCt;
        var fixSizeDCUrl = path + 'partials/resource/app/view/dynamicSizeImage/fixSizeImageConfig/edit.html?dsId=' + JSGetQueryString('dsId');
        var tabs = resourcePanel.query('#fixSizeImageEdit'),tabDC=null,
            title = i18n.getKey('create') + i18n.getKey('fixSizeImageConfig');
        if (id) {
            fixSizeDCUrl += '&id=' + id;
            title = i18n.getKey('edit') + i18n.getKey('fixSizeImageConfig') + '(' + id + ')';
        }
        if (tabs.length>0) {
            tabDC=tabs[0];
            tabDC.update('<iframe id="tabs_iframe_fixSizeImageEdit" src="' + fixSizeDCUrl + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        } else {
            tabDC = resourcePanel.add(
                {
                    id: 'fixSizeImageEdit',
                    title: title,
                    origin: window.location.href,
                    html: '<iframe id="tabs_iframe_fixSizeImageEdit" src="' + fixSizeDCUrl + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                    closable: true
                }
            );
        }
        resourcePanel.setActiveTab(tabDC);
    },
});