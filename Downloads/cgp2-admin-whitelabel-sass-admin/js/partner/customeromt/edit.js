Ext.Loader.syncRequire(['CGP.partner.customeromt.model.Model']);
Ext.onReady(function(){
    var orderStatusStore = Ext.create('CGP.common.store.OrderStatuses',{
        allowNull:false,
    });
    orderStatusStore.on('load', function () {
        this.insert(0, {
            id: null,
            name: i18n.getKey('allStatus')
        });
    });
    orderStatusStore.load();
    var mailTemplateTabs = window.parent.Ext.getCmp('mailTemplateTabs');
    var websiteStore = Ext.create('CGP.partner.store.WebsiteAll');
    var partnerId= parseInt(mailTemplateTabs.partnerId);
    var recordId = JSGetQueryString('id');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var controller = Ext.create('CGP.partner.customeromt.controller.Controller');
    var createOrEdit = Ext.isEmpty(recordId) ? 'create' : 'edit';
    var editPage = Ext.create('CGP.partner.customeromt.view.CreateOrEditForm', {
        websiteStore: websiteStore,
        createOrEdit:createOrEdit,
        recordId: recordId,
        partnerId: partnerId,
        orderStatusStore: orderStatusStore,
        id: 'emailTemplateConfigForm',
        itemId: 'emailTemplateConfigForm',
        listeners: {
            'afterrender': function (view) {
                if (createOrEdit == 'edit') {
                    var MailTemplateStore = Ext.create('CGP.partner.customeromt.store.CustomerOmtStore', {
                        type:'customer',
                        params: {
                            filter: '[{"name":"_id","value":"' + recordId + '","type":"string"}]'
                        }
                    });
                    MailTemplateStore.load(function () {
                        var record = {};
                        record = MailTemplateStore.getAt(0);
                        controller.setFormValue(view, record);
                    });
                }
            }
        }
    });
    page.add(editPage);
    window.deleteEmail = function (itemId) {
        var field = Ext.getCmp(itemId);
        field.ownerCt.remove(field);
    };
    window.downLoad = function (itemId) {
        var field = Ext.getCmp(itemId);
        var fileName =field.fileName;
        const a = document.createElement('a');
        a.setAttribute('href', imageServer+field.name);
        a.setAttribute('download', fileName);
        a.click();
    };
});