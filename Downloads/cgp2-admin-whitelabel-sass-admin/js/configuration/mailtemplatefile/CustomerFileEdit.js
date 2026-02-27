/**
 * 国家设置的编辑页面Extjs
 */
Ext.Loader.syncRequire('CGP.configuration.mailtemplatefile.MailTemplateFileModel');
Ext.onReady(function () {


    // JS的去url的参数的方法，用来页面间传参
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.parent.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    var websiteId = getQueryString("websiteId");
    var mailTemplateTabs = window.parent.Ext.getCmp('ordertemplatetabs');
    Ext.ModelManager.getModel('CGP.configuration.mailtemplatefile.MailTemplateFileModel').getProxy().extraParams =  {target: 'customer',websiteId: websiteId};
    var page = Ext.widget({
        block: 'mailtemplate',
        xtype: 'uxeditpage',
        columns: 1,
        gridPage: 'customermailtemplatefile.html',
        tbarCfg: {
            btnGrid:{
                handler: function () {
                    mailTemplateTabs.setActiveTab(window.parent.Ext.getCmp('customerMailTemplateFile'));
                }
            }

        },
        formCfg: {
            model: 'CGP.configuration.mailtemplatefile.MailTemplateFileModel',
            remoteCfg: false,
            columnCount: 1,
            items: [
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name',
                    allowBlank: false
                },
                {
                    name: 'description',
                    xtype: 'textarea',
                    width: 450,
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                },  {
                    name: 'content',
                    width: 600,
                    height: 400,
                    xtype: 'textarea',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('content'),
                    itemId: 'content'
            }]
        },
        listeners: {}
    });
});