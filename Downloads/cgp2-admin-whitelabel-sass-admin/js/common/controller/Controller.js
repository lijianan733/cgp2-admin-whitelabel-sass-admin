Ext.define('CGP.common.controller.Controller', {


    constructor: function () {
        var me = this;
        me.callParent(arguments);

    },

    /**
     * 跳转查看pcs
     */
    checkPCSConfig: function (pcsId) {
        //根据内容跳到v2还是v3
        var url = adminPath + 'api/pageContentSchemas/' + pcsId;
        JSAjaxRequest(url, 'GET', true, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var version = responseText.data.structVersion;
                    var str = '';
                    if (version == 2) {
                        str = ''
                    } else {
                        str = 'V3';
                    }
                    JSOpen({
                        id: `pagecontentschemapage${str.toLowerCase()}`,
                        url: path + `partials/pagecontentschema${str.toLowerCase()}/main.html?pageContentSchemaId=` + pcsId,
                        title: i18n.getKey('pageContentSchema' + str),
                        refresh: true
                    });
                }
            }
        }, false);
    },

})
