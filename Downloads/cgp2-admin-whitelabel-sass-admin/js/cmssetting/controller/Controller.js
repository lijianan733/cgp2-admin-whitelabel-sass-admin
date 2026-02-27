Ext.define('CGP.cmssetting.controller.Controller',{
    previewConfig: function(){

        var cmsstting = Ext.getCmp('cmssetting');
        var websiteId = cmsstting.getComponent('webistePanel').getComponent('website').getValue();
        var url = '../cmssetting/cmssetting.html?websiteId=' + websiteId;
        cmsstting.getComponent('center').removeAll();
        cmsstting.getComponent('center').add({
            layout:'fit',
            html:'<iframe id="tabs_iframe_' + "mail_template" + '" ' +
                'src="' + url+ '" width="100%" height="100%"' +
                ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
                '</iframe>',
            closeable:true
        });

    },
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})