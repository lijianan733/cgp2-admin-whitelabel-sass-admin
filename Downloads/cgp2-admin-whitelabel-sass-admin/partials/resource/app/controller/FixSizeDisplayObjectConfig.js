Ext.define('CGP.resource.controller.FixSizeDisplayObjectConfig', {
    extend: 'Ext.app.Controller',
    stores: [
        'FixSizeDisplayObjectConfig'
    ],
    models: ['FixSizeDisplayObjectConfig'],
    views: [
        'compositeDisplayObject.fixSizeDisplayObject.Main',
        'compositeDisplayObject.fixSizeDisplayObject.Edit',
    ],
    init: function () {
        this.control({
            'viewport>panel button[itemId=btnSaveFixDC]': {
                click: this.saveData
            },
            'viewport>panel grid button[itemId=createbtn]': {
                click: this.editHandler
            },
        });
    },
    editHandler: function (but, id) {
        var resourcePanel = window.parent.Ext.getCmp('compositeDisplayObjectSRC').ownerCt;
        var fixSizeDCUrl = path + 'partials/resource/app/view/compositeDisplayObject/fixSizeDisplayObject/edit.html?dcId=' + JSGetQueryString('dcId');
        var tabs = resourcePanel.query('#fixSizeDCEdit'),tabDC=null,
            title = i18n.getKey('create') + i18n.getKey('fixSizeDisplayConfig');
        if (id) {
            fixSizeDCUrl += '&id=' + id;
            title = i18n.getKey('edit') + i18n.getKey('fixSizeDisplayConfig') + '(' + id + ')';
        }
        if (tabs.length>0) {
            tabDC=tabs[0];
            tabDC.update('<iframe id="tabs_iframe_fixSizeDCEdit" src="' + fixSizeDCUrl + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        } else {
            tabDC = resourcePanel.add(
                {
                    id: 'fixSizeDCEdit',
                    title: title,
                    origin: window.location.href,
                    html: '<iframe id="tabs_iframe_fixSizeDCEdit" src="' + fixSizeDCUrl + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                    closable: true
                }
            );
        }
        resourcePanel.setActiveTab(tabDC);
    },
    saveData: function (btn) {
        var form = btn.ownerCt.ownerCt;
        if (!form.isValid()) {
            return false;
        }
        var data = form.getValue();
        var url = adminPath + 'api/fixSizeDisplayObjectConfig', method = 'POST';
        var id = JSGetQueryString('id');
        if (id) {
            method = 'PUT';
            url += '/' + id;
        }
        var callback=function (require, success,response){
            var resp = Ext.JSON.decode(response.responseText);
            if(resp.success){
                form.data=resp.data;
            }
        };
        JSAjaxRequest(url, method, true, data, null, callback)
    }
});