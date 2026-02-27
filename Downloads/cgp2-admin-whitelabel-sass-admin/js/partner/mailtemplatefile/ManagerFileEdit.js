/**
 * 国家设置的编辑页面Extjs
 */
Ext.Loader.syncRequire('CGP.partner.mailtemplatefile.MailTemplateFileModel');
Ext.onReady(function () {
    var mailTemplateTabs = window.parent.Ext.getCmp('mailTemplateTabs');
    var websiteId = mailTemplateTabs.websiteId;
    var partnerId = mailTemplateTabs.partnerId;
    Ext.ModelManager.getModel('CGP.partner.mailtemplatefile.MailTemplateFileModel').getProxy().extraParams =  {target: 'manager',partnerId: partnerId,websiteId: websiteId};
    var page = Ext.widget({
        block: 'partner',
        xtype: 'uxeditpage',
        gridPage: 'managermailtemplatefile.html',
        tbarCfg: {
            btnGrid:{
                handler: function () {
                    mailTemplateTabs.setActiveTab(window.parent.Ext.getCmp('managerMailTemplateFile'));
                }
            }

        },
        formCfg: {
            model: 'CGP.partner.mailtemplatefile.MailTemplateFileModel',
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
                    fieldLabel: i18n.getKey('pageTitle'),
                    itemId: 'content'
                }]
        },
        listeners: {}
    });
});